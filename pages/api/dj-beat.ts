import type { NextApiRequest, NextApiResponse } from "next";
import {
  beatSnapshot,
  castBeatVote,
  isBeatChoice,
  resetBeatVotes,
  type DjBeatSnapshot,
} from "@/utils/djBeat";

type Listener = {
  response: NextApiResponse;
};

const listeners = globalThis as typeof globalThis & { __djBeatListeners?: Set<Listener> };

const subscriberSet = () => {
  if (!listeners.__djBeatListeners) listeners.__djBeatListeners = new Set();
  return listeners.__djBeatListeners;
};

const publish = (snapshot: DjBeatSnapshot) => {
  const payload = `data: ${JSON.stringify(snapshot)}\n\n`;
  for (const listener of subscriberSet()) {
    try {
      listener.response.write(payload);
    } catch {
      subscriberSet().delete(listener);
    }
  }
};

const readBody = (
  request: NextApiRequest
): { voterId?: unknown; choice?: unknown; action?: unknown; resetAt?: unknown; castAt?: unknown } => {
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body) as {
        voterId?: unknown;
        choice?: unknown;
        action?: unknown;
        resetAt?: unknown;
        castAt?: unknown;
      };
    } catch {
      return {};
    }
  }
  return (request.body ?? {}) as {
    voterId?: unknown;
    choice?: unknown;
    action?: unknown;
    resetAt?: unknown;
    castAt?: unknown;
  };
};

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "POST") {
    const body = readBody(request);
    if (body.action === "reset") {
      const snapshot = resetBeatVotes();
      publish(snapshot);
      return response.status(200).json(snapshot);
    }

    const voterId = typeof body.voterId === "string" ? body.voterId.trim() : "";
    if (voterId.length < 8 || voterId.length > 80 || !isBeatChoice(body.choice)) {
      return response.status(400).json({ error: "A voter id and a speed or safe choice are required" });
    }

    const resetAt = typeof body.resetAt === "number" ? body.resetAt : undefined;
    const castAt = typeof body.castAt === "number" ? body.castAt : Date.now();
    const snapshot = castBeatVote(voterId, body.choice, resetAt, castAt);
    publish(snapshot);
    return response.status(200).json(snapshot);
  }

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const listener = { response };
  subscriberSet().add(listener);
  response.write(`data: ${JSON.stringify(beatSnapshot())}\n\n`);

  const heartbeat = setInterval(() => {
    response.write(": keepalive\n\n");
  }, 15000);

  const cleanup = () => {
    clearInterval(heartbeat);
    subscriberSet().delete(listener);
  };

  response.on("close", cleanup);
  response.on("error", cleanup);
}
