// LLM observability init order: (1) LD, (2) OpenLLMetry, (3) Bedrock. init-ld runs first; triage loads bedrock.js.
// Import withWorkflow after triage/specialists/brand so bedrock.js (and traceloop.initialize()) load first.
import "../../../server/init-ld.js";
import { runTriage } from "../../../server/triage.js";
import { runSpecialist } from "../../../server/specialists.js";
import { runBrandAgent } from "../../../server/brand.js";
import { withWorkflow } from "@traceloop/node-server-sdk";
import { pushLog } from "../../../lib/log-stream";

function createUserContext(body = {}) {
  return {
    user_key: "anonymous",
    name: body.userName ?? "Ellen McLain",
    location: body.location ?? "Cadillac, MI",
    policy_id: body.policyId ?? "TH-HMO-GOLD-2024",
    coverage_type: body.coverageType ?? "Gold HMO",
  };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userInput = body?.userInput;
  if (!userInput || typeof userInput !== "string") {
    return Response.json({ error: "userInput is required" }, { status: 400 });
  }

  const requestId = crypto.randomUUID();
  const userContext = createUserContext(body);
  const query = userInput.trim();

  pushLog({
    level: "INFO",
    message: `💬 Chat request (${requestId.slice(0, 8)}…) · "${query.slice(0, 60)}${query.length > 60 ? "…" : ""}"`,
    name: "chat",
  });
  pushLog({
    level: "INFO",
    message: `   Context: policy=${userContext.policy_id ?? "—"} · ${userContext.location ?? "—"}`,
    name: "chat",
  });

  const logger = (entry) => pushLog({ ...entry, name: entry.name ?? "chat" });

  try {
    const result = await withWorkflow(
      { name: "chat_request" },
      async () => {
        // 1. Triage: route to one of policy_question, provider_lookup, scheduler_agent
        const triageResult = await runTriage(query, userContext, { logger });
        pushLog({
          level: "INFO",
          message: `✅ Triage ==> ${triageResult.nextAgent} @ ${(triageResult.confidence * 100).toFixed(0)}% confidence`,
          name: "chat",
        });

        // 2. Specialist: run the chosen agent
        const specialistResult = await runSpecialist(
          triageResult.queryType,
          query,
          userContext,
          { logger }
        );

        // 3. Brand agent: turn specialist response into final customer reply
        const brandResult = await runBrandAgent(
          specialistResult.content,
          query,
          triageResult.queryType,
          userContext,
          { logger }
        );

        return { triageResult, specialistResult, brandResult };
      }
    );

    const { triageResult, specialistResult, brandResult } = result;
    const agentFlow = [
      {
        agent: "triage_router",
        name: "Triage Router",
        status: "complete",
        confidence: triageResult.confidence,
        icon: "🔍",
        duration: triageResult.agentData.triage_router.duration_ms,
        ttft_ms: triageResult.agentData.triage_router.ttft_ms,
        tokens: triageResult.agentData.triage_router.tokens,
      },
      {
        agent: triageResult.queryType,
        name: triageResult.nextAgent,
        status: "complete",
        icon: "📋",
        duration: specialistResult.durationMs,
        ttft_ms: specialistResult.ttftMs,
        tokens: specialistResult.usage,
      },
      {
        agent: "brand_agent",
        name: "Brand Voice",
        status: "complete",
        icon: "✨",
        duration: brandResult.durationMs,
        ttft_ms: brandResult.ttftMs,
        tokens: brandResult.usage,
      },
    ];

    return Response.json({
      response: brandResult.content,
      requestId,
      agentFlow,
      metrics: {
        query_type: triageResult.queryType,
        confidence: triageResult.confidence,
        agent_count: 3,
        rag_enabled: false,
      },
    });
  } catch (err) {
    console.error("Triage error:", err);
    const message = err?.message ?? "Internal server error";
    pushLog({
      level: "ERROR",
      message: `❌ Triage error: ${message}`,
      name: "chat",
    });
    const isAws = /credentials|sso|token|KeyError|Refreshing/i.test(message);
    return Response.json(
      {
        response: isAws
          ? "AWS authentication required. Configure credentials (e.g. aws sso login or env vars)."
          : "An error occurred. Please try again.",
        requestId,
        agentFlow: [],
        error: message,
      },
      { status: 500 }
    );
  }
}
