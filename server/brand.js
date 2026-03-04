import {
  getCompletionConfig,
  getJudgeConfig,
  BRAND_COMPLETION_DEFAULT,
} from "./ld.js";
import { converse, converseStructured } from "./bedrock.js";
import { runWithBedrockSpan, setGenAiAttributes } from "./observe-bedrock.js";
import * as defaults from "./ai-config-defaults.js";

const CONFIG_KEY = "brand_agent";
const DEFAULT_MODEL = defaults.brand_agent?.model?.name ?? "anthropic.claude-3-5-sonnet-20241022-v2:0";

/** Bedrock Converse requires the conversation to start with a user message. Ensure that for brand_agent. */
function ensureUserFirst(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return messages;
  if (messages[0].role === "user") return messages;
  return [{ role: "user", content: "Begin." }, ...messages];
}

/**
 * Run the brand completion: get config from LaunchDarkly, call Bedrock Converse for the reply,
 * then run each judge with Bedrock (user-first messages, no SDK patch). Single path.
 */
export async function runBrandAgent(specialistResponse, query, queryType, userContext = {}, options = {}) {
  const log = options.logger ?? (() => {});
  const customerName = userContext.name ?? "there";

  const contextVars = {
    user_key: userContext.user_key ?? "anonymous",
    query,
    customer_name: customerName,
    original_query: query,
    query_type: queryType,
    specialist_response: specialistResponse,
    ...userContext,
  };

  log({ level: "INFO", message: `   Pulling AI config (${CONFIG_KEY})...`, name: "brand" });

  const { config, tracker } = await getCompletionConfig(
    CONFIG_KEY,
    contextVars,
    BRAND_COMPLETION_DEFAULT,
    contextVars
  );

  const modelId = config.model?.name ?? DEFAULT_MODEL;
  const messages = ensureUserFirst(config.messages ?? []);

  const startTime = Date.now();
  let result;
  try {
    result = await runWithBedrockSpan(
      "bedrock.inference.brand",
      CONFIG_KEY,
      options.headers,
      async (span) => {
        const r = await converse(modelId, messages, {
          temperature: 0.5,
          maxTokens: 1024,
          taskName: "brand_agent",
        });
        setGenAiAttributes(span, {
          modelId,
          messages,
          completion: r.content,
          usage: r.usage,
        }, { maxTokens: 1024, temperature: 0.5 });
        return r;
      }
    );
  } catch (err) {
    tracker.trackError();
    throw err;
  }

  tracker.trackSuccess();
  const durationMs = result.durationMs ?? Date.now() - startTime;
  if (result.usage) {
    tracker.trackTokens({
      input: result.usage.inputTokens,
      output: result.usage.outputTokens,
      total: result.usage.totalTokens,
    });
  }
  if (result.ttftMs != null) tracker.trackTimeToFirstToken(result.ttftMs);
  if (typeof tracker.trackDuration === "function") tracker.trackDuration(durationMs);

  const content = (result.content ?? "").trim();
  log({ level: "INFO", message: `   Brand response in ${durationMs}ms`, name: "brand" });

  const judgeResults = await runJudges(config, contextVars, content, log);

  if (judgeResults.length > 0) {
    log({ level: "INFO", message: `   Judges (${judgeResults.length}):`, name: "brand" });
    for (const jr of judgeResults) {
      const name = jr.judgeConfigKey ?? "judge";
      const evals = jr.evals && typeof jr.evals === "object" ? jr.evals : {};
      const parts = Object.entries(evals).map(([k, v]) => {
        const label = k.includes(":") ? k.split(":").pop() : k;
        return `${label}: ${v?.score ?? "—"}${v?.reasoning ? ` — ${String(v.reasoning).slice(0, 80)}…` : ""}`;
      });
      const line = parts.length ? parts.join(" | ") : (jr.error ? `Error: ${jr.error}` : "No scores");
      log({ level: "INFO", message: `      ${name}: ${line}`, name: "brand" });
    }
  }

  return {
    content,
    usage: result.usage,
    ttftMs: result.ttftMs,
    durationMs,
    judgeResults,
    config,
  };
}

/**
 * Run judges from a completion config against given content. Exported so the chat route can run
 * the first run's judges on the second run's content when the second run's LD variation has no judges.
 */
export async function runJudgesWithConfig(config, contextVars, content, log) {
  return runJudges(config, contextVars, content, log);
}

/**
 * Run each judge from config: get judge config, build user-first messages, call Bedrock structured, return normalized results.
 */
async function runJudges(config, contextVars, brandContent, log) {
  const judges = config.judgeConfiguration?.judges ?? [];
  if (judges.length === 0) return [];

  const messageHistory = config.messages
    ? config.messages.map((m) => `${m.role}: ${m.content}`).join("\n")
    : "";

  const results = [];
  for (const judgeEntry of judges) {
    const judgeKey = judgeEntry.key ?? judgeEntry.judgeConfigKey;
    if (!judgeKey) continue;
    const samplingRate = judgeEntry.samplingRate ?? 1;
    if (Math.random() > samplingRate) continue;

    try {
      const judgeConfig = await getJudgeConfig(judgeKey, contextVars, {
        message_history: messageHistory,
        response_to_evaluate: brandContent,
      });
      const { messages: judgeMessages, evaluationMetricKey, model } = judgeConfig;
      if (!evaluationMetricKey || !judgeMessages?.length) continue;

      const substituted = judgeMessages.map((m) => ({
        ...m,
        content: String(m.content ?? "")
          .replace(/\{\{\s*message_history\s*\}\}/g, messageHistory)
          .replace(/\{\{\s*response_to_evaluate\s*\}\}/g, brandContent),
      }));

      const modelId = model ?? DEFAULT_MODEL;
      const out = await converseStructured(modelId, substituted, evaluationMetricKey);
      const evals = out.evaluations && typeof out.evaluations === "object" ? out.evaluations : {};
      const evalForMetric = evals[evaluationMetricKey];
      results.push({
        judgeConfigKey: judgeKey,
        success: !!evalForMetric,
        evals: evalForMetric
          ? { [evaluationMetricKey]: { score: evalForMetric.score, reasoning: evalForMetric.reasoning } }
          : {},
        error: undefined,
      });
    } catch (err) {
      log({ level: "WARN", message: `   Judge ${judgeKey} failed: ${err?.message}`, name: "brand" });
      results.push({
        judgeConfigKey: judgeKey,
        success: false,
        evals: {},
        error: err?.message ?? "Judge failed",
      });
    }
  }
  return results;
}
