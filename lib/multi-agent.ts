import {
	BedrockRuntimeClient,
	ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { LDObserve } from "@launchdarkly/observability-node";
import type { LDAIConfigTracker } from "@launchdarkly/server-sdk-ai";
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

/** Request headers for trace context propagation (W3C traceparent) so server spans attach to client trace */
type RequestHeaders = Record<string, string | string[] | undefined>;

interface MultiAgentDeps {
	aiClient: any;
	context: any;
	bedrockClient: BedrockRuntimeClient;
	openai: any;
	userInput: string;
	sourcePassages: string[];
	sendStatus?: (msg: string) => void;
	/** Optional request headers to link server-side spans to the same trace as the client */
	requestHeaders?: RequestHeaders;
	/** AI Config key used for this request — set on spans so LaunchDarkly AIC view links to this trace */
	aiConfigKey?: string;
	/** When true, the Brand Voice agent uses the toxic prompt variation */
	enableToxicPrompt?: boolean;
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

const MAX_SPAN_ATTR_CHARS = 2000;

function truncateForSpan(s: string, max = MAX_SPAN_ATTR_CHARS): string {
	if (s.length <= max) return s;
	return s.slice(0, max) + "...[truncated]";
}

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
	tracker?: LDAIConfigTracker,
	/** Agent label for span name (e.g. triage, specialist, brand_voice) and request headers for trace linking */
	options?: { agentLabel?: string; requestHeaders?: RequestHeaders },
): Promise<LLMCallResult> {
	// OpenTelemetry GenAI semantic conventions: https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans
	const runWithSpan = async (span?: { addEvent: (name: string, attributes?: Record<string, string | number | boolean>) => void }) => {
		const callStart = Date.now();
		const isBedrock = isBedrockModel(modelId);
		let resolvedModelId = modelId;
		if (isBedrock && !resolvedModelId.startsWith("us.")) {
			resolvedModelId = "us." + resolvedModelId;
		}

		const temp = params?.temperature ?? 0.5;
		const maxTokens = params?.maxTokens ?? 1000;
		const providerName = isBedrock ? "aws.bedrock" : "openai";

		// Input in parts format for gen_ai.client.inference.operation.details event
		const inputForEvent = messages.map((m) => ({
			role: m.role,
			parts: [{ content: truncateForSpan(m.content), type: "text" as const }],
		}));
		// Required/recommended gen_ai.* attributes (set at span start)
		LDObserve.setAttributes({
			"gen_ai.operation.name": "chat",
			"gen_ai.provider.name": providerName,
			"gen_ai.request.model": resolvedModelId,
			"gen_ai.request.temperature": temp,
			"gen_ai.request.max_tokens": maxTokens,
			"gen_ai.output.type": "text",
		});

		let result: LLMCallResult;
		if (isBedrock) {
			const systemMsgs = messages.filter((m) => m.role === "system");
			let nonSystemMsgs = messages.filter((m) => m.role !== "system");
			if (nonSystemMsgs.length === 0) {
				nonSystemMsgs = [{ role: "user", content: "Please respond based on the instructions provided." }];
			}
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
			result = {
				content,
				inputTokens: usage.inputTokens ?? 0,
				outputTokens: usage.outputTokens ?? 0,
				durationMs: Date.now() - callStart,
			};
		} else {
			let finalMessages = messages;
			if (!messages.some((m) => m.role === "user")) {
				finalMessages = [...messages, { role: "user", content: "Please respond based on the instructions provided." }];
			}
			const openaiMessages = finalMessages.map((m) => ({
				role: m.role as "system" | "user" | "assistant",
				content: m.content,
			}));
			const createOptions = {
				model: resolvedModelId,
				messages: openaiMessages,
				max_completion_tokens: maxTokens,
				response_format: { type: "text" as const },
			};
			// Use LaunchDarkly AI SDK to call OpenAI and record metrics when tracker is provided
			// https://launchdarkly.com/docs/sdk/ai/node-js
			const resp =
				tracker && typeof tracker.trackOpenAIMetrics === "function"
					? await tracker.trackOpenAIMetrics(() =>
							openai.chat.completions.create(createOptions),
						)
					: await openai.chat.completions.create(createOptions);
			const content = resp.choices?.[0]?.message?.content ?? "";
			result = {
				content,
				inputTokens: resp.usage?.prompt_tokens ?? 0,
				outputTokens: resp.usage?.completion_tokens ?? 0,
				durationMs: Date.now() - callStart,
			};
		}

		// Output in parts format for gen_ai.client.inference.operation.details event
		const outputForEvent = [
			{
				finish_reason: "stop" as const,
				parts: [{ content: truncateForSpan(result.content) }],
			},
		];
		// Usage on the span
		LDObserve.setAttributes({
			"gen_ai.usage.input_tokens": result.inputTokens,
			"gen_ai.usage.output_tokens": result.outputTokens,
			"gen_ai.response.model": resolvedModelId,
		});
		// Record request/response in span event so input/output show up in LaunchDarkly
		if (span && typeof span.addEvent === "function") {
			span.addEvent("gen_ai.client.inference.operation.details", {
				"gen_ai.input.messages": JSON.stringify(inputForEvent),
				"gen_ai.operation.name": "chat",
				"gen_ai.output.messages": JSON.stringify(outputForEvent),
				"has_errors": false,
			});
		}
		return result;
	};

	// Use request headers so this span attaches to the same trace as the client (W3C traceparent)
	const headers = options?.requestHeaders ?? {};
	const spanName = options?.agentLabel ? `chat.${options.agentLabel}` : "chat";
	if (typeof LDObserve?.runWithHeaders === "function") {
		return LDObserve.runWithHeaders(spanName, headers as Record<string, string>, (span) => runWithSpan(span));
	}
	return runWithSpan();
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
	}, triageConfig.tracker, { agentLabel: "triage", requestHeaders: deps.requestHeaders });

	// OpenAI path uses LaunchDarkly AI SDK trackOpenAIMetrics; only track manually for Bedrock
	if (isBedrockModel(modelName)) {
		triageConfig.tracker?.trackSuccess?.();
		if (result.durationMs) triageConfig.tracker?.trackDuration?.(result.durationMs);
		triageConfig.tracker?.trackTokens?.({
			input: result.inputTokens,
			output: result.outputTokens,
			total: result.inputTokens + result.outputTokens,
		});
	}

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

	const result = await callLLM(modelName, messages, bedrockClient, openai, undefined, specialistConfig.tracker, {
		agentLabel: "specialist",
		requestHeaders: deps.requestHeaders,
	});

	// OpenAI path uses LaunchDarkly AI SDK trackOpenAIMetrics; only track manually for Bedrock
	if (isBedrockModel(modelName)) {
		specialistConfig.tracker?.trackSuccess?.();
		if (result.durationMs) specialistConfig.tracker?.trackDuration?.(result.durationMs);
		specialistConfig.tracker?.trackTokens?.({
			input: result.inputTokens,
			output: result.outputTokens,
			total: result.inputTokens + result.outputTokens,
		});
	}

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
	const isToxic = deps.enableToxicPrompt === true;

	pushLog({ level: isToxic ? "WARN" : "INFO", message: `   Pulling AI config (${BRAND_VOICE_CONFIG_KEY})...${isToxic ? " [TOXIC MODE]" : ""}`, name: "brand" });

	const brandContext = isToxic
		? { ...context, ai: { ...(context.ai ?? {}), key: context.ai?.key ?? "ai-brand", toxicPrompt: true } }
		: context;

	const brandConfig = await aiClient.agentConfig(
		BRAND_VOICE_CONFIG_KEY,
		brandContext,
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

	const result = await callLLM(modelName, messages, bedrockClient, openai, undefined, brandConfig.tracker, {
		agentLabel: "brand_voice",
		requestHeaders: deps.requestHeaders,
	});

	// OpenAI path uses LaunchDarkly AI SDK trackOpenAIMetrics; only track manually for Bedrock
	if (isBedrockModel(modelName)) {
		brandConfig.tracker?.trackSuccess?.();
		if (result.durationMs) brandConfig.tracker?.trackDuration?.(result.durationMs);
		brandConfig.tracker?.trackTokens?.({
			input: result.inputTokens,
			output: result.outputTokens,
			total: result.inputTokens + result.outputTokens,
		});
	}

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

	// Link this trace to the AI Config in LaunchDarkly (same attributes as evaluation span so AIC view shows this trace)
	if (deps.aiConfigKey && typeof LDObserve?.setAttributes === "function") {
		LDObserve.setAttributes({
			"feature_flag.key": deps.aiConfigKey,
			"feature_flag.provider.name": "LaunchDarkly",
		});
	}

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
