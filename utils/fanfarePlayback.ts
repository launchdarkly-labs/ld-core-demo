import type { LDClient, LDContext } from "@launchdarkly/node-server-sdk";

export const FANFARE_FLAG_KEY = "music-community-playback-enabled";

export const FANFARE_CONTEXT: LDContext = {
  kind: "user",
  key: "conference-demo",
  anonymous: true,
};

export async function isFanfareEnabled(client: LDClient): Promise<boolean> {
  const detail = await client.variationDetail(FANFARE_FLAG_KEY, FANFARE_CONTEXT, false);
  if (detail.reason.kind === "ERROR" && detail.reason.errorKind === "FLAG_NOT_FOUND") {
    return false;
  }
  return detail.value === true;
}
