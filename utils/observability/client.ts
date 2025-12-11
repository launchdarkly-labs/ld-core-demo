/**
 * LaunchDarkly Observability Utilities (Client-side)
 * Helper functions to record errors directly to LaunchDarkly observability
 */

type ErrorMessageType = "error" | "warning" | "info"

/**
 * Helper function to convert metadata object to payload (string key-value pairs)
 */
function convertMetadataToPayload(metadata?: Record<string, unknown>): { [key: string]: string } | undefined {
  if (!metadata) return undefined
  
  const payload: { [key: string]: string } = {}
  for (const [key, value] of Object.entries(metadata)) {
    payload[key] = String(value)
  }
  return payload
}

/**
 * Record an error to LaunchDarkly observability (Frontend)
 * @param error - The error object to record
 * @param message - Optional message describing the error
 * @param metadataOrPayload - Optional metadata object (will be converted to payload) or payload object with string key-value pairs
 * @param source - Optional source identifier (e.g., component name). If metadata contains 'component', it will be used as source
 * @param type - Optional error message type (defaults to "error")
 */
export function recordErrorToLD(
  error: Error,
  message?: string,
  metadataOrPayload?: Record<string, unknown> | { [key: string]: string },
  source?: string,
  type: ErrorMessageType = "error"
): void {
  // Convert metadata to payload if needed
  const payload = metadataOrPayload 
    ? (typeof metadataOrPayload === "object" && !Array.isArray(metadataOrPayload) && Object.values(metadataOrPayload).every(v => typeof v === "string"))
      ? metadataOrPayload as { [key: string]: string }
      : convertMetadataToPayload(metadataOrPayload as Record<string, unknown>)
    : undefined
  
  // Extract component from payload/metadata to use as source if source not provided
  const finalSource = source || (payload?.component || (metadataOrPayload && typeof metadataOrPayload === "object" && "component" in metadataOrPayload ? String(metadataOrPayload.component) : undefined))
  try {
    // Only run in browser
    if (typeof window === "undefined") {
      return
    }

    // Try to access LDObserve from window (set by LaunchDarkly SDK)
    interface WindowWithLDObserve extends Window {
      LDObserve?: {
        recordError: (
          error: unknown,
          message?: string,
          payload?: { [key: string]: string },
          source?: string,
          type?: ErrorMessageType
        ) => void
      }
    }
    const LDObserve = (window as unknown as WindowWithLDObserve).LDObserve
    if (LDObserve && typeof LDObserve.recordError === "function") {
      LDObserve.recordError(error, message, payload, finalSource, type)
      return
    }
  } catch (err) {
    // Silently fail if observability is not available
    // This ensures the app continues to work even if LD observability fails
    console.warn("Failed to record error to LaunchDarkly observability:", err)
  }
}

