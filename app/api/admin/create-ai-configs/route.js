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
  // TODO: wire to actual create AI configs logic (e.g. LaunchDarkly API)
  return Response.json({ ok: true, message: "Create AI configs (stub)." });
}
