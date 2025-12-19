import { LDObserve } from '@launchdarkly/observability';

type ErrorMessageType = "error" | "warning" | "info"

function convertMetadataToPayload(metadata?: Record<string, unknown>): { [key: string]: string } | undefined {
  if (!metadata) return undefined
  
  const payload: { [key: string]: string } = {}
  for (const [key, value] of Object.entries(metadata)) {
    payload[key] = String(value)
  }
  return payload
}

export function recordErrorToLD(
  error: Error,
  message?: string,
  metadataOrPayload?: Record<string, unknown> | { [key: string]: string },
  source?: string,
  type?: ErrorMessageType
): void {
  const payload = metadataOrPayload 
    ? (typeof metadataOrPayload === "object" && !Array.isArray(metadataOrPayload) && Object.values(metadataOrPayload).every(v => typeof v === "string"))
      ? metadataOrPayload as { [key: string]: string }
      : convertMetadataToPayload(metadataOrPayload as Record<string, unknown>)
    : undefined
  
  const finalSource = source || (payload?.component || (metadataOrPayload && typeof metadataOrPayload === "object" && "component" in metadataOrPayload ? String(metadataOrPayload.component) : undefined))
  
  try {
    if (typeof window === "undefined") {
      return
    }

    if (LDObserve && typeof LDObserve.recordError === "function") {
      // @ts-ignore - type compatibility with LDObserve.recordError
      LDObserve.recordError(error, message, payload, finalSource, type)
      return
    }
  } catch (err) {
    console.warn("Failed to record error to LaunchDarkly observability:", err)
  }
}

