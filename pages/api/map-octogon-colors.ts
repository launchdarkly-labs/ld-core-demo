import type { NextApiRequest, NextApiResponse } from "next";
import type { LDClient, LDContext } from "@launchdarkly/node-server-sdk";
import getServerClient from "@/utils/ld-server/serverClient";
import { BEAT_PLAYBACK_FLAG_KEY, isBeatKickoffEnabled } from "@/utils/beatPlayback";
import {
  CANADA_OCTOGON_COUNT,
  DEPLOY_COLORS,
  type DeployColor,
} from "@/utils/canadaRollout";

const COLOR_FLAG_KEY = "octogon-deploy-color";

const isDeployColor = (value: unknown): value is DeployColor =>
  typeof value === "string" &&
  DEPLOY_COLORS.includes(value as DeployColor);

const evaluateColors = async (client: LDClient): Promise<DeployColor[]> =>
  Promise.all(
    Array.from({ length: CANADA_OCTOGON_COUNT }, async (_, index) => {
      const octogonNumber = index + 1;
      const context: LDContext = {
        kind: "user",
        key: `canada-map-octogon-${octogonNumber}`,
        anonymous: true,
        "map-octogon": octogonNumber,
      };
      const variation = await client.variation(COLOR_FLAG_KEY, context, "grey");
      return isDeployColor(variation) ? variation : "grey";
    })
  );

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const sdkKey = process.env.LD_SDK_KEY;
  if (!sdkKey) {
    return response.status(503).json({ error: "LaunchDarkly SDK key is not configured" });
  }

  const client = await getServerClient(sdkKey);

  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const sendColors = async () => {
    const [colors, playbackEnabled] = await Promise.all([
      evaluateColors(client),
      isBeatKickoffEnabled(client),
    ]);
    response.write(`data: ${JSON.stringify({ colors, playbackEnabled })}\n\n`);
  };

  let closed = false;
  let refreshTimer: ReturnType<typeof setTimeout> | undefined;

  const scheduleRefresh = () => {
    if (closed) return;
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      sendColors().catch((error) => {
        console.error("Failed to push Canada map color update", error);
      });
    }, 100);
  };

  const onFlagUpdate = () => scheduleRefresh();

  try {
    await sendColors();
  } catch (error) {
    console.error("Failed to evaluate Canada map octogon colors", error);
    response.write(`event: error\ndata: ${JSON.stringify({ error: "Unable to evaluate rollout colors" })}\n\n`);
  }

  client.on(`update:${COLOR_FLAG_KEY}`, onFlagUpdate);
  client.on(`update:${BEAT_PLAYBACK_FLAG_KEY}`, onFlagUpdate);

  const heartbeat = setInterval(() => {
    if (!closed) response.write(": keepalive\n\n");
  }, 15000);

  const cleanup = () => {
    if (closed) return;
    closed = true;
    clearInterval(heartbeat);
    clearTimeout(refreshTimer);
    client.off(`update:${COLOR_FLAG_KEY}`, onFlagUpdate);
    client.off(`update:${BEAT_PLAYBACK_FLAG_KEY}`, onFlagUpdate);
  };

  response.on("close", cleanup);
  response.on("error", cleanup);
}
