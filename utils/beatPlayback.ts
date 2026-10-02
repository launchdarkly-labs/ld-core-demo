import type { LDClient, LDContext } from "@launchdarkly/node-server-sdk";

export const BEAT_PLAYBACK_FLAG_KEY = "music-community-playback-enabled";

export const BEAT_ROOM_CONTEXT: LDContext = {
  kind: "user",
  key: "conference-demo",
  anonymous: true,
};

export async function isBeatKickoffEnabled(client: LDClient): Promise<boolean> {
  const detail = await client.variationDetail(BEAT_PLAYBACK_FLAG_KEY, BEAT_ROOM_CONTEXT, false);
  if (detail.reason.kind === "ERROR" && detail.reason.errorKind === "FLAG_NOT_FOUND") {
    return false;
  }
  return detail.value === true;
}
