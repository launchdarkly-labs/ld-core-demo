import { NextApiRequest, NextApiResponse } from "next";
import { getCookie, setCookie } from "cookies-next";
import { LD_CONTEXT_COOKIE_KEY } from "@/utils/constants";
import { v4 as uuidv4 } from "uuid";

interface LaunchDarklyContext {
  kind: string;
  key: string;
  ai?: {
    key: string;
    fallback: boolean;
  };
  [key: string]: unknown;
}

export default async function resetSelfHealing(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const clientSideContext = JSON.parse(
      getCookie(LD_CONTEXT_COOKIE_KEY, { res, req })?.toString() || "{}"
    );

    if (
      clientSideContext &&
      typeof clientSideContext === "object" &&
      Object.keys(clientSideContext).length > 0
    ) {
      const ctx = clientSideContext as LaunchDarklyContext;
      if (!ctx.kind) ctx.kind = "user";
      if (!ctx.key && ctx.kind === "user") ctx.key = uuidv4();
      ctx.ai = { key: "ai-context", fallback: false };
      setCookie(LD_CONTEXT_COOKIE_KEY, JSON.stringify(ctx), { req, res });
    }

    return res.status(200).json({ success: true, message: "AI context reset successfully" });
  } catch {
    return res.status(500).json({ error: "Failed to reset AI context" });
  }
}
