export const UTM_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

export const UTM_STORAGE_KEY = "ld-demo-utm-params";

/** @param {URLSearchParams | string | null | undefined} input */
export function parseUtmParams(input) {
  const params =
    typeof input === "string"
      ? new URLSearchParams(input)
      : input instanceof URLSearchParams
        ? input
        : null;

  if (!params) return {};

  /** @type {Record<string, string>} */
  const utm = {};
  for (const key of UTM_PARAM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) utm[key] = value;
  }
  return utm;
}

/** @param {Record<string, string>} utm */
export function persistUtmParams(utm) {
  if (typeof window === "undefined" || !Object.keys(utm).length) return;
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  } catch {
    // ignore quota / private mode
  }
}

export function readPersistedUtmParams() {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};

    /** @type {Record<string, string>} */
    const utm = {};
    for (const key of UTM_PARAM_KEYS) {
      const value = parsed[key];
      if (typeof value === "string" && value.trim()) utm[key] = value.trim();
    }
    return utm;
  } catch {
    return {};
  }
}

/**
 * Read UTMs from the current URL, persist when present, otherwise use session.
 * @param {string} [search]
 */
export function resolveUtmParams(search) {
  const fromUrl = parseUtmParams(
    search ?? (typeof window !== "undefined" ? window.location.search : "")
  );
  if (Object.keys(fromUrl).length) {
    persistUtmParams(fromUrl);
    return fromUrl;
  }
  return readPersistedUtmParams();
}

/** @param {Record<string, string>} utm */
export function buildLaunchDarklyContext(utm = {}) {
  return {
    kind: "user",
    key: "visitor-1",
    anonymous: false,
    ...utm,
  };
}
