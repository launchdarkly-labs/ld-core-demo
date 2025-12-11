/**
 * LaunchDarkly Observability Utilities (Server-side)
 * Helper functions to record errors directly to LaunchDarkly observability
 */

import { getServerClient } from "../ld-server"

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
 * Record an error to LaunchDarkly observability (Backend)
 * @param error - The error object to record
 * @param message - Optional message describing the error
 * @param metadataOrPayload - Optional metadata object (will be converted to payload) or payload object with string key-value pairs
 * @param source - Optional source identifier (e.g., component name). If metadata contains 'component', it will be used as source
 * @param type - Optional error message type (defaults to "error")
 */
export async function recordErrorToLD(
  error: Error,
  message?: string,
  metadataOrPayload?: Record<string, unknown> | { [key: string]: string },
  source?: string,
  type: ErrorMessageType = "error"
): Promise<void> {
  try {
    // Convert metadata to payload if needed
    const payload = metadataOrPayload 
      ? (typeof metadataOrPayload === "object" && !Array.isArray(metadataOrPayload) && Object.values(metadataOrPayload).every(v => typeof v === "string"))
        ? metadataOrPayload as { [key: string]: string }
        : convertMetadataToPayload(metadataOrPayload as Record<string, unknown>)
      : undefined
    
    // Extract component from payload/metadata to use as source if source not provided
    const finalSource = source || (payload?.component || (metadataOrPayload && typeof metadataOrPayload === "object" && "component" in metadataOrPayload ? String(metadataOrPayload.component) : undefined))
    
    const client = await getServerClient(process.env.LD_SDK_KEY || "")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientAny = client as any
    
    // Try to access the observability plugin from the client
    // The observability instance is stored in the client's internal structure
    if (clientAny._observability) {
      const observability = clientAny._observability
      if (observability && typeof observability.recordError === "function") {
        observability.recordError(error, message, payload, finalSource, type)
        return
      }
    }

    // Alternative: Try to access through plugins array
    if (clientAny._plugins && Array.isArray(clientAny._plugins)) {
      const observabilityPlugin = clientAny._plugins.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (plugin: any) => plugin && typeof plugin.recordError === "function"
      )
      if (observabilityPlugin) {
        observabilityPlugin.recordError(error, message, payload, finalSource, type)
        return
      }
    }

    // Fallback: Try to access through options.plugins
    if (clientAny._options && clientAny._options.plugins) {
      const observabilityPlugin = clientAny._options.plugins.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (plugin: any) => plugin && typeof plugin.recordError === "function"
      )
      if (observabilityPlugin) {
        observabilityPlugin.recordError(error, message, payload, finalSource, type)
        return
      }
    }

    // Last resort: Import Observability and try static method
    const { Observability } = await import("@launchdarkly/observability-node")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (Observability && typeof (Observability as any).recordError === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(Observability as any).recordError(error, message, payload, finalSource, type)
    }
  } catch (err) {
    // Silently fail if observability is not available
    // This ensures the app continues to work even if LD observability fails
    console.warn("Failed to record error to LaunchDarkly observability:", err)
  }
}

