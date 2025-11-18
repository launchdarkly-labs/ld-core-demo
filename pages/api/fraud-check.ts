import type { NextApiRequest, NextApiResponse } from "next";
import * as ld from "@launchdarkly/node-server-sdk";
import { recordErrorToLD } from "@/utils/observability/server";

let ldClient: ld.LDClient | null = null;

if (process.env.NEXT_PUBLIC_LD_SDK_KEY) {
  ldClient = ld.init(process.env.NEXT_PUBLIC_LD_SDK_KEY);
}

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
    // simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let simulateFraudError = false;

    if (ldClient) {
      try {
        await ldClient.waitForInitialization({ timeout: 3 });

        const { userId = "anonymous" } = req.body;
        
        const user = {
          key: userId,
          anonymous: userId === "anonymous",
        };

        simulateFraudError = await ldClient.variation(
          "simulateFraudError",
          user,
          false
        );
      } catch (ldError) {
        console.warn("LaunchDarkly not available, using default values:", ldError);
      }
    }

    // simulate API error if flag is on
    if (simulateFraudError) {
      return res.status(500).json({
        success: false,
        status: "error",
        message: "Fraud detection service temporarily unavailable",
        error: "API_ERROR: Unable to connect to fraud detection service",
      });
    }

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
    if (error instanceof Error) {
      await recordErrorToLD(
        error,
        "Failed to process fraud check",
        {
          component: "FraudCheckAPI",
          endpoint: "/api/fraud-check",
        }
      );
    }
    return res.status(500).json({
      success: false,
      status: "error",
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

