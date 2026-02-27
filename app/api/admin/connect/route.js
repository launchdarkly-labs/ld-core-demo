const LD_API_BASE = "https://app.launchdarkly.com/api/v2";
const DEFAULT_ENV_KEY = "production";

/**
 * Connect to a LaunchDarkly project by project key.
 * 1. Check project exists (GET project)
 * 2. Get production environment SDK key
 * 3. Return { projectKey, sdkKey, environmentKey } for session
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const projectKey = body?.projectKey?.trim();
  if (!projectKey) {
    return Response.json({ error: "projectKey is required" }, { status: 400 });
  }

  const apiKey = process.env.LD_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "LD_API_KEY is not set. Add your LaunchDarkly API token to .env to connect." },
      { status: 503 }
    );
  }

  const headers = { "Content-Type": "application/json", Authorization: apiKey };

  try {
    const projectRes = await fetch(
      `${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}`,
      { headers }
    );
    if (projectRes.status === 404) {
      return Response.json(
        { error: "Project not found. Check the project key and that LD_API_KEY has access." },
        { status: 404 }
      );
    }
    if (!projectRes.ok) {
      const text = await projectRes.text();
      return Response.json(
        { error: "Failed to load project", detail: text },
        { status: projectRes.status >= 500 ? 502 : projectRes.status }
      );
    }

    const envsRes = await fetch(
      `${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/environments`,
      { headers }
    );
    if (!envsRes.ok) {
      const text = await envsRes.text();
      return Response.json(
        { error: "Failed to load environments", detail: text },
        { status: envsRes.status >= 500 ? 502 : envsRes.status }
      );
    }

    const envs = await envsRes.json();
    const items = envs.items ?? envs;
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json(
        { error: "Project has no environments." },
        { status: 400 }
      );
    }

    const production = items.find((e) => e.key === DEFAULT_ENV_KEY) ?? items[0];
    const sdkKey = production.apiKey;
    if (!sdkKey) {
      return Response.json(
        { error: `Environment "${production.key}" has no SDK key.` },
        { status: 400 }
      );
    }

    return Response.json({
      projectKey,
      sdkKey,
      environmentKey: production.key,
      environmentName: production.name,
    });
  } catch (e) {
    return Response.json(
      { error: "Request failed", detail: e.message || String(e) },
      { status: 502 }
    );
  }
}
