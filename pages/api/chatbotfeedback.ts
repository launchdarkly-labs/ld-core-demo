import { NextApiRequest, NextApiResponse } from "next";
import { getServerClient } from "@/utils/ld-server";
import { LD_CONTEXT_COOKIE_KEY } from "@/utils/constants";
import { getCookie } from "cookies-next";
import { initAi } from "@launchdarkly/server-sdk-ai";
import { v4 as uuidv4 } from "uuid";

enum LDFeedbackKind {
  Positive = "positive",
  Negative = "negative",
}

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
    const feedback = body?.feedback;

    // Assuming aiConfig is needed for feedback processing
    const aiConfigKey = body?.aiConfigKey; // Replace with actual key if needed
    const aiConfig = await aiClient.config(aiConfigKey, context, {}, {});
    const { tracker } = aiConfig;

    console.log("Received feedback:", feedback);
    let feedbackKind;
    if (feedback === "AI Chatbot Bad Service") {
      feedbackKind = { kind: LDFeedbackKind.Negative };
    }
    if (feedback === "AI chatbot good service") {
      feedbackKind = { kind: LDFeedbackKind.Positive };
    }

    if (feedbackKind) {
        const completion = await tracker.trackFeedback(feedbackKind);
    }
    
    res.status(200).json({ message: "Feedback received and processed" });
  } catch (error) {
    console.error("Error in chatbotFeedback", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
