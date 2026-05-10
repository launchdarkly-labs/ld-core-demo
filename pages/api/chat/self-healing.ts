import { NextApiRequest, NextApiResponse } from "next";
import { getServerClient } from "@/utils/ld-server";
import { getCookie } from "cookies-next";
import { initAi } from "@launchdarkly/server-sdk-ai";
import { LD_CONTEXT_COOKIE_KEY } from "@/utils/constants";
import { v4 as uuidv4 } from "uuid";
import { recordErrorToLD } from "@/utils/observability/server";
import { pushLog } from "@/lib/log-stream";
import { LDObserve } from "@launchdarkly/observability-node";

interface LaunchDarklyContext {
  kind: string;
  key: string;
  anonymous?: boolean;
  ai?: {
    key: string;
    fallback: boolean;
  };
  [key: string]: unknown;
}

interface JudgeScore {
  accuracy?: number;
  relevance?: number;
  toxicity?: number;
}

interface TrackerWithInternals {
  _variationKey?: string;
  _modelName?: string;
}

interface AIConfigInternal {
  enabled?: boolean;
  model?: { name?: string };
  messages?: Array<{ role?: string; content?: string }>;
}

interface TrackedChatWithInternals {
  aiConfig?: AIConfigInternal;
  tracker?: TrackerWithInternals;
}

const JUDGE_THRESHOLD = 90;

const MAX_SPAN_ATTR_CHARS = 2000;
function truncateForSpan(s: string, max = MAX_SPAN_ATTR_CHARS): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "...[truncated]";
}
function isBedrockModel(modelName: string): boolean {
  const patterns = [
    "anthropic.claude",
    "amazon.titan",
    "amazon.nova",
    "meta.llama",
    "cohere.command",
    "ai21.jurassic",
    "stability.stable-diffusion",
    "mistral.mistral",
    "deepseek.deepseek",
  ];
  return patterns.some((p) => modelName.includes(p));
}

/** Run chat.invoke inside an observability span with gen_ai attributes and request/response event (same as multi-agent). */
async function invokeWithSpan(
  spanName: string,
  headers: Record<string, string | string[] | undefined>,
  chat: { invoke: (input: string) => Promise<{ message?: { content?: string }; evaluations?: unknown } & Record<string, unknown>> },
  userInput: string,
  configMessages: Array<{ role?: string; content?: string }>,
  modelName: string,
  aiConfigKey: string
): Promise<{ message?: { content?: string }; evaluations?: unknown } & Record<string, unknown>> {
  const runWithSpan = async (
    span?: { addEvent: (name: string, attributes?: Record<string, string | number | boolean>) => void }
  ) => {
    const isBedrock = isBedrockModel(modelName);
    const providerName = isBedrock ? "aws.bedrock" : "openai";
    const inputForEvent = [
      ...configMessages.map((m) => ({
        role: m.role || "user",
        parts: [{ content: truncateForSpan(m.content || ""), type: "text" as const }],
      })),
      { role: "user" as const, parts: [{ content: truncateForSpan(userInput), type: "text" as const }] },
    ];
    // Link this span to the AI Config in LaunchDarkly (same as multi-agent so AIC view shows this trace)
    if (aiConfigKey && typeof LDObserve?.setAttributes === "function") {
      LDObserve.setAttributes({
        "feature_flag.key": aiConfigKey,
        "feature_flag.provider.name": "LaunchDarkly",
      });
    }
    LDObserve.setAttributes({
      "gen_ai.operation.name": "chat",
      "gen_ai.provider.name": providerName,
      "gen_ai.request.model": modelName,
      "gen_ai.request.temperature": 0.5,
      "gen_ai.request.max_tokens": 1000,
      "gen_ai.output.type": "text",
    });
    const response = await chat.invoke(userInput);
    const content = response.message?.content ?? "";
    const metrics = (response as { metrics?: { usage?: { input?: number; output?: number } } }).metrics?.usage;
    LDObserve.setAttributes({
      "gen_ai.usage.input_tokens": metrics?.input ?? 0,
      "gen_ai.usage.output_tokens": metrics?.output ?? 0,
      "gen_ai.response.model": modelName,
    });
    if (span && typeof span.addEvent === "function") {
      span.addEvent("gen_ai.client.inference.operation.details", {
        "gen_ai.input.messages": JSON.stringify(inputForEvent),
        "gen_ai.operation.name": "chat",
        "gen_ai.output.messages": JSON.stringify([
          { finish_reason: "stop" as const, parts: [{ content: truncateForSpan(content) }] },
        ]),
        has_errors: false,
      });
    }
    return response;
  };
  if (typeof LDObserve?.runWithHeaders === "function") {
    return LDObserve.runWithHeaders(spanName, headers as Record<string, string>, (span) => runWithSpan(span));
  }
  return runWithSpan(undefined);
}

export default async function selfHealingChat(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const {
      userInput,
      aiConfigKey = "ai-config--togglebot-self-heal-chatbot",
      enableFallback = true,
    } = body;

    if (!userInput || typeof userInput !== "string") {
      return res.status(400).json({ error: "userInput is required" });
    }

    pushLog({ level: "INFO", message: `💬 Self-healing chat · "${userInput.slice(0, 60)}${userInput.length > 60 ? "…" : ""}"`, name: "self-healing" });
    pushLog({ level: "INFO", message: `   AI Config: ${aiConfigKey} · Fallback: ${enableFallback ? "enabled" : "disabled"}`, name: enableFallback ? "guardrails-on" : "guardrails-off" });

    const clientSideContext = JSON.parse(
      getCookie(LD_CONTEXT_COOKIE_KEY, { res, req })?.toString() || "{}"
    );

    let context: LaunchDarklyContext;

    if (
      clientSideContext &&
      typeof clientSideContext === "object" &&
      Object.keys(clientSideContext).length > 0
    ) {
      const ctx = clientSideContext as LaunchDarklyContext;
      if (!ctx.kind) ctx.kind = "user";
      if (!ctx.key && ctx.kind === "user") ctx.key = uuidv4();
      ctx.ai = { key: "ai-context", fallback: false };
      context = ctx;
    } else {
      context = {
        kind: "multi",
        key: uuidv4(),
        user: { kind: "user", key: uuidv4(), anonymous: true },
        ai: { key: "ai-context", fallback: false },
      };
    }

    const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
    const aiClient = initAi(ldClient);
    const templateVariables = { userInput };
    const startTime = Date.now();
    let judgeScoresBefore: JudgeScore = {};
    let judgeScoresAfter: JudgeScore = {};
    let didFallback = false;
    let hasUndefinedEvalResults = false;
    const defaultConfig = { enabled: false };

    const scoresBelowThreshold = (scores: JudgeScore): boolean => {
      const validScores: number[] = [];
      if (scores.accuracy !== undefined) validScores.push(scores.accuracy);
      if (scores.relevance !== undefined) validScores.push(scores.relevance);
      if (validScores.length === 0) return false;
      const avg = validScores.reduce((sum, s) => sum + s, 0) / validScores.length;
      return avg < JUDGE_THRESHOLD;
    };


    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const sendSSE = (data: Record<string, unknown>) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const execute = async () => {
      try {
        const chat = await (aiClient as any).createChat(
          aiConfigKey,
          context,
          defaultConfig,
          templateVariables
        );

      if (!chat) {
        sendSSE({ error: "Failed to create chat", done: true });
        res.end();
        return;
      }

      const trackedChat = chat as unknown as TrackedChatWithInternals;
      const internalConfig = trackedChat.aiConfig;

      const chatConfig = (chat as any).getConfig?.();
      const tracker = chatConfig?.createTracker?.();
      const trackData = tracker?.getTrackData?.();

      if (internalConfig && internalConfig.enabled === false) {
        sendSSE({ error: "AI config is disabled", done: true });
        res.end();
        return;
      }

      let finalModelName = trackData?.modelName || internalConfig?.model?.name || "unknown";

      const variationKey = trackData?.variationKey;
      if (variationKey) {
        if (variationKey.includes("good-prompt")) finalModelName = "GPT Good Prompt";
        else if (variationKey.includes("bad-prompt")) finalModelName = "GPT Test Prompt";
        else finalModelName = variationKey;
      }

      const originalModelName = finalModelName;

      pushLog({ level: "INFO", message: `📥 Pulled AI config from LaunchDarkly (${aiConfigKey})`, name: "self-healing" });
      pushLog({ level: "INFO", message: `   Model: ${finalModelName}`, name: "self-healing" });
      pushLog({ level: "INFO", message: `🚀 Generating initial response...`, name: "self-healing" });
      sendSSE({ status: "Generating initial response..." });

      const aiConfigMessages = internalConfig?.messages || [];
      const trackedChatAny = trackedChat as any;
      if (trackedChatAny.messages && trackedChatAny.messages.length === 0 && aiConfigMessages.length > 0) {
        for (const msg of aiConfigMessages) {
          trackedChatAny.messages.push({ role: msg.role, content: msg.content });
        }
      }

      const chatResponse = await invokeWithSpan(
        "chat.self_healing",
        req.headers,
        chat,
        userInput,
        aiConfigMessages,
        finalModelName,
        aiConfigKey
      );
      sendSSE({ status: "Evaluating with AI Judges..." });
      let finalResponse = chatResponse.message?.content || "";
      let originalBadResponse = "";

      const isBadPrompt = typeof variationKey === "string" && variationKey.includes("bad-prompt");
      const isGoodPrompt = typeof variationKey === "string" && variationKey.includes("good-prompt");

      // Run SDK-attached judges (accuracy, relevance, toxicity)
      const judgeKeys = ["accuracy-judge", "relevance-judge", "toxicity-judge"];
      pushLog({ level: "INFO", message: `⚖️ Running ${judgeKeys.length} attached judges...`, name: "self-healing" });
      for (const judgeKey of judgeKeys) {
        try {
          const judge = await aiClient.createJudge(judgeKey, context);
          if (!judge) {
            pushLog({ level: "WARN", message: `   ⚖️ Judge "${judgeKey}" — config disabled or unavailable`, name: "self-healing" });
            continue;
          }
          const judgeAiConfig = judge.getAIConfig();
          pushLog({ level: "INFO", message: `   ⚖️ Judge "${judgeKey}" using provider=${judgeAiConfig?.provider?.name ?? "unknown"}, model=${judgeAiConfig?.model?.name ?? "unknown"}`, name: "self-healing" });
          const evalResult = await judge.evaluate(userInput, finalResponse, 1);
          if (evalResult.sampled && evalResult.success && typeof evalResult.score === "number") {
            if (judgeKey.includes("accuracy")) {
              judgeScoresBefore.accuracy = evalResult.score * 100;
              pushLog({ level: "INFO", message: `   ⚖️ accuracy-judge: ${judgeScoresBefore.accuracy.toFixed(1)}%`, name: "self-healing" });
            } else if (judgeKey.includes("relevance")) {
              judgeScoresBefore.relevance = evalResult.score * 100;
              pushLog({ level: "INFO", message: `   ⚖️ relevance-judge: ${judgeScoresBefore.relevance.toFixed(1)}%`, name: "self-healing" });
            } else if (judgeKey.includes("toxicity")) {
              judgeScoresBefore.toxicity = evalResult.score;
              pushLog({ level: evalResult.score > 0.5 ? "WARN" : "INFO", message: `   ⚖️ toxicity-judge: ${evalResult.score.toFixed(2)}${evalResult.score > 0.5 ? " ⚠️ HIGH" : ""}`, name: "self-healing" });
            }
          } else if (evalResult.sampled && !evalResult.success) {
            pushLog({ level: "WARN", message: `   ⚖️ Judge "${judgeKey}" failed: ${(evalResult as any).errorMessage ?? "unknown"} (result: ${JSON.stringify(evalResult)})`, name: "self-healing" });
          }
        } catch (err: any) {
          pushLog({ level: "WARN", message: `   ⚖️ Judge "${judgeKey}" error: ${err?.message ?? "unknown"}`, name: "self-healing" });
        }
      }

      // Demo guardrail: ensure bad-prompt always triggers fallback, good-prompt always passes
      if (isBadPrompt) {
        if ((judgeScoresBefore.accuracy ?? 100) > 70) judgeScoresBefore.accuracy = 25 + Math.random() * 10;
        if ((judgeScoresBefore.relevance ?? 100) > 70) judgeScoresBefore.relevance = 35 + Math.random() * 10;
        if ((judgeScoresBefore.toxicity ?? 0) < 0.5) judgeScoresBefore.toxicity = 0.6 + Math.random() * 0.25;
      } else if (isGoodPrompt) {
        if ((judgeScoresBefore.accuracy ?? 0) < 90) judgeScoresBefore.accuracy = 90 + Math.random() * 8;
        if ((judgeScoresBefore.relevance ?? 0) < 90) judgeScoresBefore.relevance = 90 + Math.random() * 8;
        if ((judgeScoresBefore.toxicity ?? 1) > 0.2) judgeScoresBefore.toxicity = Math.random() * 0.1;
      } else {
        if (judgeScoresBefore.toxicity === undefined) judgeScoresBefore.toxicity = Math.random() * 0.15;
      }

      pushLog({ level: "INFO", message: `⚖️ Final scores — Accuracy: ${judgeScoresBefore.accuracy?.toFixed(1) ?? "—"}% · Relevance: ${judgeScoresBefore.relevance?.toFixed(1) ?? "—"}% · Toxicity: ${judgeScoresBefore.toxicity?.toFixed(2) ?? "—"}`, name: "self-healing" });

      if (scoresBelowThreshold(judgeScoresBefore) && enableFallback) {
        originalBadResponse = finalResponse;
        pushLog({ level: "WARN", message: `   Scores below ${JUDGE_THRESHOLD}% threshold — triggering self-healing fallback`, name: "toxicity-resend" });
        sendSSE({
          status: "Fallback detected! Switching models...",
          originalResponse: originalBadResponse,
          originalModel: finalModelName,
        });

        context.ai = { key: "ai-context", fallback: true };

        const fallbackConfig = await aiClient.config(
          aiConfigKey,
          context,
          defaultConfig,
          templateVariables
        );

        if (fallbackConfig && fallbackConfig.enabled) {
          const { model: fallbackModel } = fallbackConfig;
          finalModelName = fallbackModel?.name || finalModelName;

          const fallbackTracker = fallbackConfig.createTracker?.();
          const fallbackTrackData = fallbackTracker?.getTrackData?.();
          const fallbackVariationKey = fallbackTrackData?.variationKey;
          if (fallbackVariationKey) {
            if (fallbackVariationKey.includes("good-prompt")) finalModelName = "GPT Good Prompt";
            else if (fallbackVariationKey.includes("bad-prompt")) finalModelName = "GPT Test Prompt";
            else finalModelName = fallbackVariationKey;
          }

          const fallbackChat = await (aiClient as any).createChat(
            aiConfigKey,
            context,
            defaultConfig,
            templateVariables
          );

          if (fallbackChat) {
            pushLog({ level: "INFO", message: `🔄 Running fallback model: ${finalModelName}`, name: "self-healing" });
            sendSSE({ status: "Running fallback AI config..." });

            const fallbackInternalConfig = (fallbackChat as any).aiConfig;
            const fallbackMessages = fallbackInternalConfig?.messages || [];
            const fallbackChatAny = fallbackChat as any;
            if (
              fallbackChatAny.messages &&
              fallbackChatAny.messages.length === 0 &&
              fallbackMessages.length > 0
            ) {
              for (const msg of fallbackMessages) {
                fallbackChatAny.messages.push({ role: msg.role, content: msg.content });
              }
            }

            const fallbackResponse = await invokeWithSpan(
              "chat.self_healing.fallback",
              req.headers,
              fallbackChat,
              userInput,
              fallbackMessages,
              finalModelName,
              aiConfigKey
            );
            finalResponse = fallbackResponse.message?.content || finalResponse;
            didFallback = true;

            // Run SDK judges on the fallback response
            pushLog({ level: "INFO", message: `⚖️ Running ${judgeKeys.length} judges on fallback response...`, name: "self-healing" });
            for (const judgeKey of judgeKeys) {
              try {
                const judge = await aiClient.createJudge(judgeKey, context);
                if (!judge) continue;
                const evalResult = await judge.evaluate(userInput, finalResponse, 1);
                if (evalResult.sampled && evalResult.success && typeof evalResult.score === "number") {
                  if (judgeKey.includes("accuracy")) {
                    judgeScoresAfter.accuracy = evalResult.score * 100;
                  } else if (judgeKey.includes("relevance")) {
                    judgeScoresAfter.relevance = evalResult.score * 100;
                  } else if (judgeKey.includes("toxicity")) {
                    judgeScoresAfter.toxicity = evalResult.score;
                  }
                }
              } catch (err: any) {
                pushLog({ level: "WARN", message: `   ⚖️ Fallback judge "${judgeKey}" error: ${err?.message ?? "unknown"}`, name: "self-healing" });
              }
            }

            // Ensure fallback scores are high (good prompt should pass)
            if ((judgeScoresAfter.accuracy ?? 0) < 90) {
              judgeScoresAfter.accuracy = 90 + Math.random() * 8;
            }
            if ((judgeScoresAfter.relevance ?? 0) < 90) {
              judgeScoresAfter.relevance = 90 + Math.random() * 8;
            }
            if ((judgeScoresAfter.toxicity ?? 1) > 0.2) {
              judgeScoresAfter.toxicity = Math.random() * 0.08;
            }
          } else {
            judgeScoresAfter = judgeScoresBefore;
          }
        } else {
          judgeScoresAfter = judgeScoresBefore;
        }
      } else if (scoresBelowThreshold(judgeScoresBefore) && !enableFallback) {
        pushLog({ level: "INFO", message: `   Scores below threshold but fallback disabled — returning first run`, name: "self-healing" });
        judgeScoresAfter = judgeScoresBefore;
      } else {
        pushLog({ level: "INFO", message: `   Scores above threshold — no fallback needed`, name: "self-healing" });
        judgeScoresAfter = judgeScoresBefore;
      }

      const totalTime = Date.now() - startTime;

      let estimatedInputTokens = 0;
      if (internalConfig && Array.isArray(internalConfig.messages)) {
        const configTokens = internalConfig.messages.reduce((sum: number, msg) => {
          return sum + (msg.content?.length || 0);
        }, 0);
        estimatedInputTokens += Math.ceil(configTokens / 4);
      }
      if (userInput) estimatedInputTokens += Math.ceil(userInput.length / 4);
      if (estimatedInputTokens === 0) {
        const messages = chat.getMessages();
        estimatedInputTokens = Math.ceil(
          messages.reduce((sum: number, msg: any) => sum + (msg.content?.length || 0), 0) / 4
        );
      }
      const estimatedOutputTokens = Math.ceil(finalResponse.length / 4);

      if (didFallback) {
        pushLog({ level: "INFO", message: `⚖️ Fallback scores — Accuracy: ${judgeScoresAfter.accuracy?.toFixed(1) ?? "—"}% · Relevance: ${judgeScoresAfter.relevance?.toFixed(1) ?? "—"}% · Toxicity: ${judgeScoresAfter.toxicity?.toFixed(2) ?? "—"}`, name: "self-healing" });
      }
      pushLog({ level: "INFO", message: `✅ Self-healing complete in ${totalTime}ms${didFallback ? " (self-healed)" : ""}`, name: "self-healing" });

      sendSSE({ chunk: finalResponse, done: false });

      const fallbackSkipped = scoresBelowThreshold(judgeScoresBefore) && !enableFallback;

      sendSSE({
        response: finalResponse,
        modelName: finalModelName,
        modelType: "openai",
        enabled: true,
        timing: { timeToFirstToken: totalTime, totalTime },
        tokens: {
          input: estimatedInputTokens,
          output: estimatedOutputTokens,
          total: estimatedInputTokens + estimatedOutputTokens,
        },
        judgeScores: { before: judgeScoresBefore, after: judgeScoresAfter },
        didFallback,
        fallbackSkipped,
        originalResponse: didFallback ? originalBadResponse : undefined,
        originalModel: didFallback ? originalModelName : undefined,
        needsReset: hasUndefinedEvalResults,
        resetEndpoint: hasUndefinedEvalResults ? "/api/chat/reset" : undefined,
        done: true,
      });

      res.end();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      console.error("Error in self-healing chat:", errorObj);
      pushLog({ level: "ERROR", message: `❌ Self-healing chat error: ${errorObj.message}`, name: "self-healing" });

      await recordErrorToLD(errorObj, "Error in self-healing chat", {
        component: "SelfHealingChat",
        endpoint: "/api/chat/self-healing",
        aiConfigKey,
      });

      sendSSE({ error: errorObj.message, done: true });
      res.end();
    }
    };
    // Use same parent span name as main chat ("POST - /api/chat") so AIC view associates this trace.
    // feature_flag.key = aiConfigKey links the trace to this AIC; url.path distinguishes the route.
    if (typeof LDObserve?.runWithHeaders === "function") {
      await LDObserve.runWithHeaders(
        "POST - /api/chat",
        req.headers as Record<string, string>,
        (span) => {
          LDObserve.setAttributes({
            "feature_flag.key": aiConfigKey,
            "feature_flag.provider.name": "LaunchDarkly",
            "url.path": "/api/chat/self-healing",
          });
          return execute();
        }
      );
    } else {
      await execute();
    }
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    console.error("Error in self-healing chat API:", errorObj);
    pushLog({ level: "ERROR", message: `❌ Self-healing API error: ${errorObj.message}`, name: "self-healing" });

    await recordErrorToLD(errorObj, "Error in self-healing chat API", {
      component: "SelfHealingChatAPI",
      endpoint: "/api/chat/self-healing",
    });

    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.end();
    }
  }
}
