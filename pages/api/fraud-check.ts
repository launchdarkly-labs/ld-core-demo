import type { NextApiRequest, NextApiResponse } from "next";
import * as ld from "@launchdarkly/node-server-sdk";

const ldClient = ld.init(process.env.NEXT_PUBLIC_LD_SDK_KEY || "");

type FraudCheckResponse = {
  success: boolean;
  status: "clear" | "suspicious" | "error";
  message: string;
  transactionsChecked?: number;
  timestamp?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FraudCheckResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      status: "error",
      message: "Method not allowed",
      error: "Only POST requests are allowed",
    });
  }

  try {
    await ldClient.waitForInitialization();

    const { userId = "anonymous" } = req.body;
    
    const user = {
      key: userId,
      anonymous: userId === "anonymous",
    };

    const simulateFraudError = await ldClient.variation(
      "simulateFraudError",
      user,
      false
    );

    // simulate API error if flag is on
    if (simulateFraudError) {
      return res.status(500).json({
        success: false,
        status: "error",
        message: "Fraud detection service temporarily unavailable",
        error: "API_ERROR: Unable to connect to fraud detection service",
      });
    }

    // simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // success response
    return res.status(200).json({
      success: true,
      status: "clear",
      message: "No suspicious activity detected",
      transactionsChecked: 47,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Fraud check error:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

