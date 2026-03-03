// LLM observability init order: (1) LD, (2) OpenLLMetry, (3) Bedrock. init-ld runs first; triage loads bedrock.js.
// Import withWorkflow after triage/specialists/brand so bedrock.js (and traceloop.initialize()) load first.
import "../../../server/init-ld.js";
import { runWithSdkKey } from "../../../server/ld.js";
import { runTriage } from "../../../server/triage.js";
import { runSpecialist } from "../../../server/specialists.js";
import { runBrandAgent } from "../../../server/brand.js";
import { withWorkflow } from "@traceloop/node-server-sdk";
import { pushLog } from "../../../lib/log-stream";

/** Toxicity score above this triggers resend with guardrails. Override with env TOXICITY_THRESHOLD (0–1). */
const TOXICITY_THRESHOLD = (() => {
  const v = process.env.TOXICITY_THRESHOLD;
  if (v === undefined || v === "") return 0.6;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 && n <= 1 ? n : 0.6;
})();

function createUserContext(body = {}) {
  return {
    user_key: "anonymous",
    name: body.userName ?? "Ellen McLain",
    location: body.location ?? "Cadillac, MI",
    policy_id: body.policyId ?? "TH-HMO-GOLD-2024",
    coverage_type: body.coverageType ?? "Gold HMO",
  };
}

/** Get toxicity score from judge results if present. Returns number 0–1 or null. */
function getToxicityScore(judgeResults) {
  if (!Array.isArray(judgeResults)) return null;
  const toxicityJudge = judgeResults.find(
    (jr) =>
      (jr.judgeConfigKey && String(jr.judgeConfigKey).toLowerCase().includes("toxicity")) ||
      (jr.judge_config_key && String(jr.judge_config_key).toLowerCase().includes("toxicity"))
  );
  if (!toxicityJudge || !toxicityJudge.evals || typeof toxicityJudge.evals !== "object") return null;
  const evals = toxicityJudge.evals;
  const entry = Object.values(evals).find((e) => e && typeof e.score === "number");
  return entry ? entry.score : null;
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

  const sdkKey = body?.sdkKey?.trim() || process.env.LD_SDK_KEY;
  if (!sdkKey) {
    return Response.json(
      { error: "sdkKey is required (set connection in user menu or LD_SDK_KEY in env)" },
      { status: 400 }
    );
  }

  const guardrails = body.guardrails !== false;
  const sessionId = body?.sessionId?.trim() || null;
  const requestId = crypto.randomUUID();
  const userContext = createUserContext(body);
  userContext.guardrails = guardrails;
  const query = userInput.trim();

  const logger = (entry) => pushLog({ ...entry, name: entry.name ?? "chat", ...(sessionId && { sessionId }) });

  pushLog({
    level: "INFO",
    message: guardrails ? "Guardrails turned on" : "Guardrails turned off",
    name: "chat",
    ...(sessionId && { sessionId }),
  });
  pushLog({
    level: "INFO",
    message: `💬 Chat request (…${sdkKey.slice(-4)}) · "${query.slice(0, 60)}${query.length > 60 ? "…" : ""}"`,
    name: "chat",
    ...(sessionId && { sessionId }),
  });
  pushLog({
    level: "INFO",
    message: `   Context: policy=${userContext.policy_id ?? "—"} · ${userContext.location ?? "—"}`,
    name: "chat",
    ...(sessionId && { sessionId }),
  });

  try {
    const result = await runWithSdkKey(sdkKey, () =>
      withWorkflow(
        { name: "chat_request" },
        async () => {
          // 1. Triage: route to one of policy_question, provider_lookup, scheduler_agent
          const triageResult = await runTriage(query, userContext, { logger });
          logger({
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

        // 3. Brand completion — call initially without guardrails; after judges, if toxicity > 0.6, resend with guardrails
        let brandResult = await runBrandAgent(
          specialistResult.content,
          query,
          triageResult.queryType,
          { ...userContext, guardrails: false },
          { logger }
        );

        const toxicityScore = getToxicityScore(brandResult?.judgeResults ?? []);
        let firstRunJudgeResults = null;
        if (toxicityScore != null && toxicityScore > TOXICITY_THRESHOLD) {
          firstRunJudgeResults = brandResult?.judgeResults ?? [];
          logger({
            level: "WARN",
            message: `   Toxicity judge score ${toxicityScore} > ${TOXICITY_THRESHOLD} — not returning initial chat; resending to brand_agent with guardrails: true`,
            name: "toxicity-resend",
          });
          brandResult = await runBrandAgent(
            specialistResult.content,
            query,
            triageResult.queryType,
            { ...userContext, guardrails: true },
            { logger }
          );
          logger({
            level: "INFO",
            message: `   Returned brand response from second run (with guardrails)`,
            name: "chat",
          });
        }

        return { triageResult, specialistResult, brandResult, firstRunJudgeResults };
        }
      )
    );

    const { triageResult, specialistResult, brandResult, firstRunJudgeResults } = result;
    const judgeResultsForResponse =
      firstRunJudgeResults && firstRunJudgeResults.length > 0
        ? [
            ...firstRunJudgeResults.map((j) => ({ ...j, runLabel: "First run (toxicity triggered resend)" })),
            ...(brandResult?.judgeResults ?? []).map((j) => ({ ...j, runLabel: "Second run (with guardrails)" })),
          ]
        : brandResult?.judgeResults ?? [];
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
      response: brandResult?.content ?? "",
      requestId,
      agentFlow,
      judgeResults: judgeResultsForResponse,
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
      ...(sessionId && { sessionId }),
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
