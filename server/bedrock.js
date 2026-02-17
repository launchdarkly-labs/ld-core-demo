import * as traceloop from "@traceloop/node-server-sdk";

const localTesting = process.env.OPENLLMETRY_LOCAL_TESTING === "true" || process.env.OPENLLMETRY_LOCAL_TESTING === "1";
traceloop.initialize({ disableBatch: localTesting });

import {
  BedrockRuntimeClient,
  ConverseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";

function getModelId(name) {
  if (name.startsWith("us.") || name.startsWith("eu.")) return name;
  return `us.${name}`;
}

export async function converse(modelId, messages, options = {}) {
  const client = new BedrockRuntimeClient({ region });
  const id = getModelId(modelId);
  const system = [];
  const converseMessages = [];

  for (const msg of messages) {
    if (msg.role === "system") {
      system.push({ text: msg.content });
    } else {
      converseMessages.push({
        role: msg.role,
        content: [{ text: msg.content }],
      });
    }
  }

  const startTime = Date.now();
  let ttftMs;
  let fullText = "";
  let usage;

  const stream = await client.send(
    new ConverseStreamCommand({
      modelId: id,
      messages: converseMessages,
      system: system.length ? system : undefined,
      inferenceConfig: {
        temperature: options.temperature ?? 0,
        maxTokens: options.maxTokens ?? 2000,
      },
    })
  );

  for await (const event of stream.stream ?? []) {
    if (ttftMs === undefined && event.contentBlockDelta?.delta?.text) {
      ttftMs = Date.now() - startTime;
    }
    if (event.contentBlockDelta?.delta?.text) {
      fullText += event.contentBlockDelta.delta.text;
    }
    if (event.metadata?.usage) {
      const u = event.metadata.usage;
      usage = {
        inputTokens: u.inputTokens ?? 0,
        outputTokens: u.outputTokens ?? 0,
        totalTokens: u.totalTokens ?? 0,
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
