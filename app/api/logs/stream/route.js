import { subscribe, pushLog } from "../../../../lib/log-stream";

/**
 * SSE log stream – broadcasts logs from chat/triage/bedrock to the Terminal UI.
 * POST with { guardrails: true|false } to push "Guardrails turned on/off" (e.g. from toggle click).
 */
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const guardrailsOn = body.guardrails === true;
  const msg = guardrailsOn ? "Guardrails turned on" : "Guardrails turned off";
  pushLog({
    level: "INFO",
    message: `*** ${msg} ***`,
    name: guardrailsOn ? "guardrails-on" : "guardrails-off",
  });
  return Response.json({ ok: true }, { status: 200 });
}

export async function GET() {
  const encoder = new TextEncoder();

  let intervalId;
  let unsubscribe;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (_) {}
      };

      send({
        timestamp: new Date().toISOString(),
        level: "INFO",
        message: "🔌 Connected to log stream",
        name: "sse",
      });

      unsubscribe = subscribe(send);

      intervalId = setInterval(() => {
        send({
          timestamp: new Date().toISOString(),
          level: "HEARTBEAT",
          message: "",
          name: "sse",
        });
      }, 30000);
    },
    cancel() {
      if (intervalId) clearInterval(intervalId);
      if (unsubscribe) unsubscribe();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
