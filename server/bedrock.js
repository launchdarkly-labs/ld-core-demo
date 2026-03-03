/**
 * LLM calls via LangChain (ChatBedrockConverse).
 * Init order: LaunchDarkly first (init-ld.js), then this file.
 */
import { ChatBedrockConverse } from "@langchain/aws";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

const region =
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

  const llmOptions = {
    model: id,
    region,
    temperature: options.temperature ?? 0,
    maxTokens: options.maxTokens ?? 2000,
    streamUsage: true,
  };
  if (options.guardrailConfig?.guardrailIdentifier && options.guardrailConfig?.guardrailVersion) {
    llmOptions.guardrailConfig = options.guardrailConfig;
  }
  const llm = new ChatBedrockConverse(llmOptions);

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

export async function converse(modelId, messages, options = {}) {
  const { taskName: _taskName, configKey: _configKey, ...opts } = options;
  return converseImpl(modelId, messages, opts);
}

/**
 * Single non-streaming invoke for judges. Messages must end with user; we prepend a user message if first is system (Bedrock requirement).
 * Returns parsed { evaluations: { [evaluationMetricKey]: { score, reasoning } } }.
 */
export async function converseStructured(modelId, messages, evaluationMetricKey, options = {}) {
  let lcMessages = toLangChainMessages(messages);
  if (lcMessages.length > 0 && lcMessages[0].constructor.name === "SystemMessage") {
    lcMessages = [new HumanMessage("Begin the evaluation."), ...lcMessages];
  }
  const jsonInstruction = `Respond with only valid JSON in this exact shape, no other text: {"evaluations": {"${evaluationMetricKey}": {"score": <number 0-1>, "reasoning": "<string>"}}}`;
  lcMessages.push(new HumanMessage(jsonInstruction));

  const id = getModelId(modelId);
  const llm = new ChatBedrockConverse({
    model: id,
    region,
    temperature: 0,
    maxTokens: 1024,
  });
  const response = await llm.invoke(lcMessages);
  const raw = typeof response.content === "string" ? response.content : String(response.content ?? "");
  const trimmed = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    const data = JSON.parse(trimmed);
    return data.evaluations && typeof data.evaluations === "object" ? data : { evaluations: {} };
  } catch {
    return { evaluations: {} };
  }
}
