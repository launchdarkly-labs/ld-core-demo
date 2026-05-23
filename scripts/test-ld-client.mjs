/**
 * Client-side SDK smoke test (no API key).
 * Uses the same eval endpoint the browser SDK fetches.
 *
 * Usage: SIRIUS_PUBLIC_LD_CLIENT_SIDE_ID=... node scripts/test-ld-client.mjs
 */

const clientSideID = process.env.SIRIUS_PUBLIC_LD_CLIENT_SIDE_ID;
const flagKey = "subscriber-flow-version";
const context = {
  kind: "user",
  key: "anonymous-plans-visitor",
  anonymous: true,
};

if (!clientSideID) {
  console.error("Set SIRIUS_PUBLIC_LD_CLIENT_SIDE_ID");
  process.exit(1);
}

const b64 = Buffer.from(JSON.stringify(context)).toString("base64");
const url = `https://app.launchdarkly.com/sdk/evalx/${clientSideID}/contexts/${b64}`;

const res = await fetch(url);
if (!res.ok) {
  console.error("Eval request failed:", res.status, await res.text());
  process.exit(1);
}

const flags = await res.json();
const raw = flags[flagKey];
const value =
  raw && typeof raw === "object" && "value" in raw ? raw.value : raw;

console.log("Client-side ID:", clientSideID);
console.log("Flag in SDK payload:", flagKey in flags);
console.log("Resolved value:", value ?? "(missing — app falls back to v1)");
console.log("Reason metadata:", raw?.reason ?? raw ?? "n/a");
console.log("Flags delivered to SDK:", Object.keys(flags).sort().join(", "));
