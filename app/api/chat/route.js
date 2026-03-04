// Init order: (1) LD (with Observability), (2) Bedrock. init-ld runs first; triage loads bedrock.js.
import "../../../server/init-ld.js";
import { runWithSdkKey, getLdClient, LDObserve } from "../../../server/ld.js";
import { runTriage } from "../../../server/triage.js";
import { runSpecialist } from "../../../server/specialists.js";
import { runBrandAgent, runJudgesWithConfig } from "../../../server/brand.js";
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

  const sdkKey = body?.sdkKey?.trim();
  if (!sdkKey) {
    return Response.json(
      { error: "Connect to a project in the user menu first (sdkKey is required)." },
      { status: 400 }
    );
  }

  const guardrails = body.guardrails === true;
  const sessionId = body?.sessionId?.trim() || null;
  const requestId = crypto.randomUUID();
  const userContext = createUserContext(body);
  userContext.guardrails = guardrails;
  const query = userInput.trim();

  const logger = (entry) => pushLog({ ...entry, name: entry.name ?? "chat", ...(sessionId && { sessionId }) });

  pushLog({
    level: "INFO",
    message: guardrails ? "Guardrails turned on" : "Guardrails turned off",
    name: guardrails ? "guardrails-on" : "guardrails-off",
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
    const result = await runWithSdkKey(sdkKey, async () => {
      await getLdClient();
      const headers =
        request.headers && typeof request.headers.entries === "function"
          ? Object.fromEntries(request.headers.entries())
          : request.headers;
      return LDObserve.runWithHeaders("chat_request", headers, async () => {
        const triageResult = await runTriage(query, userContext, { logger, headers });
        triageResult.nextAgent = triageResult.nextAgent ?? "—";
        triageResult.confidence = triageResult.confidence ?? 0;
      logger({
        level: "INFO",
        message: `✅ Triage ==> ${triageResult.nextAgent} @ ${(triageResult.confidence * 100).toFixed(0)}% confidence`,
        name: "chat",
      });

      const specialistResult = await runSpecialist(
        triageResult.queryType,
        query,
        userContext,
        { logger, headers }
      );

      let brandSpanResult;
      {
        let brandResult = await runBrandAgent(
          specialistResult.content,
          query,
          triageResult.queryType,
          { ...userContext, guardrails: false },
          { logger, headers }
        );

        const toxicityScore = getToxicityScore(brandResult?.judgeResults ?? []);
        let firstRunJudgeResults = null;
        let firstRunConfig = null;
        if (toxicityScore != null && toxicityScore > TOXICITY_THRESHOLD) {
          if (userContext.guardrails) {
            firstRunJudgeResults = brandResult?.judgeResults ?? [];
            firstRunConfig = brandResult?.config ?? null;
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
              { logger, headers }
            );
            const secondJudgeResults = brandResult?.judgeResults ?? [];
            if (secondJudgeResults.length === 0 && firstRunConfig?.judgeConfiguration?.judges?.length > 0) {
              const contextVars = {
                user_key: userContext.user_key ?? "anonymous",
                query,
                customer_name: userContext.name ?? "there",
                original_query: query,
                query_type: triageResult.queryType,
                specialist_response: specialistResult.content,
                ...userContext,
              };
              const fallbackSecondJudges = await runJudgesWithConfig(
                firstRunConfig,
                contextVars,
                brandResult?.content ?? "",
                logger
              );
              brandResult = { ...brandResult, judgeResults: fallbackSecondJudges };
            }
            logger({
              level: "INFO",
              message: `   Returned brand response from second run (with guardrails)`,
              name: "chat",
            });
          } else {
            logger({
              level: "INFO",
              message: `   Toxicity judge score ${toxicityScore} > ${TOXICITY_THRESHOLD} but guardrails off — returning first run`,
              name: "toxicity-resend",
            });
          }
        }
        brandSpanResult = { brandResult, firstRunJudgeResults };
      }

      const { brandResult, firstRunJudgeResults } = brandSpanResult;

      return { triageResult, specialistResult, brandResult, firstRunJudgeResults };
      });
    });

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
    if (typeof LDObserve?.recordError === "function") {
      LDObserve.recordError(err instanceof Error ? err : new Error(String(err)));
    }
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
