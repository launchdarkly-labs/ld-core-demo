import path from "path";
import { AsyncLocalStorage } from "async_hooks";
import { config as loadEnv } from "dotenv";
import { init } from "@launchdarkly/node-server-sdk";
import { initAi } from "@launchdarkly/server-sdk-ai";
import { Observability, LDObserve } from "@launchdarkly/observability-node";
import * as defaults from "./ai-config-defaults.js";

/** Re-export for manual spans, metrics, and logs (e.g. runWithHeaders). */
export { LDObserve };

// Ensure .env.local is loaded when running locally (Next.js can miss it with Turbopack/cwd)
if (process.env.NODE_ENV !== "production") {
  loadEnv({ path: path.resolve(process.cwd(), ".env.local"), override: true });
}

export const TRIAGE_DEFAULT = defaults.triage_agent;
export const BRAND_COMPLETION_DEFAULT = defaults.brand_agent;

/** Map queryType from triage to LaunchDarkly AI Config key and fallback. */
export const SPECIALIST_AI_CONFIG = {
  policy_question: { configKey: "policy_agent", fallback: defaults.policy_agent },
  provider_lookup: { configKey: "provider_agent", fallback: defaults.provider_agent },
  scheduler_agent: { configKey: "scheduler_agent", fallback: defaults.scheduler_agent },
};

// --- Persistent LD client cache (keyed by SDK key) ---
const clients = new Map();
const TTL_MS = 30 * 60 * 1000; // 30 min

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 min

async function getClient(sdkKey) {
  const entry = clients.get(sdkKey);
  if (entry && Date.now() - entry.lastUsed < TTL_MS) {
    entry.lastUsed = Date.now();
    return entry.client;
  }
  if (entry) {
    entry.client.close().catch(() => {});
    clients.delete(sdkKey);
  }
  const client = init(sdkKey, {
    plugins: [
      new Observability({
        serviceName: process.env.LD_OBSERVABILITY_SERVICE_NAME || "policy-agent-node",
        ...(process.env.LD_OTLP_ENDPOINT && { otlpEndpoint: process.env.LD_OTLP_ENDPOINT }),
      }),
    ],
  });
  await client.waitForInitialization({ timeout: 10 });
  clients.set(sdkKey, { client, lastUsed: Date.now() });
  return client;
}

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of clients.entries()) {
    if (now - entry.lastUsed > TTL_MS) {
      entry.client.close().catch(() => {});
      clients.delete(key);
    }
  }
}

let cleanupInterval = null;
function startCleanupInterval() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(cleanup, CLEANUP_INTERVAL_MS);
  if (cleanupInterval.unref) cleanupInterval.unref();
}
startCleanupInterval();

/** Request-scoped SDK key (set by chat route from body.sdkKey). */
const ldSdkKeyStorage = new AsyncLocalStorage();

/**
 * Run async work with the given SDK key as the current session. Used by the chat API.
 * @param {string} sdkKey - Server-side SDK key for LaunchDarkly
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
export function runWithSdkKey(sdkKey, fn) {
  return ldSdkKeyStorage.run(sdkKey, fn);
}

/**
 * Get a LaunchDarkly server-side client for the current request (or env default).
 * Uses SDK key from AsyncLocalStorage (set by runWithSdkKey) or process.env.LD_SDK_KEY.
 */
export async function getLdClient() {
  const key = ldSdkKeyStorage.getStore() ?? process.env.LD_SDK_KEY;
  if (!key) throw new Error("LD_SDK_KEY is required (set session SDK key in UI or LD_SDK_KEY in env)");
  return getClient(key);
}

function substituteContext(template, contextVars) {
  let out = template;
  for (const [key, value] of Object.entries(contextVars)) {
    const re = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    out = out.replace(re, String(value));
    out = out.replace(new RegExp(`\\{\\{ldctx\\.${key}\\}\\}`, "g"), String(value));
  }
  return out;
}

export function buildMessagesFromLdConfig(ldConfig, contextVars) {
  const instructions = ldConfig._instructions || ldConfig.instructions;
  if (instructions) {
    const substituted = substituteContext(instructions, contextVars);
    const query = (contextVars.query ?? "").toString();
    const userContext = { ...contextVars };
    delete userContext.query;
    return [
      { role: "system", content: substituted },
      {
        role: "user",
        content: `User query: ${query}\n\nUser context:\n${JSON.stringify(userContext, null, 2)}`,
      },
    ];
  }
  throw new Error("No instructions in LaunchDarkly AI Config.");
}

/**
 * Fetch AI config from LaunchDarkly for any agent (triage, specialist, brand).
 * @param {string} configKey - LaunchDarkly AI Config key (e.g. "triage_agent", "policy_agent")
 * @param {object} context - Context for targeting (user_key, query, user_context, etc.)
 * @param {object} fallbackConfig - Fallback { model, instructions } when LD is unavailable
 * @returns {Promise<{ config: object, tracker: object }>}
 */
export async function getAIConfig(configKey, context, fallbackConfig) {
  const ldClient = await getLdClient();
  const aiClient = initAi(ldClient);
  const ldContext = {
    kind: "user",
    key: (context.user_key || "anonymous").toString(),
    ...context,
  };
  const agent = await aiClient.agentConfig(configKey, ldContext, fallbackConfig, {});
  const modelFromLd = agent.model?.name;
  const usedDefault = !modelFromLd || modelFromLd === fallbackConfig.model?.name;
  if (usedDefault) {
    console.warn(
      `[LaunchDarkly] AI Config "${configKey}" not found or returned no model; using default: ${fallbackConfig.model?.name}`
    );
  } else {
    console.info(`[LaunchDarkly] Using AI Config "${configKey}" → model: ${modelFromLd}`);
  }
  const config = {
    _instructions: agent.instructions ?? fallbackConfig.instructions,
    model: agent.model
      ? { name: agent.model.name ?? fallbackConfig.model?.name }
      : fallbackConfig.model,
  };
  const noopTracker = {
    trackSuccess: () => {},
    trackError: () => {},
    trackTokens: () => {},
    trackTimeToFirstToken: () => {},
    trackDuration: () => {},
  };
  return { config, tracker: agent.tracker ?? noopTracker };
}

/**
 * Fetch completion AI config from LaunchDarkly (messages-based). Returns config with judgeConfiguration when judges are attached.
 */
export async function getCompletionConfig(configKey, context, fallbackConfig, variables = {}) {
  const ldClient = await getLdClient();
  const aiClient = initAi(ldClient);
  const ldContext = {
    kind: "user",
    key: (context.user_key || "anonymous").toString(),
    ...context,
  };
  const completion = await aiClient.completionConfig(configKey, ldContext, fallbackConfig, variables);
  const judges = completion.judgeConfiguration?.judges ?? [];
  const normalizedJudges = judges.map((j) => ({
    ...j,
    key: j.key ?? j.judgeConfigKey,
    samplingRate: j.samplingRate ?? 1,
  }));
  const config = {
    messages: completion.messages ?? fallbackConfig.messages,
    model: completion.model
      ? { name: completion.model.name ?? fallbackConfig.model?.name }
      : fallbackConfig.model,
    judgeConfiguration:
      normalizedJudges.length > 0
        ? { ...completion.judgeConfiguration, judges: normalizedJudges }
        : completion.judgeConfiguration,
    custom: completion.model?.custom,
  };
  const noopTracker = {
    trackSuccess: () => {},
    trackError: () => {},
    trackTokens: () => {},
    trackTimeToFirstToken: () => {},
    trackDuration: () => {},
  };
  return { config, tracker: completion.tracker ?? noopTracker };
}

const JUDGE_CONFIG_DEFAULT = { enabled: false, model: { name: null }, messages: [], evaluationMetricKey: null };

/**
 * Fetch judge AI config from LaunchDarkly (for running judges ourselves with Bedrock).
 */
export async function getJudgeConfig(judgeKey, context, variables = {}) {
  const ldClient = await getLdClient();
  const aiClient = initAi(ldClient);
  const ldContext = {
    kind: "user",
    key: (context.user_key || "anonymous").toString(),
    ...context,
  };
  const judgeConfig = await aiClient.judgeConfig(judgeKey, ldContext, JUDGE_CONFIG_DEFAULT, variables);
  return {
    messages: judgeConfig.messages ?? [],
    evaluationMetricKey: judgeConfig.evaluationMetricKey ?? null,
    model: judgeConfig.model?.name ?? null,
  };
}
