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

  const results = { created: [], failed: [] };
  const headers = ldHeaders(apiKey);

  for (const config of aiConfigs) {
    const configKey = config.key;
    const configName = config.name || configKey;
    const description = config.description ?? "";
    const mode = (config.mode === "judge" || config.mode === "agent" ? config.mode : "completion");
    const tags = Array.isArray(config.tags) ? config.tags : [];

    try {
      const createRes = await fetch(
        `${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            key: configKey,
            name: configName,
            description,
            mode,
            tags,
          }),
        }
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

        const varRes = await fetch(
          `${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs/${encodeURIComponent(configKey)}/variations`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              key: vKey,
              name: vName,
              messages,
              model,
              modelConfigKey: modelConfigKey || undefined,
            }),
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

  return Response.json({
    ok: totalFailed === 0,
    message:
      totalFailed === 0
        ? `Created ${totalCreated} AI config(s) with ${totalVariations} variation(s) in project "${projectKey}".`
        : `Created ${totalCreated} config(s), ${totalVariations} variation(s); ${totalFailed} failure(s).`,
    projectKey,
    created: results.created,
    failed: results.failed,
  });
}
