/**
 * Step 1 of init order: LaunchDarkly SDK with Observability plugin (traces, errors, logs).
 * The LD client is created only when a request provides an SDK key (from the session after the user connects in the UI).
 * Import this first in any route that uses triage/specialists/bedrock.
 */
import "./ld.js";
