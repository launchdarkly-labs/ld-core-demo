/**
 * Wrap each Bedrock LLM call in an LDObserve span so LaunchDarkly Observability shows
 * one span per inference with ld.ai_config.key and gen_ai.* attributes.
 * Uses LDObserve.startWithHeaders so the span is part of the same trace as chat_request.
 *
 * gen_ai format prompt and completion are set as dotted attributes
 * (gen_ai.prompt.0.content, gen_ai.prompt.0.role, ...) so the backend exports nested JSON.
 */
import { context } from "@opentelemetry/api";
import { SpanStatusCode } from "@opentelemetry/api";
import { LDObserve } from "./ld.js";

const PROMPT_MSG_MAX_LEN = 50000;
const COMPLETION_MAX_LEN = 50000;

function truncate(str, maxLen) {
  if (str == null) return "";
  const s = String(str);
  return s.length <= maxLen ? s : s.slice(0, maxLen) + "...[truncated]";
}

/** Set gen_ai.prompt as dotted attributes so export is nested: gen_ai.prompt.0.content, .0.role, .1.content, ... */
function setPromptAttributes(span, messages) {
  if (!span || !Array.isArray(messages)) return;
  messages.forEach((m, i) => {
    const key = String(i);
    const content = truncate(String(m.content ?? ""), PROMPT_MSG_MAX_LEN);
    const role = String(m.role ?? "user");
    span.setAttribute(`gen_ai.prompt.${key}.content`, content);
    span.setAttribute(`gen_ai.prompt.${key}.role`, role);
  });
}

/** Set gen_ai.completion as dotted attributes, same pattern as prompt: gen_ai.completion.0.content, .0.role, .1.content, ... */
function setCompletionAttributes(span, completion) {
  if (!span) return;
  const list = Array.isArray(completion)
    ? completion
    : completion != null && typeof completion === "object"
      ? [completion]
      : [{ content: String(completion ?? ""), role: "assistant" }];
  list.forEach((m, i) => {
    const key = String(i);
    const content = truncate(String(m.content ?? ""), COMPLETION_MAX_LEN);
    const role = String(m.role ?? "assistant");
    span.setAttribute(`gen_ai.completion.${key}.content`, content);
    span.setAttribute(`gen_ai.completion.${key}.role`, role);
  });
}

/**
 * Run an async Bedrock inference inside an LDObserve span. Sets ld.ai_config.key and
 * gen_ai.* on the span, then runs fn(span). Caller should set gen_ai attributes on the
 * span from inside fn; this helper handles span.end() and errors.
 *
 * @param {string} spanName - e.g. "bedrock.inference.triage", "bedrock.inference.brand"
 * @param {string} configKey - AI Config key, e.g. "triage_agent", "brand_agent"
 * @param {Record<string, string> | import('http').IncomingHttpHeaders} headers - Request headers (for trace context)
 * @param {(span: import('@opentelemetry/api').Span) => Promise<T>} fn - Async work; can call span.setAttribute(...)
 * @returns {Promise<T>}
 */
export async function runWithBedrockSpan(spanName, configKey, headers, fn) {
  if (!headers || typeof headers !== "object") {
    return fn(null);
  }
  const { span, ctx } = LDObserve.startWithHeaders(spanName, headers);
  span.setAttribute("ld.ai_config.key", configKey);
  span.setAttribute("deployment.environment", "production");
  try {
    const result = await context.with(ctx, () => fn(span));
    span.end();
    return result;
  } catch (err) {
    span.recordException(err);
    span.setStatus({ code: SpanStatusCode.ERROR, message: err?.message });
    span.end();
    throw err;
  }
}

/**
 * Set gen_ai.* attributes on a span to match gen_ai format structure. Prompt and completion
 * are set as dotted keys (gen_ai.prompt.0.content, gen_ai.completion.0.content, etc.)
 * so the exporter produces nested JSON, not a string.
 */
export function setGenAiAttributes(span, { modelId, messages, completion, usage }, options = {}) {
  if (!span) return;
  try {
    span.setAttribute("gen_ai.request.model", String(modelId ?? ""));

    setPromptAttributes(span, messages);
    setCompletionAttributes(span, completion);

    if (usage) {
      if (typeof usage.inputTokens === "number") {
        span.setAttribute("gen_ai.usage.input_tokens", usage.inputTokens);
        span.setAttribute("gen_ai.usage.prompt_tokens", usage.inputTokens);
      }
      if (typeof usage.outputTokens === "number") {
        span.setAttribute("gen_ai.usage.output_tokens", usage.outputTokens);
        span.setAttribute("gen_ai.usage.completion_tokens", usage.outputTokens);
      }
    }

    if (options.provider !== false) {
      span.setAttribute("gen_ai.provider.name", options.provider ?? "Bedrock");
    }
    if (options.maxTokens != null) {
      span.setAttribute("gen_ai.request.max_tokens", Number(options.maxTokens));
    }
    if (options.temperature != null) {
      span.setAttribute("gen_ai.request.temperature", Number(options.temperature));
    }
  } catch (_) {}
}
