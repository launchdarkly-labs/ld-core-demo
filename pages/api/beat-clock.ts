import type { NextApiRequest, NextApiResponse } from "next";
import { BEAT_BPM, BEAT_LOOP_BARS, BEATS_PER_BAR, type BeatClock } from "@/utils/beatClock";
import { isBeatKickoffEnabled } from "@/utils/beatPlayback";
import getServerClient from "@/utils/ld-server/serverClient";

const globalBeat = globalThis as typeof globalThis & { __ldBeatStartedAt?: number };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<BeatClock | { error: string }>
) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const sdkKey = process.env.LD_SDK_KEY;
  if (!sdkKey) {
    return response.status(503).json({ error: "LaunchDarkly SDK key is not configured" });
  }

  const client = await getServerClient(sdkKey);
  const playbackEnabled = await isBeatKickoffEnabled(client);

  if (playbackEnabled) {
    if (!globalBeat.__ldBeatStartedAt) {
      globalBeat.__ldBeatStartedAt = Date.now();
    }
  } else {
    globalBeat.__ldBeatStartedAt = undefined;
  }

  response.setHeader("Cache-Control", "no-store");
  return response.status(200).json({
    startedAt: playbackEnabled ? globalBeat.__ldBeatStartedAt ?? null : null,
    bpm: BEAT_BPM,
    loopBars: BEAT_LOOP_BARS,
    beatsPerBar: BEATS_PER_BAR,
    playbackEnabled,
  });
}
