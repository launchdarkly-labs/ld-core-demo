/**
 * Wrap each Bedrock LLM call in an LDObserve span so LaunchDarkly Observability shows
 * one span per inference with ld.ai_config.key and gen_ai.* attributes.
 * Uses LDObserve.startWithHeaders so the span is part of the same trace as chat_request.
 */
import { context } from "@opentelemetry/api";
import { SpanStatusCode } from "@opentelemetry/api";
import { LDObserve } from "./ld.js";

const PROMPT_SNIPPET_LEN = 2000;
const COMPLETION_SNIPPET_LEN = 2000;

function snippet(str, maxLen = PROMPT_SNIPPET_LEN) {
  if (str == null) return "";
  const s = String(str);
  return s.length <= maxLen ? s : s.slice(0, maxLen) + "...[truncated]";
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
 * Set gen_ai.* attributes on a span after an inference (model, prompt snippet, completion snippet, token counts).
 */
export function setGenAiAttributes(span, { modelId, messages, completion, usage }) {
  if (!span) return;
  try {
    span.setAttribute("gen_ai.request.model", String(modelId ?? ""));
    const promptStr =
      Array.isArray(messages) && messages.length
        ? JSON.stringify(
            messages.map((m) => ({ role: m.role ?? "user", content: String(m.content ?? "").slice(0, 500) }))
          )
        : "";
    span.setAttribute("gen_ai.request.prompt", snippet(promptStr, PROMPT_SNIPPET_LEN));
    span.setAttribute("gen_ai.response.completion", snippet(completion ?? "", COMPLETION_SNIPPET_LEN));
    if (usage) {
      if (typeof usage.inputTokens === "number") span.setAttribute("gen_ai.usage.prompt_tokens", usage.inputTokens);
      if (typeof usage.outputTokens === "number")
        span.setAttribute("gen_ai.usage.completion_tokens", usage.outputTokens);
    }
  } catch (_) {}
}
