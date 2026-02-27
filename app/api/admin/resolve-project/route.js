const LD_API_BASE = "https://app.launchdarkly.com/api/v2";

/**
 * Resolve project (and environment) key from an SDK key by listing projects and
 * environments and matching the environment's apiKey (server-side SDK key).
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sdkKey = body?.sdkKey?.trim();
  if (!sdkKey) {
    return Response.json({ error: "sdkKey is required" }, { status: 400 });
  }

  const apiKey = process.env.LD_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      {
        error:
          "LD_API_KEY is not set. Add your LaunchDarkly API token to .env to resolve project.",
      },
      { status: 503 }
    );
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: apiKey,
  };

  try {
    const projectsRes = await fetch(`${LD_API_BASE}/projects`, { headers });
    if (!projectsRes.ok) {
      const text = await projectsRes.text();
      return Response.json(
        { error: "Failed to list projects", detail: text },
        { status: projectsRes.status >= 500 ? 502 : projectsRes.status }
      );
    }

    const projects = await projectsRes.json();
    const items = projects.items || projects;
    if (!Array.isArray(items)) {
      return Response.json(
        { error: "Unexpected projects response shape" },
        { status: 502 }
      );
    }

    for (const project of items) {
      const projectKey = project.key;
      const envsRes = await fetch(
        `${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/environments`,
        { headers }
      );
      if (!envsRes.ok) continue;

      const envs = await envsRes.json();
      const envItems = envs.items || envs;
      if (!Array.isArray(envItems)) continue;

      const match = envItems.find((env) => env.apiKey === sdkKey);
      if (match) {
        return Response.json({
          projectKey,
          environmentKey: match.key,
          environmentName: match.name,
        });
      }
    }

    return Response.json(
      {
        error:
          "SDK key not found in any project. Check the key or ensure LD_API_KEY has access to that project.",
      },
      { status: 404 }
    );
  } catch (e) {
    return Response.json(
      { error: "Request failed", detail: e.message || String(e) },
      { status: 502 }
    );
  }
}
