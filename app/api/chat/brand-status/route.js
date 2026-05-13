import "../../../../server/init-ld.js";
import { runWithSdkKey, getLdClient, peekBrandAgentCompletion } from "../../../../server/ld.js";

export const dynamic = "force-dynamic";

function createUserContext(body = {}) {
  const rawKey = body.userKey ?? body.user_key;
  const user_key =
    typeof rawKey === "string" && rawKey.trim().length > 0
      ? rawKey.trim().slice(0, 256)
      : "anonymous";
  return {
    user_key,
    name: body.userName ?? "Ellen McLain",
    location: body.location ?? "Cadillac, MI",
    policy_id: body.policyId ?? "TH-HMO-GOLD-2024",
    coverage_type: body.coverageType ?? "Gold HMO",
  };
}

/**
 * Returns what LaunchDarkly evaluates for `brand_agent` (completion) for the given context — used to gate the chat UI.
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

  const userContext = createUserContext(body);

  try {
    const ldPeek = await runWithSdkKey(sdkKey, async () => {
      await getLdClient();
      return peekBrandAgentCompletion(userContext);
    });

    return Response.json(
      {
        brandAgentDisabled: ldPeek.brandAgentDisabled,
        ldPeek,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("brand-status:", err);
    return Response.json(
      {
        brandAgentDisabled: false,
        error: err?.message ?? "Failed to read brand_agent status",
        ldPeek: null,
      },
      { status: 500 }
    );
  }
}
