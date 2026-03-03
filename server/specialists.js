import { getAIConfig, buildMessagesFromLdConfig, SPECIALIST_AI_CONFIG } from "./ld.js";
import { converse } from "./bedrock.js";
import { runWithBedrockSpan, setGenAiAttributes } from "./observe-bedrock.js";

/**
 * Run the specialist agent for the given query type. Uses LaunchDarkly AI Config (policy_agent, provider_agent, scheduler_agent).
 * @param {"policy_question"|"provider_lookup"|"scheduler_agent"} queryType
 * @param {string} query - Customer query
 * @param {object} userContext - User context (policy_id, name, location, etc.)
 * @param {{ logger?: (e: object) => void }} options
 */
export async function runSpecialist(queryType, query, userContext = {}, options = {}) {
  const log = options.logger ?? (() => {});
  const { configKey, fallback } = SPECIALIST_AI_CONFIG[queryType] ?? SPECIALIST_AI_CONFIG.scheduler_agent;

  const contextVars = {
    user_key: userContext.user_key ?? "anonymous",
    user_context: JSON.stringify(userContext, null, 2),
    query,
    ...userContext,
  };

  log({ level: "INFO", message: `   Pulling AI config (${configKey})...`, name: "specialist" });
  const { config, tracker } = await getAIConfig(configKey, contextVars, fallback);
  const modelId = config.model?.name ?? fallback.model?.name;
  const messages = buildMessagesFromLdConfig(config, contextVars);

  log({ level: "INFO", message: `   Running ${queryType} specialist (${modelId})...`, name: "specialist" });
  const startTime = Date.now();
  let result;
  try {
    result = await runWithBedrockSpan(
      `bedrock.inference.specialist.${queryType}`,
      configKey,
      options.headers,
      async (span) => {
        const r = await converse(modelId, messages, {
          temperature: 0.3,
          maxTokens: 1024,
          taskName: queryType,
        });
        setGenAiAttributes(span, {
          modelId,
          messages,
          completion: r.content,
          usage: r.usage,
        });
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

  log({
    level: "INFO",
    message: `   Specialist (${queryType}) response in ${durationMs}ms`,
    name: "specialist",
  });

  return {
    content: result.content?.trim() ?? "",
    usage: result.usage,
    ttftMs: result.ttftMs,
    durationMs,
    queryType,
  };
}
