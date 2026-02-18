/**
 * Next.js instrumentation hook (runs at server startup).
 * LaunchDarkly is initialized from server/init-ld.js when the chat route
 * is first loaded, so we keep this empty to avoid bundling node: deps here.
 */
export async function register() {}
