import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { pushLog } from "./log-stream";
import { callLLM, configToMessages } from "./multi-agent";
import {
	AirwaysIntent,
	AIRWAYS_INTENTS,
	INTENT_LABELS,
	getEvalSubset,
} from "./airways-eval-dataset";
import {
	getAiConfig,
	createVariation,
	updateFallthroughTargeting,
} from "./airways-ld-api";

// AI Config keys
const TRIAGE_CONFIG_KEY = "ai-config--launchairways-triage";
const EVAL_CONFIG_KEY = "ai-config--launchairways-triage-eval";
const IMPROVER_CONFIG_KEY = "ai-config--launchairways-triage-improver";

// Types

export interface ClassifyResult {
	intent: AirwaysIntent;
	confidence: number;
	reasoning: string;
	inputTokens: number;
	outputTokens: number;
	durationMs: number;
}

export interface EvalResult {
	correct: boolean;
	score: number;
	reasoning: string;
	inputTokens: number;
	outputTokens: number;
	durationMs: number;
}

export interface ImproveResult {
	improved: boolean;
	newPrompt: string;
	oldAccuracy: number;
	newAccuracy: number;
	pushedToLD: boolean;
	reverted: boolean;
	newVariationKey?: string;
}

export interface ClassifierPipelineResult {
	classification: ClassifyResult;
	eval?: EvalResult;
	improvement?: ImproveResult;
}

export interface ClassifierPipelineDeps {
	aiClient: any;
	context: any;
	bedrockClient: BedrockRuntimeClient;
	openai: any;
	userInput: string;
	expectedIntent?: AirwaysIntent;
	sendStatus?: (msg: string) => void;
}

// Stage 1: Classify

async function classifyIntent(deps: ClassifierPipelineDeps): Promise<ClassifyResult> {
	const { aiClient, context, bedrockClient, openai, userInput } = deps;

	pushLog({ level: "INFO", message: `🗂️ Triage — classifying intent...`, name: "classifier" });
	pushLog({ level: "INFO", message: `   Pulling AI config (${TRIAGE_CONFIG_KEY})...`, name: "classifier" });

	const config = await aiClient.config(
		TRIAGE_CONFIG_KEY,
		context,
		{ enabled: false },
		{ userInput },
	);

	if (!config.enabled || !config.model) {
		pushLog({ level: "WARN", message: `   Triage config disabled — defaulting to flight_booking`, name: "classifier" });
		return {
			intent: "flight_booking",
			confidence: 0,
			reasoning: "Config unavailable",
			inputTokens: 0,
			outputTokens: 0,
			durationMs: 0,
		};
	}

	const modelName = config.model.name;
	pushLog({ level: "INFO", message: `   Model: ${modelName}`, name: "classifier" });

	const messages = configToMessages(config);
	const result = await callLLM(modelName, messages, bedrockClient, openai, {
		temperature: 0,
		maxTokens: 256,
	});

	config.tracker?.trackSuccess?.();
	if (result.durationMs) config.tracker?.trackDuration?.(result.durationMs);
	config.tracker?.trackTokens?.({
		input: result.inputTokens,
		output: result.outputTokens,
		total: result.inputTokens + result.outputTokens,
	});

	let parsed: { intent?: string; confidence?: number; reasoning?: string };
	try {
		const raw = result.content.trim().replace(/^```json?\s*|\s*```$/g, "");
		parsed = JSON.parse(raw);
	} catch {
		parsed = { intent: "flight_booking", confidence: 0, reasoning: "Could not parse response" };
	}

	const intent = (AIRWAYS_INTENTS.includes(parsed.intent as AirwaysIntent)
		? parsed.intent
		: "flight_booking") as AirwaysIntent;
	const confidence = typeof parsed.confidence === "number" ? parsed.confidence : 0;

	pushLog({
		level: "INFO",
		message: `   Result: ${INTENT_LABELS[intent]} (${(confidence * 100).toFixed(0)}% confidence)`,
		name: "classifier",
	});

	return {
		intent,
		confidence,
		reasoning: parsed.reasoning ?? "",
		inputTokens: result.inputTokens,
		outputTokens: result.outputTokens,
		durationMs: result.durationMs,
	};
}

// Stage 2: Eval

async function evalClassification(
	classification: ClassifyResult,
	deps: ClassifierPipelineDeps,
): Promise<EvalResult> {
	const { aiClient, context, bedrockClient, openai, userInput, expectedIntent } = deps;

	pushLog({ level: "INFO", message: `⚖️ Eval — judging classification...`, name: "eval" });
	pushLog({ level: "INFO", message: `   Pulling AI config (${EVAL_CONFIG_KEY})...`, name: "eval" });

	const config = await aiClient.config(
		EVAL_CONFIG_KEY,
		context,
		{ enabled: false },
		{
			userInput,
			predictedIntent: classification.intent,
			expectedIntent: expectedIntent!,
			classifierReasoning: classification.reasoning,
		},
	);

	if (!config.enabled || !config.model) {
		pushLog({ level: "WARN", message: `   Eval config disabled — skipping`, name: "eval" });
		const correct = classification.intent === expectedIntent;
		return {
			correct,
			score: correct ? 1 : 0,
			reasoning: "Eval config unavailable — used exact match",
			inputTokens: 0,
			outputTokens: 0,
			durationMs: 0,
		};
	}

	const modelName = config.model.name;
	pushLog({ level: "INFO", message: `   Model: ${modelName}`, name: "eval" });

	const messages = configToMessages(config);
	const result = await callLLM(modelName, messages, bedrockClient, openai, {
		temperature: 0,
		maxTokens: 512,
	});

	config.tracker?.trackSuccess?.();
	if (result.durationMs) config.tracker?.trackDuration?.(result.durationMs);
	config.tracker?.trackTokens?.({
		input: result.inputTokens,
		output: result.outputTokens,
		total: result.inputTokens + result.outputTokens,
	});

	let parsed: { correct?: boolean; reasoning?: string };
	try {
		const raw = result.content.trim().replace(/^```json?\s*|\s*```$/g, "");
		parsed = JSON.parse(raw);
	} catch {
		const correct = classification.intent === expectedIntent;
		parsed = { correct, reasoning: "Could not parse eval response — used exact match" };
	}

	const correct = parsed.correct ?? (classification.intent === expectedIntent);

	if (correct) {
		pushLog({ level: "INFO", message: `   ✅ Correct — ${INTENT_LABELS[classification.intent]}`, name: "eval" });
	} else {
		pushLog({ level: "WARN", message: `   ❌ Incorrect — predicted: ${INTENT_LABELS[classification.intent]}, expected: ${INTENT_LABELS[expectedIntent!]}`, name: "eval" });
		pushLog({ level: "INFO", message: `   Reason: ${parsed.reasoning ?? "unknown"}`, name: "eval" });
	}

	return {
		correct,
		score: correct ? 1 : 0,
		reasoning: parsed.reasoning ?? "",
		inputTokens: result.inputTokens,
		outputTokens: result.outputTokens,
		durationMs: result.durationMs,
	};
}

// Stage 3: Improve

async function improvePrompt(
	classification: ClassifyResult,
	evalResult: EvalResult,
	deps: ClassifierPipelineDeps,
): Promise<ImproveResult> {
	const { aiClient, context, bedrockClient, openai, userInput, expectedIntent } = deps;

	pushLog({ level: "INFO", message: `🔧 Improver — rewriting triage prompt...`, name: "improver" });
	pushLog({ level: "INFO", message: `   Pulling AI config (${IMPROVER_CONFIG_KEY})...`, name: "improver" });

	// Get the current triage prompt to pass to the improver
	let currentPrompt = "";
	let currentModel = "";
	let currentModelConfigKey = "";
	try {
		const triageFullConfig = await getAiConfig(TRIAGE_CONFIG_KEY);
		// Find the currently-active variation (last one, or we could check targeting)
		const variations = triageFullConfig.variations || [];
		if (variations.length > 0) {
			const latest = variations[variations.length - 1];
			if (latest.messages && latest.messages.length > 0) {
				currentPrompt = latest.messages.map((m: any) => `[${m.role}]: ${m.content}`).join("\n\n");
			} else if (latest.instructions) {
				currentPrompt = latest.instructions;
			}
			currentModel = latest.model?.name || "";
			currentModelConfigKey = latest.modelConfigKey || "";
		}
	} catch (e: any) {
		pushLog({ level: "WARN", message: `   Could not fetch current triage config: ${e.message}`, name: "improver" });
	}

	const config = await aiClient.config(
		IMPROVER_CONFIG_KEY,
		context,
		{ enabled: false },
		{
			currentPrompt,
			evalReasoning: evalResult.reasoning,
			failedQuery: userInput,
			expectedIntent: expectedIntent!,
			predictedIntent: classification.intent,
		},
	);

	if (!config.enabled || !config.model) {
		pushLog({ level: "WARN", message: `   Improver config disabled — skipping`, name: "improver" });
		return {
			improved: false,
			newPrompt: "",
			oldAccuracy: 0,
			newAccuracy: 0,
			pushedToLD: false,
			reverted: false,
		};
	}

	const modelName = config.model.name;
	pushLog({ level: "INFO", message: `   Model: ${modelName}`, name: "improver" });

	const messages = configToMessages(config);
	const result = await callLLM(modelName, messages, bedrockClient, openai, {
		temperature: 0.7,
		maxTokens: 2048,
	});

	config.tracker?.trackSuccess?.();
	if (result.durationMs) config.tracker?.trackDuration?.(result.durationMs);
	config.tracker?.trackTokens?.({
		input: result.inputTokens,
		output: result.outputTokens,
		total: result.inputTokens + result.outputTokens,
	});

	// Extract the new prompt from the improver response
	let newPrompt = result.content.trim();
	// If wrapped in code fences, extract the inner content
	const fenceMatch = newPrompt.match(/^```(?:\w+)?\s*\n?([\s\S]*?)\n?\s*```$/);
	if (fenceMatch) newPrompt = fenceMatch[1].trim();

	pushLog({ level: "INFO", message: `   Generated improved prompt (${newPrompt.length} chars)`, name: "improver" });

	// Validation: run a subset of test cases against old and new prompts
	pushLog({ level: "INFO", message: `   Validating improvement against test cases...`, name: "improver" });

	// Resolve the triage model name once — use currentModel from the LD API fetch above
	const triageModelName = currentModel || modelName;

	const validationSubset = getEvalSubset(7);
	let oldCorrect = 0;
	let newCorrect = 0;

	for (const tc of validationSubset) {
		// Test with current prompt (via the LD config, which serves the current version)
		const currentConfig = await aiClient.config(
			TRIAGE_CONFIG_KEY,
			context,
			{ enabled: false },
			{ userInput: tc.query },
		);
		if (currentConfig.enabled && currentConfig.model) {
			const currentMessages = configToMessages(currentConfig);
			const currentResult = await callLLM(currentConfig.model.name, currentMessages, bedrockClient, openai, {
				temperature: 0,
				maxTokens: 256,
			});
			try {
				const raw = currentResult.content.trim().replace(/^```json?\s*|\s*```$/g, "");
				const parsed = JSON.parse(raw);
				if (parsed.intent === tc.expectedIntent) oldCorrect++;
			} catch { /* count as wrong */ }
		}

		// Test with new prompt directly — always use the triage model, not the improver model
		const newMessages: Array<{ role: string; content: string }> = [
			{ role: "system", content: newPrompt },
			{ role: "user", content: tc.query },
		];
		const newResult = await callLLM(triageModelName, newMessages, bedrockClient, openai, {
			temperature: 0,
			maxTokens: 256,
		});
		try {
			const raw = newResult.content.trim().replace(/^```json?\s*|\s*```$/g, "");
			const parsed = JSON.parse(raw);
			if (parsed.intent === tc.expectedIntent) newCorrect++;
		} catch { /* count as wrong */ }
	}

	const total = validationSubset.length;
	const oldAccuracy = oldCorrect / total;
	const newAccuracy = newCorrect / total;

	pushLog({
		level: "INFO",
		message: `   Validation: old ${(oldAccuracy * 100).toFixed(0)}% (${oldCorrect}/${total}) → new ${(newAccuracy * 100).toFixed(0)}% (${newCorrect}/${total})`,
		name: "improver",
	});

	// Only push if new is at least as good as old
	if (newAccuracy >= oldAccuracy) {
		pushLog({ level: "INFO", message: `   ✅ Improvement validated — pushing to LaunchDarkly...`, name: "improver" });

		try {
			const variationKey = `improved-triage-${Date.now()}`;
			const created = await createVariation(TRIAGE_CONFIG_KEY, {
				key: variationKey,
				name: `Improved Triage v${Date.now()}`,
				model: { name: currentModel || modelName },
				modelConfigKey: currentModelConfigKey || "custom",
				messages: [
					{ role: "system", content: newPrompt },
				],
			});

			const variationId = created._id;
			if (variationId) {
				await updateFallthroughTargeting(TRIAGE_CONFIG_KEY, variationId);
				pushLog({ level: "INFO", message: `   Pushed ${variationKey} to LaunchDarkly ✅`, name: "improver" });
			}

			return {
				improved: true,
				newPrompt,
				oldAccuracy,
				newAccuracy,
				pushedToLD: true,
				reverted: false,
				newVariationKey: variationKey,
			};
		} catch (e: any) {
			pushLog({ level: "ERROR", message: `   Failed to push to LD: ${e.message}`, name: "improver" });
			return {
				improved: true,
				newPrompt,
				oldAccuracy,
				newAccuracy,
				pushedToLD: false,
				reverted: false,
			};
		}
	} else {
		pushLog({ level: "WARN", message: `   ❌ New prompt didn't improve — reverting (keeping previous best)`, name: "improver" });
		return {
			improved: false,
			newPrompt,
			oldAccuracy,
			newAccuracy,
			pushedToLD: false,
			reverted: true,
		};
	}
}

// Pipeline orchestrator

const CONFIDENCE_THRESHOLD = 0.85;

export async function runClassifierPipeline(
	deps: ClassifierPipelineDeps,
): Promise<ClassifierPipelineResult> {
	const status = deps.sendStatus ?? (() => {});

	// Stage 1: Classify
	status("Classifying intent...");
	const classification = await classifyIntent(deps);

	// Stage 2: Eval (if expected intent provided)
	let evalResult: EvalResult | undefined;
	if (deps.expectedIntent) {
		status("Evaluating classification...");
		evalResult = await evalClassification(classification, deps);
	}

	// Stage 3: Improve — trigger if eval failed OR confidence is below threshold
	let improvement: ImproveResult | undefined;
	const lowConfidence = classification.confidence < CONFIDENCE_THRESHOLD;

	if (evalResult && !evalResult.correct) {
		status("Generating prompt improvement...");
		improvement = await improvePrompt(classification, evalResult, deps);
	} else if (lowConfidence) {
		pushLog({
			level: "WARN",
			message: `⚠️ Low confidence (${(classification.confidence * 100).toFixed(0)}% < ${(CONFIDENCE_THRESHOLD * 100).toFixed(0)}%) — triggering prompt improvement`,
			name: "classifier",
		});
		status("Low confidence — generating prompt improvement...");
		const syntheticEval: EvalResult = {
			correct: false,
			score: 0,
			reasoning: `Low confidence classification (${(classification.confidence * 100).toFixed(0)}%) — classifier prompt needs to be more decisive`,
			inputTokens: 0,
			outputTokens: 0,
			durationMs: 0,
		};
		improvement = await improvePrompt(classification, syntheticEval, deps);
	}

	return { classification, eval: evalResult, improvement };
}
