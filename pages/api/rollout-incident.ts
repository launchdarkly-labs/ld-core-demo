import type { NextApiRequest, NextApiResponse } from "next";
import type { LDContext } from "@launchdarkly/node-server-sdk";
import getServerClient from "@/utils/ld-server/serverClient";
import { CANADA_OCTOGON_COUNT } from "@/utils/canadaRollout";

const COLOR_FLAG_KEY = "octogon-deploy-color";
const ERROR_EVENT = "error";
const LATENCY_EVENT = "latency";
const DATABASE_WARNING_EVENT = "database-warning";

const readRegion = (request: NextApiRequest) => {
  const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
  const regionNumber = Number(body?.regionNumber);
  if (!Number.isInteger(regionNumber) || regionNumber < 1 || regionNumber > CANADA_OCTOGON_COUNT) {
    return null;
  }
  return regionNumber;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const sdkKey = process.env.LD_SDK_KEY;
  if (!sdkKey) {
    return response.status(503).json({ error: "LaunchDarkly SDK key is not configured" });
  }

  let regionNumber: number | null = null;
  try {
    regionNumber = readRegion(request);
  } catch {
    return response.status(400).json({ error: "A rollout region is required" });
  }
  if (regionNumber === null) {
    return response.status(400).json({ error: "A rollout region is required" });
  }

  const context: LDContext = {
    kind: "user",
    key: `canada-map-octogon-${regionNumber}`,
    anonymous: true,
    "map-octogon": regionNumber,
  };

  const client = await getServerClient(sdkKey);
  const color = await client.variation(COLOR_FLAG_KEY, context, "grey");
  if (color !== "red") {
    return response.status(409).json({ error: "This region is not red" });
  }

  const latency = 700 + Math.floor(Math.random() * 501);
  client.track(ERROR_EVENT, context);
  client.track(LATENCY_EVENT, context, undefined, latency);
  client.track(DATABASE_WARNING_EVENT, context);
  await client.flush();

  return response.status(200).json({
    tracked: [ERROR_EVENT, LATENCY_EVENT, DATABASE_WARNING_EVENT],
    latency,
  });
}
