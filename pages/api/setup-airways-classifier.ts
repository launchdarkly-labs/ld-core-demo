import { readFile } from "fs/promises";
import { join } from "path";
import { NextApiRequest, NextApiResponse } from "next";

const LD_API_BASE = "https://app.launchdarkly.com/api/v2";

function ldHeaders(apiKey: string) {
	return {
		"Content-Type": "application/json",
		Authorization: apiKey,
		"LD-API-Version": "beta",
	};
}

function normalizeModel(variation: any) {
	const m = variation.model;
	if (!m) return { parameters: {} };
	const modelName = m.modelName || m.name;
	const parameters = m.parameters || {};
	if (modelName) return { modelName, parameters };
	return { parameters };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
	const projectKey = body?.projectKey?.trim();
	const apiKey = (process.env.LD_API_KEY || process.env.LAUNCHDARKLY_API_TOKEN)?.trim();

	if (!projectKey) {
		return res.status(400).json({ error: "projectKey is required" });
	}
	if (!apiKey) {
		return res.status(400).json({ error: "LD_API_KEY is not set. Add your LaunchDarkly API token to .env to create AI configs." });
	}

	// Read the seed file — check multiple locations (local dev vs Docker)
	const candidates = [
		join(process.cwd(), "lib", "airways-classifier-seed.json"),
		join(process.cwd(), "airways-classifier-seed.json"),
		join(__dirname, "..", "..", "lib", "airways-classifier-seed.json"),
		"/app/lib/airways-classifier-seed.json",
		"/app/airways-classifier-seed.json",
	];
	let seed: any;
	let seedPath: string | null = null;
	for (const p of candidates) {
		try {
			const raw = await readFile(p, "utf-8");
			seed = JSON.parse(raw);
			seedPath = p;
			break;
		} catch { /* try next */ }
	}
	if (!seedPath || !seed) {
		return res.status(500).json({ error: `Seed file not found. Checked: ${candidates.join(", ")}` });
	}

	const aiConfigs = seed?.ai_configs;
	if (!Array.isArray(aiConfigs) || aiConfigs.length === 0) {
		return res.status(500).json({ error: "Seed file has no ai_configs" });
	}

	const headers = ldHeaders(apiKey);
	const results: {
		created: Array<{ key: string; variations: number }>;
		failed: Array<{ key: string; step: string; status?: number; message: string }>;
		skipped: string[];
		targetingUpdated: string[];
	} = {
		created: [],
		failed: [],
		skipped: [],
		targetingUpdated: [],
	};

	for (const config of aiConfigs) {
		const configKey = config.key;
		const configName = config.name || configKey;
		const description = config.description ?? "";
		const mode = config.mode || "completion";
		const tags = Array.isArray(config.tags) ? config.tags : [];

		try {
			// Check if config already exists
			const getRes = await fetch(
				`${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs/${encodeURIComponent(configKey)}`,
				{ method: "GET", headers },
			);
			if (getRes.ok) {
				results.skipped.push(configKey);
				continue;
			}

			// Create the config
			const createRes = await fetch(
				`${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs`,
				{
					method: "POST",
					headers,
					body: JSON.stringify({ key: configKey, name: configName, description, mode, tags }),
				},
			);

			if (!createRes.ok) {
				const errText = await createRes.text();
				let errMsg = errText;
				try { errMsg = JSON.parse(errText).message || errText; } catch {}
				results.failed.push({ key: configKey, step: "create_config", status: createRes.status, message: errMsg });
				continue;
			}

			results.created.push({ key: configKey, variations: 0 });

			// Create variations
			for (const v of config.variations || []) {
				const vKey = v.key;
				if (!vKey) continue;

				const varPayload: any = {
					key: vKey,
					name: v.name || vKey,
					messages: Array.isArray(v.messages) ? v.messages : [],
					model: normalizeModel(v),
					modelConfigKey: v.modelConfigKey || undefined,
				};

				const varRes = await fetch(
					`${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs/${encodeURIComponent(configKey)}/variations`,
					{ method: "POST", headers, body: JSON.stringify(varPayload) },
				);

				if (!varRes.ok) {
					const errText = await varRes.text();
					let errMsg = errText;
					try { errMsg = JSON.parse(errText).message || errText; } catch {}
					results.failed.push({ key: configKey, step: "create_variation", status: varRes.status, message: errMsg });
				} else {
					const last = results.created[results.created.length - 1];
					if (last && last.key === configKey) last.variations += 1;
				}
			}

			// Enable targeting and set fallthrough to the first variation
			// First, get the config to find the variation ID
			const refetchRes = await fetch(
				`${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs/${encodeURIComponent(configKey)}`,
				{ method: "GET", headers },
			);
			if (refetchRes.ok) {
				const configData = await refetchRes.json();
				const variations = configData.variations || [];
				if (variations.length > 0) {
					const variationId = variations[0]._id;
					const environmentKey = process.env.LAUNCHDARKLY_ENVIRONMENT_KEY || "production";

					// Turn on the config in the environment
					const enableRes = await fetch(
						`${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs/${encodeURIComponent(configKey)}/targeting`,
						{
							method: "PATCH",
							headers,
							body: JSON.stringify({
								environmentKey,
								instructions: [
									{ kind: "turnFlagOn" },
								],
							}),
						},
					);

					if (!enableRes.ok) {
						const errText = await enableRes.text();
						let errMsg = errText;
						try { errMsg = JSON.parse(errText).message || errText; } catch {}
						results.failed.push({ key: configKey, step: "enable_targeting", status: enableRes.status, message: errMsg });
					}

					// Set fallthrough to serve the first variation
					const ftRes = await fetch(
						`${LD_API_BASE}/projects/${encodeURIComponent(projectKey)}/ai-configs/${encodeURIComponent(configKey)}/targeting`,
						{
							method: "PATCH",
							headers,
							body: JSON.stringify({
								environmentKey,
								instructions: [
									{ kind: "updateFallthroughVariationOrRollout", variationId },
								],
							}),
						},
					);

					if (ftRes.ok) {
						results.targetingUpdated.push(configKey);
					} else {
						const errText = await ftRes.text();
						let errMsg = errText;
						try { errMsg = JSON.parse(errText).message || errText; } catch {}
						results.failed.push({ key: configKey, step: "patch_targeting", status: ftRes.status, message: errMsg });
					}
				}
			}
		} catch (e: any) {
			results.failed.push({ key: configKey, step: "request", message: e.message || String(e) });
		}
	}

	const totalCreated = results.created.length;
	const totalVariations = results.created.reduce((s, c) => s + (c.variations ?? 0), 0);

	return res.status(200).json({
		ok: results.failed.length === 0,
		message: `Created ${totalCreated} AI config(s) with ${totalVariations} variation(s). ${results.skipped.length} skipped. ${results.failed.length} failed. ${results.targetingUpdated.length} targeting updated.`,
		projectKey,
		...results,
	});
}
