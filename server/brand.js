import { getAIConfig, buildMessagesFromLdConfig, BRAND_AGENT_DEFAULT } from "./ld.js";
import { converse } from "./bedrock.js";

const CONFIG_KEY = "brand_agent";

/**
 * Run the brand agent to turn the specialist's response into the final customer-facing reply.
 * Uses LaunchDarkly AI Config (brand_agent).
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
  };

  log({ level: "INFO", message: `   Pulling AI config (${CONFIG_KEY})...`, name: "brand" });
  const { config, tracker } = await getAIConfig(CONFIG_KEY, contextVars, BRAND_AGENT_DEFAULT);
  const modelId = config.model?.name ?? BRAND_AGENT_DEFAULT.model?.name;
  const messages = buildMessagesFromLdConfig(config, contextVars);

  log({ level: "INFO", message: `   Running brand_agent (${modelId})...`, name: "brand" });
  const startTime = Date.now();
  let result;
  try {
    result = await converse(modelId, messages, {
      temperature: 0.5,
      maxTokens: 1024,
      taskName: "brand_agent",
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
  };
}
