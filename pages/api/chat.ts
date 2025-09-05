import {
	BedrockRuntimeClient,
	ConverseCommand,
	ConverseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
// KB retrieval not required per UX repo behavior
import { NextApiRequest, NextApiResponse } from "next";
import { getServerClient } from "@/utils/ld-server";
import { getCookie } from "cookies-next";
import { initAi, LDTokenUsage } from "@launchdarkly/server-sdk-ai";
import { pushMetric } from "./guardrail/metrics";
import { addUserToSegment } from "@/utils/guardrail/ldApi";
import { LD_CONTEXT_COOKIE_KEY } from "@/utils/constants";
import { v4 as uuidv4 } from "uuid";

export default async function chatResponse(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
			const DEBUG = ((process.env.AI_DEBUG || process.env.DEBUG_AI || "").toLowerCase() in { "true":1, "1":1, "yes":1 });
			const dlog = (...args: any[]) => { if (DEBUG) { console.log("[AI DEBUG]", ...args); } };
		const region = process.env.AWS_DEFAULT_REGION ?? process.env.AWS_REGION ?? "us-west-2";
		const bedrockClient = new BedrockRuntimeClient({
			region,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
			},
		});

        // No Bedrock Agent Runtime client needed

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

        // No KB retrieval needed


		// With no KB, source fidelity will be sourced from the judge (style/policy adherence)

		async function computeRelevanceLLM(userQuery: string, responseText: string, modelId: string): Promise<number | null> {
			try {
				const systemMsg = `You are a relevance scoring function. Read USER_QUERY and RESPONSE. Return JSON only with {"relevance_score": number between 0.0 and 1.0}. Focus on topical alignment and intent coverage. Do not explain.`;
				const userMsg = `USER_QUERY: ${userQuery}\n\nRESPONSE: ${responseText}`;
				if (!modelId.startsWith('us.')) modelId = 'us.' + modelId;
				const cmd = new ConverseCommand({
					modelId,
					system: [ { text: systemMsg } ],
					messages: [ { role: 'user', content: [ { text: userMsg } ] } ],
					inferenceConfig: { temperature: 0.0, maxTokens: 200 },
				});
				const resp: any = await bedrockClient.send(cmd);
				const text = resp?.output?.message?.content?.[0]?.text ?? '';
				const start = text.indexOf('{');
				const end = text.lastIndexOf('}');
				let parsed: any = {};
				if (start !== -1 && end !== -1 && end > start) {
					const maybe = text.slice(start, end + 1);
					try { parsed = JSON.parse(maybe); } catch {}
				}
				const score = typeof parsed?.relevance_score === 'number' ? parsed.relevance_score : null;
				return score;
			} catch (e) {
				return null;
			}
		}

		function computeRelevanceJaccard(userQuery: string, responseText: string): number {
			const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
			const qa = new Set(normalize(userQuery));
			const ra = new Set(normalize(responseText));
			if (qa.size === 0 || ra.size === 0) return 0;
			let inter = 0;
			for (const w of qa) if (ra.has(w)) inter++;
			const uni = new Set([...qa, ...ra]).size;
			return inter / uni;
		}

		async function judgeFactualAccuracy(params: {
			userContext: any;
			sourcePassages: string[];
			responseText: string;
		}): Promise<{ accuracy: number; factual_claims?: string[]; accurate_claims?: string[]; inaccurate_claims?: string[] }> {
			// Prefer using LD AI Config for judge if provided
			const judgeKey = process.env.LAUNCHDARKLY_LLM_JUDGE_KEY;
			try {
				if (judgeKey) {
					const judgeConfig = await aiClient.config(judgeKey, params.userContext, {}, {
						user_context: params.userContext,
						source_passages: params.sourcePassages.join('\n---\n'),
						response_text: params.responseText,
					});
					if (!judgeConfig?.model) throw new Error('Judge AI Config missing model');
					let modelId = judgeConfig.model.name;
					if (!modelId.startsWith('us.')) modelId = 'us.' + modelId;
					dlog('judge using LD model', modelId);
					// Gather any system messages from the AI Config
					let systemTexts: string[] = [];
					(judgeConfig.messages || []).forEach((m: any) => {
						if (m.role === 'system' && typeof m.content === 'string') systemTexts.push(m.content);
					});
					const userPayload = `USER CONTEXT: ${JSON.stringify(params.userContext)}\n\nRESPONSE TO CHECK:\n${params.responseText}`;
					// Read guardrail custom params from judge config or environment
					let grId: string | undefined, grVersion: string | undefined, grKnowledgeId: string | undefined;
					const custom = (judgeConfig as any)?.custom;
					if (custom && typeof custom === 'string') {
						try {
							const customObj = JSON.parse(custom);
							grId = customObj.BEDROCK_GUARDRAIL_ID;
							grVersion = customObj.BEDROCK_GUARDRAIL_VERSION;
							grKnowledgeId = customObj.BEDROCK_KNOWLEDGE_ID;
						} catch {}
					}
					grId = grId ?? (judgeConfig as any)?.gr_id ?? process.env.BEDROCK_GUARDRAIL_ID;
					grVersion = "1";
					grKnowledgeId = grKnowledgeId ?? (judgeConfig as any)?.BEDROCK_KNOWLEDGE_ID;
					const command = new ConverseCommand({
						modelId,
						...(systemTexts.length > 0 ? { system: systemTexts.map((t) => ({ text: t })) } : {}),
						messages: [ { role: 'user', content: [ { text: userPayload } ] } ],
						inferenceConfig: {
							temperature: (judgeConfig.model?.parameters?.temperature as number) ?? 0.9,
							maxTokens: (judgeConfig.model?.parameters?.maxTokens as number) ?? 1000,
						},
						...(grId && grVersion ? { guardrailConfig: { guardrailIdentifier: grId, guardrailVersion: grVersion, trace: 'enabled' } } : {}),
					});
					const resp: any = await bedrockClient.send(command);
					const text = resp?.output?.message?.content?.[0]?.text ?? '';
					dlog('judge raw (first 300 chars)', text.slice(0, 300));
					const start = text.indexOf('{');
					const end = text.lastIndexOf('}');
					let parsed: any = {};
					if (start !== -1 && end !== -1 && end > start) {
						const maybe = text.slice(start, end + 1);
						try { parsed = JSON.parse(maybe); } catch {}
					}
					dlog('judge parsed', parsed);
					const accuracy = typeof parsed?.accuracy_score === 'number' ? parsed.accuracy_score : 0;
					return {
						accuracy,
						factual_claims: parsed?.factual_claims,
						accurate_claims: parsed?.accurate_claims,
						inaccurate_claims: parsed?.inaccurate_claims,
					};
				}
				// Fallback: static judge prompt and model
				const fallbackModelId = process.env.JUDGE_MODEL_ID ?? 'us.anthropic.claude-3-5-sonnet-20241022-v2:0';
				dlog('judge using fallback model', fallbackModelId);
				const systemMessage = `You are a fact-checking expert. Compare the response against the source material and identify any factual errors.\n\nInstructions:\n1. Extract key factual claims from the response (names, numbers, dates, policies, requirements)\n2. Check each factual claim against the source material\n3. When the response uses "your", "you", or personal pronouns, match them to the specific user mentioned in USER CONTEXT\n4. Ignore tone, style, helpfulness - focus ONLY on factual accuracy\n5. Return a JSON with:\n   - "factual_claims": list of key facts claimed in response\n   - "accurate_claims": list of claims that are accurate per source\n   - "inaccurate_claims": list of claims that are wrong or unsupported\n   - "accuracy_score": decimal from 0.0 to 1.0\n\nResponse format: {"factual_claims": [...], "accurate_claims": [...], "inaccurate_claims": [...], "accuracy_score": 0.95}`;
				const userPayload = `USER CONTEXT: ${JSON.stringify(params.userContext)}\n\nSOURCE MATERIAL:\n${params.sourcePassages.join('\n---\n')}\n\nRESPONSE TO CHECK:\n${params.responseText}`;
				const envGrId = process.env.BEDROCK_GUARDRAIL_ID;
				const envGrVersion = process.env.BEDROCK_GUARDRAIL_VERSION;
				const command = new ConverseCommand({
					modelId: fallbackModelId,
					system: [ { text: systemMessage } ],
					messages: [ { role: 'user', content: [ { text: userPayload } ] } ],
					inferenceConfig: { temperature: 0.9, maxTokens: 1000 },
					...(envGrId && envGrVersion ? { guardrailConfig: { guardrailIdentifier: envGrId, guardrailVersion: envGrVersion, trace: 'enabled' } } : {}),
				});
				const resp: any = await bedrockClient.send(command);
				const text = resp?.output?.message?.content?.[0]?.text ?? '';
				dlog('judge raw (first 300 chars)', text.slice(0, 300));
				const start = text.indexOf('{');
				const end = text.lastIndexOf('}');
				let parsed: any = {};
				if (start !== -1 && end !== -1 && end > start) {
					const maybe = text.slice(start, end + 1);
					try { parsed = JSON.parse(maybe); } catch {}
				}
				dlog('judge parsed', parsed);
				const accuracy = typeof parsed?.accuracy_score === 'number' ? parsed.accuracy_score : 0;
				return {
					accuracy,
					factual_claims: parsed?.factual_claims,
					accurate_claims: parsed?.accurate_claims,
					inaccurate_claims: parsed?.inaccurate_claims,
				};
			} catch (e) {
				if (DEBUG) console.error('[AI DEBUG] Judge error', e);
				return { accuracy: 0 };
			}
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

			dlog('aiConfig.model', aiConfig.model?.name);
			dlog('aiConfig.messages', (aiConfig.messages));
			const { tracker } = aiConfig;

			try {
				// Guardrail clamp: pull blocked patterns from system message JSON if provided
				let patternList: string[] = [];
				try {
					const systemMsg = (aiConfig.messages || []).find((m: any) => m.role === 'system');
					if (systemMsg) {
						if (typeof systemMsg.content === 'string') {
							const raw = systemMsg.content as string;
							// Strip /* */ block comments and // line comments from JSON-like string
							let sanitized = raw.replace(/\/\*[\s\S]*?\*\//g, '');
							sanitized = sanitized.replace(/(^|\s)\/\/.*$/gm, '');
							try {
								const parsed = JSON.parse(sanitized);
								const blocked = parsed?.system_prompt?.blocked_phrases;
								if (Array.isArray(blocked)) patternList = blocked as string[];
							} catch {
								// Fallback: manually extract strings inside blocked_phrases array
								const m = sanitized.match(/\"blocked_phrases\"\s*:\s*\[([\s\S]*?)\]/);
								if (m && m[1]) {
									const items = [...m[1].matchAll(/\"([^\"]+)\"/g)].map(g => g[1]);
									if (items.length) patternList = items;
								}
							}
						}
						if (typeof systemMsg.content === 'object' && systemMsg.content !== null) {
							const blockedObj = (systemMsg.content as any)?.system_prompt?.blocked_phrases;
							if (Array.isArray(blockedObj)) patternList = blockedObj as string[];
						}
					}
				} catch {}

				let matched: string | null = null;
				if (typeof userInput === 'string') {
					for (const p of patternList) {
						let hit = false;
						try {
							const re = new RegExp(p, 'i');
							hit = re.test(userInput);
						} catch {
							hit = userInput.toLowerCase().includes(String(p).toLowerCase());
						}
						if (hit) { matched = p; break; }
					}
				}
				dlog('guardrail patterns', { count: patternList.length, sample: patternList.slice(0,5), matched });

				// If any pattern matches, add user to Blocked Users segment
				let blockTriggered = false;
				if (matched) {
					try {
						const envKey = process.env.LAUNCHDARKLY_ENVIRONMENT_KEY || 'production';
						const projectKey = process.env.PROJECT_KEY || '';
						const segmentKey = 'blocked-users';
						const rawUserKey = (context as any)?.user?.key;
						const userKey: string | undefined = typeof rawUserKey === 'string' ? rawUserKey : undefined;
						if (userKey) {
							await addUserToSegment({ projectKey, environmentKey: envKey, segmentKey, userKey });
							blockTriggered = true;
						}
					} catch (e) {
						console.warn('Failed to add user to Blocked Users segment', e);
					}
				}

				if (matched || blockTriggered) {
					res.writeHead(200, {
						'Content-Type': 'text/event-stream',
						'Cache-Control': 'no-cache',
						'Connection': 'keep-alive',
					});
					const safeMessage = "Your access to the chatbot has been blocked due to suspicious or inappropriate activity. If you believe this is a mistake, please contact support.";
					res.write(`data: ${JSON.stringify({ chunk: safeMessage, done: false })}\n\n`);
					res.write(`data: ${JSON.stringify({ response: safeMessage, modelName: aiConfig?.model?.name, enabled: false, done: true })}\n\n`);
					try { pushMetric({ ts: Date.now(), clamped: true, trigger: matched || 'blocked-users', inputSnippet: String(userInput).slice(0, 120) }); } catch {}
					res.end();
					return;
				}
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

				// Notify client that validation is in progress
				try {
					res.write(`data: ${JSON.stringify({ status: 'validating' })}\n\n`);
					// Flush by sending a heartbeat event to nudge the stream
					res.write(`data: ${JSON.stringify({ heartbeat: true })}\n\n`);
					await new Promise((r) => setTimeout(r, 30));
				} catch {}

				// Compute metrics (no KB): LLM-based relevance with Claude Sonnet 4, else jaccard; fidelity via judge
				const judge = await judgeFactualAccuracy({ userContext: context, sourcePassages: [], responseText: fullResponse });
				const relModel = process.env.RELEVANCE_MODEL_ID || 'us.anthropic.claude-sonnet-4-20250514-v1:0';
				let relevance: number | null = await computeRelevanceLLM(userInput, fullResponse, relModel);
				if (relevance === null) relevance = computeRelevanceJaccard(userInput, fullResponse);
				const sourceFidelity = (judge as any).sourceFidelity ?? judge.accuracy ?? 0;
				dlog('metrics computed', { sourceFidelity, relevance, accuracy: (judge as any).accuracy });

				// Track custom metrics in LaunchDarkly
				try {
					const ld = await getServerClient(process.env.LD_SDK_KEY || "");
					// @ts-ignore
					ld.track?.('ai.source_fidelity', context, undefined, sourceFidelity);
					// @ts-ignore
					ld.track?.('ai.relevance', context, undefined, relevance);
					// @ts-ignore
					ld.track?.('ai.factual_accuracy', context, undefined, judge.accuracy);
				} catch (e) {
					console.warn('LD tracking failed', e);
				}

				// Push to local buffer for metrics endpoint
				try { pushMetric({ ts: Date.now(), sourceFidelity, relevance, accuracy: judge.accuracy }); } catch {}

				// Send the final response with timing information and metrics
				const data = {
					response: fullResponse,
					modelName: aiConfig?.model?.name,
					enabled: aiConfig.enabled,
					timing: {
						timeToFirstToken: timeToFirstToken,
						totalTime: totalTime,
					},
					tokens,
					metrics: {
						sourceFidelity,
						relevance,
						accuracy: judge.accuracy,
						judge,
						sourcePassageCount: 0,
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
