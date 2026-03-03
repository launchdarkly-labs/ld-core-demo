import { getAIConfig, buildMessagesFromLdConfig, TRIAGE_DEFAULT } from "./ld.js";
import { converse } from "./bedrock.js";
import { runWithBedrockSpan, setGenAiAttributes } from "./observe-bedrock.js";

const QUERY_TYPE_LABEL = {
  policy_question: "Policy Specialist",
  provider_lookup: "Provider Specialist",
  scheduler_agent: "Scheduler",
};

export async function runTriage(query, userContext = {}, options = {}) {
  const log = options.logger ?? (() => {});
  const contextVars = {
    user_key: userContext.user_key ?? "anonymous",
    user_context: JSON.stringify(userContext, null, 2),
    query,
    ...userContext,
  };

  const configKey = process.env.LD_AI_CONFIG_KEY || "triage_agent";
  log({ level: "INFO", message: `📥 Pulling AI config from LaunchDarkly (${configKey})...`, name: "triage" });
  const { config, tracker } = await getAIConfig(configKey, contextVars, TRIAGE_DEFAULT);
  const modelId = config.model?.name ?? TRIAGE_DEFAULT.model.name;
  log({ level: "INFO", message: `   Model: ${modelId}`, name: "triage" });

  const messages = buildMessagesFromLdConfig(config, contextVars);
  const systemPreview = (messages.find((m) => m.role === "system")?.content ?? "").slice(0, 120);
  log({ level: "INFO", message: `   Context sent to model (system prompt ~${messages.reduce((n, m) => n + (m.content?.length ?? 0), 0)} chars)`, name: "triage" });

  const startTime = Date.now();
  log({ level: "INFO", message: `🚀 Calling Bedrock (${modelId})...`, name: "triage" });
  let result;
  try {
    result = await runWithBedrockSpan(
      "bedrock.inference.triage",
      configKey,
      options.headers,
      async (span) => {
        const r = await converse(modelId, messages, {
          temperature: 0,
          maxTokens: 1024,
          taskName: "triage_router",
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
  const tok = result.usage;
  log({
    level: "INFO",
    message: `   Response in ${durationMs}ms${tok ? ` · ${tok.inputTokens ?? 0} in / ${tok.outputTokens ?? 0} out tokens` : ""}`,
    name: "triage",
  });
  if (result.usage) {
    tracker.trackTokens({
      input: result.usage.inputTokens,
      output: result.usage.outputTokens,
      total: result.usage.totalTokens,
    });
  }
  if (result.ttftMs != null) tracker.trackTimeToFirstToken(result.ttftMs);
  if (typeof tracker.trackDuration === "function") tracker.trackDuration(result.durationMs ?? (Date.now() - startTime));

  let parsed;
  try {
    const raw = result.content.trim().replace(/^```json?\s*|\s*```$/g, "");
    parsed = JSON.parse(raw);
  } catch {
    parsed = {
      query_type: "scheduler_agent",
      confidence_score: 0.5,
      extracted_context: {},
      escalation_needed: true,
      reasoning: "Failed to parse triage response.",
    };
  }

  const queryType = parsed.query_type ?? "scheduler_agent";
  const confidence = parsed.confidence_score ?? 0;
  const label = QUERY_TYPE_LABEL[queryType] ?? "Scheduler";

  return {
    queryType,
    confidence,
    nextAgent: label,
    reasoning: parsed.reasoning ?? "",
    escalationNeeded: parsed.escalation_needed ?? confidence < 0.7,
    extractedContext: parsed.extracted_context ?? {},
    agentData: {
      triage_router: {
        tokens: result.usage
          ? { input: result.usage.inputTokens, output: result.usage.outputTokens }
          : undefined,
        ttft_ms: result.ttftMs,
        duration_ms: result.durationMs ?? Date.now() - startTime,
        confidence,
        query_type: queryType,
      },
    },
  };
}
