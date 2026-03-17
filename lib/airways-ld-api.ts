/**
 * LD REST API helpers for pushing improved AI config versions.
 * Follows patterns from LDPlatform.py and utils/guardrail/ldApi.ts.
 */

const LD_BASE = "https://app.launchdarkly.com/api/v2";

function getEnv() {
	const apiToken = process.env.LD_API_KEY || process.env.LAUNCHDARKLY_API_TOKEN;
	const projectKey = process.env.PROJECT_KEY || process.env.LAUNCHDARKLY_PROJECT_KEY || process.env.NEXT_PUBLIC_PROJECT_KEY;
	const environmentKey = process.env.LAUNCHDARKLY_ENVIRONMENT_KEY || "production";
	return { apiToken, projectKey, environmentKey };
}

function headers(apiToken: string) {
	return {
		Authorization: apiToken,
		"Content-Type": "application/json",
		"LD-API-Version": "beta",
	};
}

export interface AiConfigVariation {
	_id: string;
	key: string;
	name: string;
	model?: any;
	messages?: any[];
	instructions?: string;
	[key: string]: any;
}

/** GET the full AI config including its variations. */
export async function getAiConfig(configKey: string): Promise<{ variations: AiConfigVariation[]; [key: string]: any }> {
	const { apiToken, projectKey } = getEnv();
	if (!apiToken || !projectKey) throw new Error("Missing LD API config (LD_API_KEY / PROJECT_KEY)");

	const url = `${LD_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs/${encodeURIComponent(configKey)}`;
	const res = await fetch(url, { headers: headers(apiToken) });
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GET ai-config failed: ${res.status} ${text}`);
	}
	return res.json();
}

/** Find a variation's _id by its key. */
export async function getVariationId(configKey: string, variationKey: string): Promise<string | null> {
	const config = await getAiConfig(configKey);
	for (const v of config.variations || []) {
		if (v.key === variationKey) return v._id;
	}
	return null;
}

/** Create a new variation on an AI config. Returns the created variation. */
export async function createVariation(
	configKey: string,
	variation: {
		key: string;
		name: string;
		model: { name: string };
		modelConfigKey: string;
		messages?: Array<{ role: string; content: string }>;
		instructions?: string;
	},
): Promise<AiConfigVariation> {
	const { apiToken, projectKey } = getEnv();
	if (!apiToken || !projectKey) throw new Error("Missing LD API config");

	const url = `${LD_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs/${encodeURIComponent(configKey)}/variations`;
	const payload = {
		key: variation.key,
		name: variation.name,
		model: variation.model,
		modelConfigKey: variation.modelConfigKey,
		messages: variation.messages || [],
		instructions: variation.instructions,
		tools: [],
		toolKeys: [],
	};

	const res = await fetch(url, {
		method: "POST",
		headers: headers(apiToken),
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`POST ai-config variation failed: ${res.status} ${text}`);
	}
	return res.json();
}

/** Update the fallthrough targeting to serve a specific variation. */
export async function updateFallthroughTargeting(configKey: string, variationId: string): Promise<void> {
	const { apiToken, projectKey, environmentKey } = getEnv();
	if (!apiToken || !projectKey) throw new Error("Missing LD API config");

	const url = `${LD_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs/${encodeURIComponent(configKey)}/targeting`;
	const payload = {
		environmentKey,
		instructions: [
			{
				kind: "updateFallthroughVariationOrRollout",
				variationId,
			},
		],
	};

	const res = await fetch(url, {
		method: "PATCH",
		headers: headers(apiToken),
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PATCH ai-config targeting failed: ${res.status} ${text}`);
	}
}
