import {
	BedrockRuntimeClient,
	ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { pushLog } from "./log-stream";

// Types

export type BankingCategory =
	| "accounts"
	| "loans_credit"
	| "investments"
	| "transfers"
	| "customer_support";

interface LLMCallResult {
	content: string;
	inputTokens: number;
	outputTokens: number;
	durationMs: number;
}

export interface TriageResult {
	category: BankingCategory;
	confidence: number;
	reasoning: string;
	durationMs: number;
	inputTokens: number;
	outputTokens: number;
}

export interface SpecialistResult {
	content: string;
	category: BankingCategory;
	specialistLabel: string;
	modelName: string;
	durationMs: number;
	inputTokens: number;
	outputTokens: number;
}

export interface BrandVoiceResult {
	content: string;
	modelName: string;
	durationMs: number;
	inputTokens: number;
	outputTokens: number;
}

export interface MultiAgentResult {
	finalResponse: string;
	triage: TriageResult;
	specialist: SpecialistResult;
	brandVoice: BrandVoiceResult;
	totalInputTokens: number;
	totalOutputTokens: number;
}

interface MultiAgentDeps {
	aiClient: any;
	context: any;
	bedrockClient: BedrockRuntimeClient;
	openai: any;
	userInput: string;
	sourcePassages: string[];
	sendStatus?: (msg: string) => void;
}

// Config keys — must match what DemoBuilder provisions in LD

const TRIAGE_CONFIG_KEY = "ai-config--togglebot-triage";

const SPECIALIST_CONFIG_KEYS: Record<BankingCategory, string> = {
	accounts: "ai-config--togglebot-accounts-specialist",
	loans_credit: "ai-config--togglebot-loans-specialist",
	investments: "ai-config--togglebot-investments-specialist",
	transfers: "ai-config--togglebot-transfers-specialist",
	customer_support: "ai-config--togglebot-support-specialist",
};

const BRAND_VOICE_CONFIG_KEY = "ai-config--togglebot-brand-voice";

const CATEGORY_LABELS: Record<BankingCategory, string> = {
	accounts: "Accounts",
	loans_credit: "Loans & Credit",
	investments: "Investments",
	transfers: "Transfers",
	customer_support: "Customer Support",
};

// Helpers

function isBedrockModel(modelName: string): boolean {
	const patterns = [
		"anthropic.claude", "amazon.titan", "amazon.nova",
		"meta.llama", "cohere.command", "ai21.jurassic",
		"stability.stable-diffusion", "mistral.mistral", "deepseek.deepseek",
	];
	return patterns.some((p) => modelName.includes(p));
}

function configToMessages(config: any): Array<{ role: string; content: string }> {
	if (config.messages && config.messages.length > 0) {
		return config.messages.map((m: any) => ({
			role: m.role as string,
			content: m.content as string,
		}));
	}
	if (config.instructions) {
		return [{ role: "system", content: config.instructions as string }];
	}
	return [];
}

async function callLLM(
	modelId: string,
	messages: Array<{ role: string; content: string }>,
	bedrockClient: BedrockRuntimeClient,
	openai: any,
	params?: { temperature?: number; maxTokens?: number },
): Promise<LLMCallResult> {
	const callStart = Date.now();
	const isBedrock = isBedrockModel(modelId);
	let resolvedModelId = modelId;
	if (isBedrock && !resolvedModelId.startsWith("us.")) {
		resolvedModelId = "us." + resolvedModelId;
	}

	const temp = params?.temperature ?? 0.5;
	const maxTokens = params?.maxTokens ?? 1000;

	if (isBedrock) {
		const systemMsgs = messages.filter((m) => m.role === "system");
		const nonSystemMsgs = messages.filter((m) => m.role !== "system");
		const bedrockMessages = nonSystemMsgs.map((m) => ({
			role: m.role as "user" | "assistant",
			content: [{ text: m.content }],
		}));

		const cmd = new ConverseCommand({
			modelId: resolvedModelId,
			...(systemMsgs.length > 0
				? { system: systemMsgs.map((m) => ({ text: m.content })) }
				: {}),
			messages: bedrockMessages,
			inferenceConfig: { temperature: temp, maxTokens },
		});
		const resp: any = await bedrockClient.send(cmd);
		const content = resp?.output?.message?.content?.[0]?.text ?? "";
		const usage = resp?.usage ?? {};
		return {
			content,
			inputTokens: usage.inputTokens ?? 0,
			outputTokens: usage.outputTokens ?? 0,
			durationMs: Date.now() - callStart,
		};
	} else {
		const openaiMessages = messages.map((m) => ({
			role: m.role as "system" | "user" | "assistant",
			content: m.content,
		}));
		const resp = await openai.chat.completions.create({
			model: resolvedModelId,
			messages: openaiMessages,
			max_completion_tokens: maxTokens,
			response_format: { type: "text" },
		});
		const content = resp.choices?.[0]?.message?.content ?? "";
		return {
			content,
			inputTokens: resp.usage?.prompt_tokens ?? 0,
			outputTokens: resp.usage?.completion_tokens ?? 0,
			durationMs: Date.now() - callStart,
		};
	}
}

// Agent functions — each pulls its own AI config from LD

async function runTriageAgent(deps: MultiAgentDeps): Promise<TriageResult> {
	const { aiClient, context, bedrockClient, openai, userInput } = deps;

	pushLog({ level: "INFO", message: `🗂️ Triage — classifying query...`, name: "triage" });
	pushLog({ level: "INFO", message: `   Pulling AI config (${TRIAGE_CONFIG_KEY})...`, name: "triage" });

	const triageConfig = await aiClient.agentConfig(
		TRIAGE_CONFIG_KEY,
		context,
		{ enabled: false },
		{ userInput },
	);

	if (!triageConfig.enabled || !triageConfig.model) {
		pushLog({ level: "WARN", message: `   Triage config disabled — defaulting to customer_support`, name: "triage" });
		return {
			category: "customer_support",
			confidence: 0.5,
			reasoning: "Triage config unavailable",
			durationMs: 0,
			inputTokens: 0,
			outputTokens: 0,
		};
	}

	const modelName = triageConfig.model.name;
	pushLog({ level: "INFO", message: `   Model: ${modelName}`, name: "triage" });

	const messages = configToMessages(triageConfig);

	const result = await callLLM(modelName, messages, bedrockClient, openai, {
		temperature: 0,
		maxTokens: 256,
	});

	triageConfig.tracker?.trackSuccess?.();
	if (result.durationMs) triageConfig.tracker?.trackDuration?.(result.durationMs);
	triageConfig.tracker?.trackTokens?.({
		input: result.inputTokens,
		output: result.outputTokens,
		total: result.inputTokens + result.outputTokens,
	});

	let parsed: { category?: string; confidence?: number; reasoning?: string };
	try {
		const raw = result.content.trim().replace(/^```json?\s*|\s*```$/g, "");
		parsed = JSON.parse(raw);
	} catch {
		parsed = { category: "customer_support", confidence: 0.5, reasoning: "Could not parse triage response" };
	}

	const category = (Object.keys(CATEGORY_LABELS).includes(parsed.category ?? "")
		? parsed.category
		: "customer_support") as BankingCategory;
	const confidence = typeof parsed.confidence === "number" ? parsed.confidence : 0.5;
	const label = CATEGORY_LABELS[category];

	pushLog({
		level: "INFO",
		message: `✅ Triage ==> ${label} @ ${(confidence * 100).toFixed(0)}% confidence`,
		name: "chat",
	});

	return {
		category,
		confidence,
		reasoning: parsed.reasoning ?? "",
		durationMs: result.durationMs,
		inputTokens: result.inputTokens,
		outputTokens: result.outputTokens,
	};
}

async function runSpecialistAgent(
	category: BankingCategory,
	deps: MultiAgentDeps,
): Promise<SpecialistResult> {
	const { aiClient, context, bedrockClient, openai, userInput, sourcePassages } = deps;
	const configKey = SPECIALIST_CONFIG_KEYS[category];
	const label = CATEGORY_LABELS[category];

	pushLog({ level: "INFO", message: `   Pulling AI config (${configKey})...`, name: "specialist" });

	const specialistConfig = await aiClient.agentConfig(
		configKey,
		context,
		{ enabled: false },
		{ userInput },
	);

	if (!specialistConfig.enabled || !specialistConfig.model) {
		pushLog({ level: "WARN", message: `   ${label} specialist config disabled — using fallback`, name: "specialist" });
		return {
			content: `I'd be happy to help with your ${label.toLowerCase()} question. Please contact ToggleBank support for detailed assistance.`,
			category,
			specialistLabel: label,
			modelName: "fallback",
			durationMs: 0,
			inputTokens: 0,
			outputTokens: 0,
		};
	}

	const modelName = specialistConfig.model.name;
	pushLog({ level: "INFO", message: `   Running ${category} specialist (${modelName})...`, name: "specialist" });

	let messages = configToMessages(specialistConfig);

	if (sourcePassages.length > 0) {
		const ragContext = `\n\nUse the following reference material to inform your answer. Only use facts from this material:\n\n${sourcePassages.join("\n\n---\n\n")}`;
		messages = messages.map((m: { role: string; content: string }) =>
			m.role === "system" ? { ...m, content: m.content + ragContext } : m,
		);
	}

	const result = await callLLM(modelName, messages, bedrockClient, openai);

	specialistConfig.tracker?.trackSuccess?.();
	if (result.durationMs) specialistConfig.tracker?.trackDuration?.(result.durationMs);
	specialistConfig.tracker?.trackTokens?.({
		input: result.inputTokens,
		output: result.outputTokens,
		total: result.inputTokens + result.outputTokens,
	});

	pushLog({
		level: "INFO",
		message: `   Specialist (${label}) response in ${result.durationMs}ms`,
		name: "specialist",
	});

	return {
		content: result.content,
		category,
		specialistLabel: label,
		modelName,
		durationMs: result.durationMs,
		inputTokens: result.inputTokens,
		outputTokens: result.outputTokens,
	};
}

async function runBrandVoiceAgent(
	specialistResponse: string,
	deps: MultiAgentDeps,
): Promise<BrandVoiceResult> {
	const { aiClient, context, bedrockClient, openai, userInput } = deps;

	pushLog({ level: "INFO", message: `   Pulling AI config (${BRAND_VOICE_CONFIG_KEY})...`, name: "brand" });

	const brandConfig = await aiClient.agentConfig(
		BRAND_VOICE_CONFIG_KEY,
		context,
		{ enabled: false },
		{ userInput, specialist_response: specialistResponse },
	);

	if (!brandConfig.enabled || !brandConfig.model) {
		pushLog({ level: "WARN", message: `   Brand voice config disabled — returning specialist response as-is`, name: "brand" });
		return {
			content: specialistResponse,
			modelName: "passthrough",
			durationMs: 0,
			inputTokens: 0,
			outputTokens: 0,
		};
	}

	const modelName = brandConfig.model.name;

	const messages = configToMessages(brandConfig);

	const result = await callLLM(modelName, messages, bedrockClient, openai);

	brandConfig.tracker?.trackSuccess?.();
	if (result.durationMs) brandConfig.tracker?.trackDuration?.(result.durationMs);
	brandConfig.tracker?.trackTokens?.({
		input: result.inputTokens,
		output: result.outputTokens,
		total: result.inputTokens + result.outputTokens,
	});

	pushLog({
		level: "INFO",
		message: `   Brand response in ${result.durationMs}ms`,
		name: "brand",
	});

	return {
		content: result.content,
		modelName,
		durationMs: result.durationMs,
		inputTokens: result.inputTokens,
		outputTokens: result.outputTokens,
	};
}

// Pipeline orchestrator

export async function runMultiAgentPipeline(
	deps: MultiAgentDeps,
): Promise<MultiAgentResult> {
	const status = deps.sendStatus ?? (() => {});

	// Step 1: Triage
	status("Classifying query...");
	const triage = await runTriageAgent(deps);

	// Step 2: Specialist
	const label = CATEGORY_LABELS[triage.category];
	status(`Consulting ${label} specialist...`);
	const specialist = await runSpecialistAgent(triage.category, deps);

	// Step 3: Brand Voice
	status("Applying brand voice...");
	const brandVoice = await runBrandVoiceAgent(specialist.content, deps);

	const totalInputTokens =
		triage.inputTokens + specialist.inputTokens + brandVoice.inputTokens;
	const totalOutputTokens =
		triage.outputTokens + specialist.outputTokens + brandVoice.outputTokens;

	return {
		finalResponse: brandVoice.content,
		triage,
		specialist,
		brandVoice,
		totalInputTokens,
		totalOutputTokens,
	};
}
