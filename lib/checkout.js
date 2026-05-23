export const SUBSCRIBER_FLOW_FLAG_KEY = "subscriber-flow-version";

/** @param {unknown} raw */
export function normalizeSubscriberFlowVariation(raw) {
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && "value" in raw) {
    const value = raw.value;
    if (typeof value === "string") return value;
  }
  return undefined;
}

/**
 * @param {import("launchdarkly-js-client-sdk").LDClient | undefined} ldClient
 */
export function getSubscriberFlowEvaluation(ldClient) {
  if (!ldClient) {
    return { value: undefined, reason: null, flagInPayload: false };
  }

  const detail = ldClient.variationDetail(SUBSCRIBER_FLOW_FLAG_KEY, "v1");
  const flagInPayload = Object.prototype.hasOwnProperty.call(
    ldClient.allFlags(),
    SUBSCRIBER_FLOW_FLAG_KEY
  );
  const reason = detail?.reason ?? null;
  const usedDefault =
    reason?.kind === "ERROR" && reason?.errorKind === "FLAG_NOT_FOUND";

  return {
    value: normalizeSubscriberFlowVariation(detail?.value),
    reason,
    flagInPayload,
    usedDefault,
  };
}

/** @param {import("launchdarkly-js-client-sdk").LDClient | undefined} ldClient */
export function getSubscriberFlowVariation(ldClient) {
  const { value, usedDefault } = getSubscriberFlowEvaluation(ldClient);
  if (value) return value;
  return usedDefault ? undefined : "v1";
}

/** @param {string | undefined} variation */
export function subscribeFlowHref(variation) {
  return `/subscribe/${variation ?? "v1"}`;
}
