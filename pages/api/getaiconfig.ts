import { NextApiRequest, NextApiResponse } from "next";
import { getServerClient } from "@/utils/ld-server";
import { LD_CONTEXT_COOKIE_KEY } from "@/utils/constants";
import { getCookie } from "cookies-next";
import { initAi } from "@launchdarkly/server-sdk-ai";
import { v4 as uuidv4 } from "uuid";
import { parse, stringify } from "flatted";
import c from "../_app";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const clientSideContext = JSON.parse(
      getCookie(LD_CONTEXT_COOKIE_KEY, { res, req }) || "{}"
    );
    const extractedClientSideAudienceKey = clientSideContext?.audience?.key;
    const clientSideAudienceContext = {
      kind: "audience",
      key: extractedClientSideAudienceKey,
    };
    const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
    const aiClient = initAi(ldClient);
    const context: any = clientSideAudienceContext || {
      kind: "audience",
      key: uuidv4().slice(0, 6),
    };
    const body = JSON.parse(req.body);
    const aiConfigKey = body?.aiConfigKey;

    const aiConfig = await aiClient.config(aiConfigKey!, context, {}, {});
    const resultArray = [aiConfig.model, aiConfig.enabled];
    res.status(200).json(resultArray);
  } catch (error) {
    console.error("Error in chatResponse", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
