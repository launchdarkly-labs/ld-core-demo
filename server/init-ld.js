/**
 * Step 1 of LLM observability init order: LaunchDarkly SDK (with Observability plugin).
 * Must run before any code that loads OpenLLMetry or the LLM provider.
 * Import this module first in any route that uses triage/specialists/bedrock.
 */
import { getLdClient } from "./ld.js";

if (process.env.LD_SDK_KEY) {
  await getLdClient();
}
