import {
	BedrockRuntimeClient,
	ConverseCommand,
	ConverseStreamCommand,
	InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerClient } from "@/utils/ld-server";
import { getCookie } from "cookies-next";
import { initAi, LDTokenUsage } from "@launchdarkly/server-sdk-ai";
import { LD_CONTEXT_COOKIE_KEY } from "@/utils/constants";
import { v4 as uuidv4 } from "uuid";

export default async function chatResponse(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const bedrockClient = new BedrockRuntimeClient({
			region: process.env.AWS_DEFAULT_REGION ?? "us-west-2",
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
			},
		});

		if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
			throw new Error("AWS credentials are not set");
		}
		const body = JSON.parse(req.body);
		const aiConfigKey = body?.aiConfigKey;
		const userInput = body?.userInput;
		const clientSideContext = JSON.parse(
			getCookie(LD_CONTEXT_COOKIE_KEY, { res, req }) || "{}"
		);

		function mapPromptToConversation(
			prompt: { role: 'user' | 'assistant' | 'system'; content: string }[],
		): Message[] {
			return prompt.map((item) => ({
				role: item.role !== 'system' ? item.role : 'user',
				content: [{ text: item.content }],
			}));
		} 

		const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
		const aiClient = initAi(ldClient);
		const context: any = clientSideContext || {
			kind: "user",
			key: uuidv4(),
		};

		const aiConfig = await aiClient.config(aiConfigKey, context, {}, {userInput: userInput});
		if (!aiConfig.enabled) {
			throw new Error("AI config is disabled");
		} else {
			if (!aiConfig.model) {
				throw new Error("AI model configuration is undefined");
			}

			if (!aiConfig.messages || aiConfig.messages.length === 0) {
				throw new Error("AI config messages are undefined or empty");
			}

			const { tracker } = aiConfig;

			try {
				// Set response headers for streaming
				res.writeHead(200, {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					'Connection': 'keep-alive',
				});

				// Get the model ID from AI Configs
				let modelId = aiConfig.model.name;
				if (!modelId.startsWith('us.')) {
					modelId = 'us.' + modelId;
				}

				// Use streaming API
				const streamCommand = new ConverseStreamCommand({
					modelId: modelId,
					messages: mapPromptToConversation(aiConfig.messages ?? []),
					inferenceConfig: {
						temperature: (aiConfig.model?.parameters?.temperature as number) ?? 0.5,
						maxTokens: (aiConfig.model?.parameters?.maxTokens as number) ?? 200,
					},
				});

				const streamResponse = await bedrockClient.send(streamCommand);
				let fullResponse = '';
				let timeToFirstToken = 0;
				let firstTokenReceived = false;
				const startTime = Date.now(); // Start time for total duration

				// Process the stream
				let totalInputTokens = 0;
				let totalOutputTokens = 0;
				let totalTokens = 0;

				for await (const chunk of streamResponse.stream ?? []) {
					if (chunk.contentBlockDelta?.delta?.text) {
						// If this is the first token/chunk

						if (!firstTokenReceived) {
							timeToFirstToken = Date.now() - startTime;
							tracker.trackTimeToFirstToken(timeToFirstToken);
							firstTokenReceived = true;
						}

						const textChunk = chunk.contentBlockDelta.delta.text;
						fullResponse += textChunk;

						// Stream each chunk to the client using SSE format
						res.write(`data: ${JSON.stringify({ 
							chunk: textChunk,
							done: false 
						})}\n\n`);
					}
					if (chunk.metadata?.usage) {
						const usage = chunk.metadata.usage;
						totalInputTokens += usage.inputTokens ?? 0;
						totalOutputTokens += usage.outputTokens ?? 0;
						totalTokens += usage.totalTokens ?? 0;
					}
				}

				// After the loop, send the total token usage
				const tokens: LDTokenUsage = {
					input: totalInputTokens,
					output: totalOutputTokens,
					total: totalTokens,
				};
				tracker.trackTokens?.(tokens);

				// Calculate total generation time
				const totalTime = Date.now() - startTime;
				tracker.trackDuration?.(totalTime);

				// Send the final response with timing information
				const data = {
					response: fullResponse,
					modelName: aiConfig?.model?.name,
					enabled: aiConfig.enabled,
					timing: {
						timeToFirstToken: timeToFirstToken,
						totalTime: totalTime, // Optionally include in response
					},
					done: true
				};

				res.write(`data: ${JSON.stringify(data)}\n\n`);
				res.end();

				tracker.trackSuccess();
			} catch (error: any) {
				console.error("Error sending request to Bedrock:", error);
				tracker.trackError();

				// If we haven't started streaming yet, send a standard error response
        if (!res.writableEnded) {
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          // If we've already started streaming, send an error in the stream
					res.write(`data: ${JSON.stringify({ error: "Stream Error", done: true })}\n\n`);
					res.end();
				}
			}
		}
	} catch (error: any) {
		console.error("Error in chatResponse:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

// TypeScript interface for the Message type used in the mapPromptToConversation function
interface Message {
	role: 'user' | 'assistant';
	content: Array<{ text: string }>;
}
