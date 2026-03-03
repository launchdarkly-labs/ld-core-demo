/**
 * Step 1 of LLM observability init order: LaunchDarkly SDK (with Observability plugin).
 * Must run before any code that loads OpenLLMetry or the LLM provider.
 * Import this module first in any route that uses triage/specialists/bedrock.
 *
 * The LD client is created lazily when a request provides an SDK key (via body.sdkKey
 * or LD_SDK_KEY). We do not initialize at load time so the app can start without
 * a project/SDK key (e.g. before Connect provides one).
 */
import "./ld.js";
