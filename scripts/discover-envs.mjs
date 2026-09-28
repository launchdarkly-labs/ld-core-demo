#!/usr/bin/env node
/**
 * Discover LD projects + their production client-side IDs and emit as JSON.
 *
 * Consumed by .github/workflows/audience-noise.yml to build a dynamic matrix.
 * Dynamic discovery is required because SE demo projects are deleted and
 * recreated on refresh, which rotates the client-side IDs.
 *
 * Env vars:
 *   LD_API_KEY          (required) Reader-level access is enough.
 *   LD_TARGET_ENV       Environment key to hit (default: production).
 *   LD_INCLUDE_PATTERN  Regex; only projects with matching keys are kept.
 *   LD_EXCLUDE_PATTERN  Regex; matching projects are skipped.
 *   LD_API_BASE         API host override (default: https://app.launchdarkly.com).
 */

const API_BASE = process.env.LD_API_BASE ?? 'https://app.launchdarkly.com';
const API_KEY = process.env.LD_API_KEY;
const TARGET_ENV = process.env.LD_TARGET_ENV ?? 'production';
const INCLUDE_PATTERN = process.env.LD_INCLUDE_PATTERN
  ? new RegExp(process.env.LD_INCLUDE_PATTERN)
  : null;
const EXCLUDE_PATTERN = process.env.LD_EXCLUDE_PATTERN
  ? new RegExp(process.env.LD_EXCLUDE_PATTERN)
  : null;

if (!API_KEY) {
  console.error('ERROR: LD_API_KEY is not set.');
  process.exit(1);
}

const HEADERS = {
  Authorization: API_KEY,
  'Content-Type': 'application/json',
  'LD-API-Version': '20240415',
};

async function getJson(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GET ${url} → ${res.status} ${res.statusText}\n${body}`);
  }
  return res.json();
}

async function listProjects() {
  // Follow the _links.next pagination chain until exhausted.
  const items = [];
  let url = `${API_BASE}/api/v2/projects?expand=environments&limit=100`;
  while (url) {
    const page = await getJson(url);
    if (Array.isArray(page.items)) items.push(...page.items);
    const next = page?._links?.next?.href;
    url = next ? `${API_BASE}${next}` : null;
  }
  return items;
}

async function fetchEnvironment(projectKey, envKey) {
  return getJson(
    `${API_BASE}/api/v2/projects/${encodeURIComponent(
      projectKey,
    )}/environments/${encodeURIComponent(envKey)}`,
  );
}

async function main() {
  const projects = await listProjects();
  const results = [];

  for (const project of projects) {
    const projectKey = project.key;
    const projectName = project.name;

    if (INCLUDE_PATTERN && !INCLUDE_PATTERN.test(projectKey)) continue;
    if (EXCLUDE_PATTERN && EXCLUDE_PATTERN.test(projectKey)) continue;

    let env = (project.environments?.items ?? project.environments ?? []).find(
      (e) => e?.key === TARGET_ENV,
    );

    // Rescue path for projects the ?expand call didn't embed envs on.
    if (!env) {
      try {
        env = await fetchEnvironment(projectKey, TARGET_ENV);
      } catch (err) {
        continue;
      }
    }

    if (!env || !env._id) continue;

    results.push({
      project: projectKey,
      name: projectName,
      env: TARGET_ENV,
      clientId: env._id,
    });
  }

  // JSON on stdout so CI can pipe it into a matrix; summary on stderr so
  // it doesn't pollute the JSON.
  process.stdout.write(JSON.stringify(results, null, 2) + '\n');
  console.error(
    `Discovered ${results.length} project(s) with a "${TARGET_ENV}" environment.`,
  );
}

main().catch((err) => {
  console.error('Fatal error discovering envs:');
  console.error(err.stack ?? err);
  process.exit(1);
});
