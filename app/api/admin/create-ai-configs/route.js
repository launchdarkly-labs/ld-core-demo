import { readFile } from "fs/promises";
import { join } from "path";

const LD_API_BASE = "https://app.launchdarkly.com/api/v2";
const LD_API_VERSION = "beta";

/**
 * Build headers for LaunchDarkly REST API (uses API token, not SDK key).
 */
function ldHeaders(apiKey) {
  return {
    "Content-Type": "application/json",
    Authorization: apiKey,
    "LD-API-Version": LD_API_VERSION,
  };
}

/**
 * Normalize variation model from backup format for LD API.
 */
function normalizeModel(variation) {
  const m = variation.model;
  if (!m) return { parameters: {} };
  const modelName = m.modelName || m.name;
  const parameters = m.parameters || {};
  if (modelName) return { modelName, parameters };
  return { parameters };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const projectKey = body?.projectKey?.trim();
  if (!projectKey) {
    return Response.json(
      { error: "projectKey is required (connect to a project first)." },
      { status: 400 }
    );
  }

  const apiKey = process.env.LD_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      {
        error:
          "LD_API_KEY is not set. Add your LaunchDarkly API token to .env to create AI configs.",
      },
      { status: 503 }
    );
  }

  const seedPath = join(process.cwd(), "ai-configs-seed.json");

  let backup;
  try {
    const raw = await readFile(seedPath, "utf-8");
    backup = JSON.parse(raw);
  } catch (e) {
    const msg =
      e.code === "ENOENT"
        ? "ai-configs-seed.json not found in project root"
        : e.message || "Failed to read seed file";
    return Response.json({ error: msg }, { status: 400 });
  }

  const aiConfigs = backup?.ai_configs;
  if (!Array.isArray(aiConfigs) || aiConfigs.length === 0) {
    return Response.json(
      { error: "ai-configs-seed.json has no ai_configs array" },
      { status: 400 }
    );
  }

  // Process mode "judge" configs first, then pause 2s before the rest (so judges exist when others reference them)
  const judgeConfigs = aiConfigs.filter((c) => c.mode === "judge");
  const otherConfigs = aiConfigs.filter((c) => c.mode !== "judge");
  const orderedConfigs = [...judgeConfigs, ...otherConfigs];

  const results = { created: [], failed: [], skipped: [] };
  const headers = ldHeaders(apiKey);

  for (let i = 0; i < orderedConfigs.length; i++) {
    const config = orderedConfigs[i];
    const isJudge = config.mode === "judge";
    const justFinishedJudges = isJudge === false && i > 0 && orderedConfigs[i - 1].mode === "judge";
    if (justFinishedJudges && judgeConfigs.length > 0) {
      await new Promise((r) => setTimeout(r, 2000));
    }

    const configKey = config.key;
    const configName = config.name || configKey;
    const description = config.description ?? "";
    const mode = (config.mode === "judge" || config.mode === "agent" ? config.mode : "completion");
    const tags = Array.isArray(config.tags) ? config.tags : [];

    const createBody = {
      key: configKey,
      name: configName,
      description,
      mode,
      tags,
    };
    if (mode === "judge") {
      for (const v of config.targeting.variations) {
        if (v.value?.evaluationMetricKey) {
          createBody.evaluationMetricKey = v.value.evaluationMetricKey;
          break;
        }
      }
    }

    try {
      // Skip create if config already exists (avoids "could not find the enabled variation" etc.)
      const getRes = await fetch(
        `${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs/${encodeURIComponent(configKey)}`,
        { method: "GET", headers }
      );
      if (getRes.ok) {
        results.skipped.push(configKey);
        continue;
      }

      const createRes = await fetch(
        `${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs`,
        { method: "POST", headers, body: JSON.stringify(createBody) }
      );

      if (!createRes.ok) {
        const errBody = await createRes.text();
        let errMsg = errBody;
        try {
          const j = JSON.parse(errBody);
          if (j.message) errMsg = j.message;
        } catch {}
        results.failed.push({
          key: configKey,
          step: "create_config",
          status: createRes.status,
          message: errMsg,
        });
        continue;
      }

      results.created.push({ key: configKey, variations: 0 });

      const variations = config.variations || [];
      for (const v of variations) {
        const vKey = v.key;
        if (!vKey) continue;
        const vName = v.name || vKey;
        const messages = Array.isArray(v.messages) ? v.messages : [];
        const model = normalizeModel(v);
        const modelConfigKey = v.modelConfigKey || "";

        const varPayload = {
          key: vKey,
          name: vName,
          messages,
          model,
          modelConfigKey: modelConfigKey || undefined,
        };
        if (v.judgeConfiguration?.judges?.length) {
          varPayload.judgeConfiguration = {
            judges: v.judgeConfiguration.judges.map((j) => ({
              judgeConfigKey: j.judgeConfigKey,
              samplingRate: j.samplingRate,
            })),
          };
        }

        const varRes = await fetch(
          `${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs/${encodeURIComponent(configKey)}/variations`,
          {
            method: "POST",
            headers,
            body: JSON.stringify(varPayload),
          }
        );

        if (!varRes.ok) {
          const errBody = await varRes.text();
          let errMsg = errBody;
          try {
            const j = JSON.parse(errBody);
            if (j.message) errMsg = j.message;
          } catch {}
        results.failed.push({
          key: configKey,
          variation: vKey,
          step: "create_variation",
          status: varRes.status,
          message: errMsg,
        });
        } else {
          const last = results.created[results.created.length - 1];
          if (last && last.key === configKey) last.variations += 1;
        }
      }

      // Set which variation is served when the flag is on (defaults.onVariation + fallthrough per env)
      const defaults = config.targeting?.defaults;
      if (defaults && typeof defaults.onVariation === "number") {
        const patchBody = {
          defaults: {
            onVariation: defaults.onVariation,
            offVariation: defaults.offVariation ?? 0,
          },
        };
        const envs = config.targeting.environments;
        if (envs && typeof envs === "object") {
          patchBody.environments = {};
          for (const [envKey, env] of Object.entries(envs)) {
            if (env?.fallthrough?.variation !== undefined) {
              patchBody.environments[envKey] = {
                fallthrough: { variation: env.fallthrough.variation },
                offVariation: env.offVariation ?? 0,
              };
            }
          }
        }
        const patchRes = await fetch(
          `${LD_API_BASE}/flags/${encodeURIComponent(projectKey)}/${encodeURIComponent(configKey)}`,
          { method: "PATCH", headers, body: JSON.stringify(patchBody) }
        );
        if (!patchRes.ok) {
          const errBody = await patchRes.text();
          let errMsg = errBody;
          try {
            const j = JSON.parse(errBody);
            if (j.message) errMsg = j.message;
          } catch {}
          results.failed.push({
            key: configKey,
            step: "patch_targeting",
            status: patchRes.status,
            message: errMsg,
          });
        }
      }
    } catch (e) {
      results.failed.push({
        key: configKey,
        step: "request",
        message: e.message || String(e),
      });
    }
  }

  const totalCreated = results.created.length;
  const totalVariations = results.created.reduce((s, c) => s + (c.variations ?? 0), 0);
  const totalFailed = results.failed.length;
  const totalSkipped = results.skipped.length;

  return Response.json({
    ok: totalFailed === 0,
    message:
      totalFailed === 0
        ? `Created ${totalCreated} AI config(s) with ${totalVariations} variation(s) in project "${projectKey}".` +
          (totalSkipped > 0 ? ` Skipped ${totalSkipped} existing: ${results.skipped.join(", ")}.` : "")
        : `Created ${totalCreated} config(s), ${totalVariations} variation(s); ${totalFailed} failure(s).` +
          (totalSkipped > 0 ? ` Skipped ${totalSkipped}: ${results.skipped.join(", ")}.` : ""),
    projectKey,
    created: results.created,
    failed: results.failed,
    skipped: results.skipped,
  });
}
