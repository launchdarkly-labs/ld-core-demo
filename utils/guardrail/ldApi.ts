type ToggleParams = {
    apiToken?: string;
    projectKey?: string;
    environmentKey?: string;
    flagKey: string;
};

export async function setFlagOnOff({ apiToken, projectKey, environmentKey, flagKey }: ToggleParams & { on: boolean }): Promise<boolean>;
export async function setFlagOnOff(params: any): Promise<boolean> {
    const apiToken = params.apiToken ?? process.env.LAUNCHDARKLY_API_TOKEN;
    const projectKey = params.projectKey ?? process.env.LAUNCHDARKLY_PROJECT_KEY;
    const environmentKey = params.environmentKey ?? process.env.LAUNCHDARKLY_ENVIRONMENT_KEY;
    const flagKey = params.flagKey;
    const on = params.on as boolean;
    console.log("apiToken:", apiToken);
    console.log("projectKey:", projectKey);
    console.log("environmentKey:", environmentKey);
    console.log("flagKey:", flagKey);
    console.log("on:", on);
    if (!apiToken || !projectKey || !environmentKey || !flagKey) {
        throw new Error("Missing LaunchDarkly API configuration");
    }

    const url = `https://app.launchdarkly.com/api/v2/flags/${encodeURIComponent(projectKey)}/${encodeURIComponent(flagKey)}`;
    const patch = [
        { op: "replace", path: "/on", value: on },
    ];
    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            "Authorization": apiToken,
            "Content-Type": "application/json; domain-model=launchdarkly.semanticpatch",
        },
        body: JSON.stringify({ patch }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`LD flag toggle failed: ${res.status} ${text}`);
    }
    return true;
}

export async function getFlagOnOff({ apiToken, projectKey, environmentKey, flagKey }: ToggleParams): Promise<boolean> {
    const token = apiToken ?? process.env.LAUNCHDARKLY_API_TOKEN;
    const proj = projectKey ?? process.env.LAUNCHDARKLY_PROJECT_KEY;
    const env = environmentKey ?? process.env.LAUNCHDARKLY_ENVIRONMENT_KEY;
    if (!token || !proj || !env || !flagKey) {
        throw new Error("Missing LaunchDarkly API configuration");
    }
    const url = `https://app.launchdarkly.com/api/v2/flags/${encodeURIComponent(proj)}/${encodeURIComponent(flagKey)}`;
    const res = await fetch(url, {
        headers: { "Authorization": token },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`LD flag get failed: ${res.status} ${text}`);
    }
    const json = await res.json();
    return !!json?.on;
}

export async function addUserToSegment(params: { apiToken?: string; projectKey?: string; environmentKey?: string; segmentKey: string; userKey: string; }): Promise<boolean> {
    const apiToken = params.apiToken ?? process.env.LD_API_KEY;
    const projectKey = params.projectKey ?? process.env.PROJECT_KEY;
    const environmentKey = params.environmentKey ?? process.env.LAUNCHDARKLY_ENVIRONMENT_KEY;
    const { segmentKey, userKey } = params;

    if (!apiToken || !projectKey || !environmentKey || !segmentKey || !userKey) {
        console.log("apiToken:", apiToken);
        console.log("projectKey:", projectKey);
        console.log("environmentKey:", environmentKey);
        console.log("segmentKey:", segmentKey);
        console.log("userKey:", userKey);
        throw new Error("Missing LaunchDarkly API configuration for segment patch");
    }

    const url = `https://app.launchdarkly.com/api/v2/segments/${encodeURIComponent(projectKey)}/${encodeURIComponent(environmentKey)}/${encodeURIComponent(segmentKey)}`;

    const payload = {
        patch: [
            {
                op: "add",
                path: "/included/0",
                value: userKey
            }
        ]
    };

    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            "Authorization": apiToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Patch segment failed: ${res.status} ${text}`);
    }

    return true;
}


