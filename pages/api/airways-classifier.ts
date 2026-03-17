import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
const OpenAI = require("openai");
import { NextApiRequest, NextApiResponse } from "next";
import { getServerClient } from "@/utils/ld-server";
import { getCookie } from "cookies-next";
import { initAi } from "@launchdarkly/server-sdk-ai";
import { LD_CONTEXT_COOKIE_KEY } from "@/utils/constants";
import { v4 as uuidv4 } from "uuid";
import { pushLog } from "@/lib/log-stream";
import { runClassifierPipeline } from "@/lib/airways-classifier";
import type { AirwaysIntent } from "@/lib/airways-eval-dataset";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
		const { userInput, expectedIntent } = body as {
			userInput: string;
			expectedIntent?: AirwaysIntent;
		};

		if (!userInput || typeof userInput !== "string") {
			return res.status(400).json({ error: "userInput is required" });
		}

		pushLog({ level: "INFO", message: `✈️ Airways classifier · "${userInput.slice(0, 60)}${userInput.length > 60 ? "…" : ""}"`, name: "classifier" });

		const region = process.env.AWS_DEFAULT_REGION ?? process.env.AWS_REGION ?? "us-east-1";
		const bedrockClient = new BedrockRuntimeClient({ region });
		const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

		const clientSideContext = JSON.parse(
			getCookie(LD_CONTEXT_COOKIE_KEY, { res, req })?.toString() || "{}",
		);
		const context: any = clientSideContext && Object.keys(clientSideContext).length > 0
			? clientSideContext
			: { kind: "user", key: uuidv4() };

		const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
		const aiClient = initAi(ldClient);

		// Set up SSE streaming
		res.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		});

		const sendSSE = (data: Record<string, unknown>) => {
			try {
				res.write(`data: ${JSON.stringify(data)}\n\n`);
			} catch { /* connection may have closed */ }
		};

		const sendStatus = (msg: string) => {
			sendSSE({ status: msg });
		};

		const result = await runClassifierPipeline({
			aiClient,
			context,
			bedrockClient,
			openai,
			userInput,
			expectedIntent,
			sendStatus,
		});

		// Send classification result
		sendSSE({ classification: result.classification });

		// Send eval result if present
		if (result.eval) {
			sendSSE({ eval: result.eval });
		}

		// Send improvement result if present
		if (result.improvement) {
			sendSSE({ improvement: result.improvement });
		}

		// Final event
		sendSSE({ done: true, result });

		res.end();

		pushLog({ level: "INFO", message: `✅ Classifier pipeline complete`, name: "classifier" });
	} catch (error: any) {
		console.error("Error in airways-classifier:", error);
		pushLog({ level: "ERROR", message: `❌ Classifier error: ${error?.message ?? "Unknown"}`, name: "classifier" });

		if (!res.headersSent) {
			res.status(500).json({ error: "Internal Server Error" });
		} else {
			try {
				res.write(`data: ${JSON.stringify({ error: error?.message, done: true })}\n\n`);
			} catch { /* ignore */ }
			res.end();
		}
	}
}
