/**
 * Next.js instrumentation: runs once when the Node server starts.
 * Ensures LaunchDarkly SDK (with Observability) is initialized before any
 * route loads OpenLLMetry or LLM modules, per recommended init order.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (!process.env.LD_SDK_KEY) return;

  const { getLdClient } = await import("./server/ld.js");
  await getLdClient();
}
