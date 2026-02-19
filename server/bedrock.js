/**
 * LLM calls via LangChain (ChatBedrockConverse) for observability.
 * Init order: LaunchDarkly first (init-ld.js), then this file.
 * We use only LangChain instrumentation so spans go through the LangChain provider.
 */
import * as traceloop from "@traceloop/node-server-sdk";
import { ChatBedrockConverse } from "@langchain/aws";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

const localTesting =
  process.env.OPENLLMETRY_LOCAL_TESTING === "true" ||
  process.env.OPENLLMETRY_LOCAL_TESTING === "1";
traceloop.initialize({
  disableBatch: localTesting,
  instrumentModules: { langchain: true },
});

const region =
  process.env.AWS_REGION ||
  process.env.AWS_DEFAULT_REGION ||
  "us-east-1";

function getModelId(name) {
  if (name.startsWith("us.") || name.startsWith("eu.")) return name;
  return `us.${name}`;
}

function toLangChainMessages(messages) {
  return messages.map((m) => {
    const content = typeof m.content === "string" ? m.content : String(m.content);
    if (m.role === "system") return new SystemMessage(content);
    if (m.role === "assistant") return new AIMessage(content);
    return new HumanMessage(content);
  });
}

async function converseImpl(modelId, messages, options) {
  const id = getModelId(modelId);
  const lcMessages = toLangChainMessages(messages);

  const llm = new ChatBedrockConverse({
    model: id,
    region,
    temperature: options.temperature ?? 0,
    maxTokens: options.maxTokens ?? 2000,
    streamUsage: true,
  });

  const startTime = Date.now();
  let ttftMs;
  let fullText = "";
  let usage;

  const stream = await llm.stream(lcMessages);
  for await (const chunk of stream) {
    if (ttftMs === undefined && chunk.content && String(chunk.content).trim()) {
      ttftMs = Date.now() - startTime;
    }
    if (chunk.content) fullText += chunk.content;
    if (chunk.usage_metadata) {
      usage = {
        inputTokens: chunk.usage_metadata.input_tokens ?? 0,
        outputTokens: chunk.usage_metadata.output_tokens ?? 0,
        totalTokens: chunk.usage_metadata.total_tokens ?? 0,
      };
    }
  }

  return {
    content: fullText,
    usage,
    ttftMs,
    durationMs: Date.now() - startTime,
  };
}

/** options.taskName: optional Traceloop task name for the span (e.g. "triage_router", "brand_agent_completion"). */
export async function converse(modelId, messages, options = {}) {
  const { taskName, ...opts } = options;
  if (taskName) {
    return traceloop.withTask(
      { name: taskName },
      async () => converseImpl(modelId, messages, opts)
    );
  }
  return converseImpl(modelId, messages, opts);
}
