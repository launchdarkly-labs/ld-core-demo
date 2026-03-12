import type { NextApiRequest, NextApiResponse } from "next";
import { subscribe, pushLog } from "@/lib/log-stream";

export const config = { api: { bodyParser: true } };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return handlePost(req, res);
  }
  if (req.method === "GET") {
    return handleSSE(req, res);
  }
  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}

function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { guardrails, sessionId } = req.body ?? {};
  const msg = guardrails === true ? "Guardrails turned on" : "Guardrails turned off";
  pushLog({
    level: "INFO",
    message: `*** ${msg} ***`,
    name: guardrails ? "guardrails-on" : "guardrails-off",
    ...(sessionId && { sessionId }),
  });
  return res.status(200).json({ ok: true });
}

function handleSSE(_req: NextApiRequest, res: NextApiResponse) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });

  const send = (data: Record<string, unknown>) => {
    try {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch {}
  };

  send({
    timestamp: new Date().toISOString(),
    level: "INFO",
    message: "Connected to log stream",
    name: "sse",
  });

  const unsubscribe = subscribe(send);

  const heartbeat = setInterval(() => {
    send({ timestamp: new Date().toISOString(), level: "HEARTBEAT", message: "", name: "sse" });
  }, 30_000);

  const cleanup = () => {
    clearInterval(heartbeat);
    unsubscribe();
  };

  res.on("close", cleanup);
  res.on("error", cleanup);
}
