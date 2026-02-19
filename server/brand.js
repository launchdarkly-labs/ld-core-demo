import { getLdClient, getCompletionConfig, BRAND_COMPLETION_DEFAULT } from "./ld.js";
import { initAi } from "@launchdarkly/server-sdk-ai";
import { converse } from "./bedrock.js";

const CONFIG_KEY = "brand-agent-completion";
const TOXICITY_THRESHOLD = 0.7;

/** Get toxicity score from judge results (any judge with evals.toxicity or judge key "toxicity"). */
function getToxicityScore(judgeResults) {
  if (!Array.isArray(judgeResults)) return undefined;
  for (const jr of judgeResults) {
    if (jr.evals?.toxicity != null && typeof jr.evals.toxicity.score === "number") {
      return jr.evals.toxicity.score;
    }
    if (jr.judgeConfigKey === "toxicity" && jr.evals && Object.keys(jr.evals).length > 0) {
      const first = Object.values(jr.evals)[0];
      return first?.score;
    }
  }
  return undefined;
}

/**
 * Run the brand completion to turn the specialist's response into the final customer-facing reply.
 * Uses LaunchDarkly AI Config (brand-agent-completion). Prefers createChat + invoke so that
 * judges attached in LD run automatically; falls back to getCompletionConfig + converse when
 * createChat is unavailable (e.g. provider not initialized).
 * @param {string} specialistResponse - Raw response from policy/provider/schedule specialist
 * @param {string} query - Original customer query
 * @param {string} queryType - policy_question | provider_lookup | scheduler_agent
 * @param {object} userContext - User context (name, policy_id, etc.)
 * @param {{ logger?: (e: object) => void }} options
 */
export async function runBrandAgent(specialistResponse, query, queryType, userContext = {}, options = {}) {
  const log = options.logger ?? (() => {});
  const customerName = userContext.name ?? "there";

  const contextVars = {
    user_key: userContext.user_key ?? "anonymous",
    query: query,
    customer_name: customerName,
    original_query: query,
    query_type: queryType,
    specialist_response: specialistResponse,
    ...userContext,
    guardrails: userContext.guardrails !== false,
  };

  const ldContext = {
    kind: "user",
    key: contextVars.user_key,
    ...contextVars,
  };

  log({ level: "INFO", message: `   Pulling AI config (${CONFIG_KEY})...`, name: "brand" });

  const ldClient = await getLdClient();
  const aiClient = initAi(ldClient);
  const chat = await aiClient.createChat(CONFIG_KEY, ldContext, { enabled: false }, contextVars);

  if (chat) {
    // createChat + invoke: judges run automatically and are included in chatResponse.evaluations
    log({ level: "INFO", message: `   Running brand completion (createChat + judges)...`, name: "brand" });
    const startTime = Date.now();
    const chatResponse = await chat.invoke(query);
    const durationMs = Date.now() - startTime;
    const content = (chatResponse.message?.content ?? "").trim();

    log({ level: "INFO", message: `   Brand response in ${durationMs}ms`, name: "brand" });

    let judgeResults = [];
    try {
      const evalResults = await chatResponse.evaluations;
      if (evalResults?.length) {
        log({ level: "INFO", message: `   👨‍⚖️ Judges: ${evalResults.map((r) => r.judgeConfigKey ?? "?").join(", ")}`, name: "brand" });
        for (const jr of evalResults) {
          if (jr.success && jr.evals && Object.keys(jr.evals).length > 0) {
            for (const [metric, evalScore] of Object.entries(jr.evals)) {
              const score = evalScore?.score ?? "—";
              const reasoning = evalScore?.reasoning ?? "";
              log({
                level: "INFO",
                message: `   👨‍⚖️ Judge ${jr.judgeConfigKey ?? "?"} · ${metric}`,
                name: "brand",
              });
              log({
                level: "INFO",
                message: `      Score: ${score}`,
                name: "brand",
              });
              if (reasoning) {
                log({
                  level: "INFO",
                  message: `      "${reasoning}"`,
                  name: "brand",
                });
              }
            }
          }
        }
        judgeResults = evalResults;
      }
    } catch (e) {
      log({ level: "WARN", message: `   👨‍⚖️ Judge evaluations error: ${e?.message ?? e}`, name: "brand" });
    }

    const metrics = chatResponse.metrics ?? {};
    const result = {
      content,
      usage: metrics.usage,
      ttftMs: metrics.timeToFirstTokenMs,
      durationMs,
      judgeResults,
    };

    // Guardrail fallback: if toxicity > threshold and guardrails on, call brand completion again with safety context and return that response
    if (!contextVars.guardrails) {
      log({ level: "INFO", message: "   *** Guardrails turned off ***", name: "brand" });
    } else if (contextVars.guardrail_fallback !== true) {
      const toxicityScore = getToxicityScore(judgeResults);
      if (typeof toxicityScore === "number" && toxicityScore > TOXICITY_THRESHOLD) {
        log({
          level: "INFO",
          message: `   **Guardrails triggered: toxicity ${toxicityScore} > ${TOXICITY_THRESHOLD}; re-running brand voice with safety mode.**`,
          name: "guardrails-triggered",
        });
        const fallbackVars = { ...contextVars, guardrail_fallback: true };
        const { config: fallbackConfig, tracker: fallbackTracker } = await getCompletionConfig(
          CONFIG_KEY,
          fallbackVars,
          BRAND_COMPLETION_DEFAULT,
          fallbackVars
        );
        const fallbackModelId = fallbackConfig.model?.name ?? BRAND_COMPLETION_DEFAULT.model?.name;
        const fallbackMessages = fallbackConfig.messages ?? [];
        const fallbackStart = Date.now();
        let safetyResult;
        try {
          safetyResult = await converse(fallbackModelId, fallbackMessages, {
            temperature: 0.5,
            maxTokens: 1024,
            taskName: "brand_agent_completion",
          });
        } catch (err) {
          fallbackTracker.trackError();
          throw err;
        }
        fallbackTracker.trackSuccess();
        const safetyDurationMs = safetyResult.durationMs ?? Date.now() - fallbackStart;
        if (safetyResult.usage) {
          fallbackTracker.trackTokens({
            input: safetyResult.usage.inputTokens,
            output: safetyResult.usage.outputTokens,
            total: safetyResult.usage.totalTokens,
          });
        }
        if (safetyResult.ttftMs != null) fallbackTracker.trackTimeToFirstToken(safetyResult.ttftMs);
        if (typeof fallbackTracker.trackDuration === "function") fallbackTracker.trackDuration(safetyDurationMs);
        log({ level: "INFO", message: `   Safety re-ran response in ${safetyDurationMs}ms`, name: "brand" });
        return {
          content: (safetyResult.content ?? "").trim(),
          usage: safetyResult.usage,
          ttftMs: safetyResult.ttftMs,
          durationMs: safetyDurationMs,
          judgeResults,
        };
      }
    }

    return result;
  }

  // Fallback: getCompletionConfig + converse (no judges)
  log({ level: "INFO", message: `   createChat unavailable; using completion config + Bedrock (no judges)`, name: "brand" });
  const { config, tracker } = await getCompletionConfig(
    CONFIG_KEY,
    contextVars,
    BRAND_COMPLETION_DEFAULT,
    contextVars
  );
  const modelId = config.model?.name ?? BRAND_COMPLETION_DEFAULT.model?.name;
  const messages = config.messages ?? [];

  const startTime = Date.now();
  let result;
  try {
    result = await converse(modelId, messages, {
      temperature: 0.5,
      maxTokens: 1024,
      taskName: "brand_agent_completion",
    });
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

  log({ level: "INFO", message: `   Brand response in ${durationMs}ms`, name: "brand" });

  return {
    content: result.content?.trim() ?? "",
    usage: result.usage,
    ttftMs: result.ttftMs,
    durationMs,
    judgeResults: [],
  };
}
