import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Stable proxy endpoint for LD Observability alert webhooks -> flag triggers.
 *
 * Flag trigger URLs are regenerated whenever a project is deleted and
 * recreated (which the demo provisioning does every time an SE refreshes
 * their env). Pointing observability alerts directly at a trigger URL would
 * break on every recreation. Instead, alerts point here and we look up the
 * current trigger URL at call time via the LD REST API.
 *
 * Usage:
 *   POST /api/observability-webhook?flag=paymentKillSwitch
 */

const LD_API_BASE = 'https://app.launchdarkly.com';
const PROJECT_KEY = process.env.PROJECT_KEY;
const API_KEY = process.env.LD_API_KEY;
const ENV_KEY = process.env.LAUNCHDARKLY_ENVIRONMENT_KEY || 'production';

async function fetchCurrentTriggerUrl(flagKey: string): Promise<string | null> {
    const url = `${LD_API_BASE}/api/v2/flags/${encodeURIComponent(
        PROJECT_KEY!,
    )}/${encodeURIComponent(flagKey)}/triggers/${encodeURIComponent(ENV_KEY)}`;

    const res = await fetch(url, {
        headers: {
            Authorization: API_KEY!,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        console.error(
            `[observability-webhook] Failed to list triggers for ${flagKey}: ` +
                `${res.status} ${res.statusText}`,
        );
        return null;
    }

    const data = await res.json();
    const items = Array.isArray(data) ? data : data?.items ?? [];
    // Grab the first enabled trigger; SEs rarely have more than one per flag.
    const trigger = items.find((t: any) => t?.enabled !== false) ?? items[0];
    return trigger?.triggerURL ?? trigger?.triggerUrl ?? null;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    if (!PROJECT_KEY || !API_KEY) {
        return res.status(500).json({
            error:
                'Missing required env vars: PROJECT_KEY and/or LD_API_KEY',
        });
    }

    const flagKey =
        (req.query.flag as string | undefined) ??
        (req.body as any)?.flag ??
        null;
    if (!flagKey) {
        return res
            .status(400)
            .json({ error: 'Missing `flag` (pass as ?flag=... or JSON body)' });
    }

    try {
        const triggerUrl = await fetchCurrentTriggerUrl(flagKey);
        if (!triggerUrl) {
            return res
                .status(404)
                .json({ error: `No trigger found for flag "${flagKey}"` });
        }

        // Forward the original alert payload so it lands in the flag's audit
        // log intact. Fallback to a minimal payload if the caller sent nothing.
        const forwardBody =
            req.body && Object.keys(req.body).length > 0
                ? req.body
                : {
                      eventName: `Observability alert -> ${flagKey}`,
                      url: '',
                  };

        const upstream = await fetch(triggerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(forwardBody),
        });

        return res.status(upstream.status).json({
            forwardedTo: triggerUrl,
            upstreamStatus: upstream.status,
        });
    } catch (err: any) {
        console.error('[observability-webhook] Error:', err);
        return res.status(500).json({ error: err?.message ?? String(err) });
    }
}
