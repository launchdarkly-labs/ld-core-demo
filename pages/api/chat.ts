import {
	BedrockRuntimeClient,
	ConverseCommand,
	ConverseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
	BedrockAgentRuntimeClient,
	RetrieveCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
const OpenAI = require("openai");
// KB retrieval implemented with user context filtering
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

		// Initialize OpenAI client
		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		// Initialize Bedrock Agent Runtime client for knowledge base retrieval
		const bedrockAgentClient = new BedrockAgentRuntimeClient({
			region,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
			},
		});

		if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
			throw new Error("AWS credentials are not set");
		}

		if (!process.env.OPENAI_API_KEY) {
			throw new Error("OpenAI API key is not set");
		}
		const body = JSON.parse(req.body);
		const aiConfigKey = body?.aiConfigKey;
		const userInput = body?.userInput;
		const chatHistory = body?.chatHistory || [];
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

		function mapChatHistoryToConversation(
			chatHistory: { role: string; content: string; id: string }[],
		): Message[] {
			return chatHistory.map((item) => ({
				role: item.role as 'user' | 'assistant',
				content: [{ text: item.content }],
			}));
		}

		function isBedrockModel(modelName: string): boolean {
			// Check if model name contains Bedrock-specific patterns
			const bedrockPatterns = [
				'anthropic.claude',
				'amazon.titan',
				'amazon.nova',
				'meta.llama',
				'cohere.command',
				'ai21.jurassic',
				'stability.stable-diffusion',
				'mistral.mistral',
				'deepseek.deepseek'
			];
			return bedrockPatterns.some(pattern => modelName.includes(pattern));
		}

		function mapMessagesToOpenAIFormat(messages: Message[]): any[] {
			return messages.map((msg) => ({
				role: msg.role as 'user' | 'assistant' | 'system',
				content: msg.content[0].text,
			}));
		}

		async function getKbPassages(question: string, kbId: string, userContext: any): Promise<string> {
			/**
			 * Query AWS Bedrock Knowledge Base using vector search with customer-specific filtering
			 */
			try {
				const response = await bedrockAgentClient.send(new RetrieveCommand({
					knowledgeBaseId: kbId,
					retrievalQuery: {
						text: question
					},
					retrievalConfiguration: {
						vectorSearchConfiguration: {
							numberOfResults: 15 // Get more results for better filtering
						}
					}
				}));

				const passages: string[] = [];
				const filteredPassages: string[] = [];

				// Extract all passages first
				for (const result of response.retrievalResults || []) {
					const content = result.content?.text || '';
					if (content) {
						passages.push(content);
					}
				}

				// Filter passages based on user context
				if (userContext) {
					const currentUserName = userContext.name || '';
					const currentUserTier = (userContext.tier || '').toLowerCase();

					for (const passage of passages) {
						const passageLower = passage.toLowerCase();

						// Skip passages that contain other customer profiles
						if (passageLower.includes('name:') && !passageLower.includes(currentUserName.toLowerCase())) {
							// This passage contains another customer's profile, skip it
							continue;
						}

						// For tier-specific information, only include relevant tiers
						const tierWords = ['diamond', 'platinum', 'gold', 'silver'];
						if (tierWords.some(tierWord => passageLower.includes(tierWord))) {
							// Keep only if it explicitly references the *current* tier or is a purely generic statement
							const mentionsCurrentTier = currentUserTier && passageLower.includes(currentUserTier);
							const mentionsOtherTiers = tierWords.some(
								otherTier => otherTier !== currentUserTier && passageLower.includes(otherTier)
							);

							if (mentionsCurrentTier && !mentionsOtherTiers) {
								filteredPassages.push(passage);
							} else {
								continue;
							}
						} else {
							// Generic information, include it
							filteredPassages.push(passage);
						}
					}
				} else {
					// No user context, return all passages
					filteredPassages.push(...passages);
				}

				// Always include ToggleBank general information
				const toggleBankInfo = `ToggleBank offers a comprehensive range of financial services! I can help you with:

• Checking & Savings Accounts - Checking balances, viewing transaction history, and managing your accounts
• Loans & Credit - Personal loans, home mortgages, auto loans, and credit card applications
• Investment Services - Portfolio management, investment advice, and retirement planning
• Digital Banking - Mobile app support, online transfers, and bill payments
• Customer Support - Account inquiries, technical assistance, and general banking questions

Is there a specific service you'd like to know more about?`;

				if (filteredPassages.length > 0) {
					// Add ToggleBank info to the beginning of the passages
					filteredPassages.unshift(toggleBankInfo);
					return filteredPassages.join('\n\n---\n\n');
				} else {
					// If no other passages found, return just the ToggleBank info
					return toggleBankInfo;
				}
			} catch (error) {
				console.error('Knowledge Base retrieval error:', error);
				return "Error retrieving passages from knowledge base.";
			}
		}


		// With no KB, source fidelity will be sourced from the judge (style/policy adherence)

		async function computeRelevanceLLM(userQuery: string, responseText: string, modelId: string): Promise<number | null> {
			try {
				const systemMsg = `You are a relevance scoring function. Read USER_QUERY and RESPONSE. Return JSON only with {"relevance_score": number between 0.0 and 1.0}. Focus on topical alignment and intent coverage. Do not explain.`;
				const userMsg = `USER_QUERY: ${userQuery}\n\nRESPONSE: ${responseText}`;
				
				// Judge always uses Bedrock - use the relevance model from environment or default
				let relevanceModelId = process.env.RELEVANCE_MODEL_ID || 'us.anthropic.claude-sonnet-4-20250514-v1:0';
				if (!relevanceModelId.startsWith('us.')) {
					relevanceModelId = 'us.' + relevanceModelId;
				}
				
				const cmd = new ConverseCommand({
					modelId: relevanceModelId,
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
			userQuestion: string;
		}): Promise<{ accuracy: number; factual_claims?: string[]; accurate_claims?: string[]; inaccurate_claims?: string[] }> {
			// Prefer using LD AI Config for judge if provided
			const judgeKey = "llm-as-judge";
			try {
				if (judgeKey) {
					// Pass the actual content as variables to LaunchDarkly for template replacement
					// Include user context so judge knows WHO the response is about
					const judgeVariables = {
						source_passages: params.sourcePassages.join('\n---\n'),
						response_text: params.responseText,
						user_question: params.userQuestion, // Include the original user question
						user_context: params.userContext.name || "Anonymous User" // Get from LaunchDarkly context
					};
					
					
					const judgeConfig = await aiClient.config(judgeKey, params.userContext, {}, judgeVariables);
					if (!judgeConfig?.model) throw new Error('Judge AI Config missing model');
					let modelId = judgeConfig.model.name;
					if (!modelId.startsWith('us.')) modelId = 'us.' + modelId;
					// Gather any system messages from the AI Config
					let systemTexts: string[] = [];
					(judgeConfig.messages || []).forEach((m: any) => {
						if (m.role === 'system' && typeof m.content === 'string') systemTexts.push(m.content);
					});
					const userPayload = `USER CONTEXT: ${JSON.stringify(params.userContext)}\n\nRESPONSE TO CHECK:\n${params.responseText}`;
					// Read guardrail custom params from judge config or environment
					let grId: string | undefined, grVersion: string | undefined, grKnowledgeId: string | undefined;
					const custom = judgeConfig.model?.custom;
					if (custom && typeof custom === 'object') {
						grId = (custom as any).BEDROCK_GUARDRAIL_ID ?? grId;
						grVersion = (custom as any).BEDROCK_GUARDRAIL_VERSION ?? grVersion;
						grKnowledgeId = (custom as any).BEDROCK_KNOWLEDGE_ID ?? grKnowledgeId;
					}
				
					const command = new ConverseCommand({
						modelId,
						...(systemTexts.length > 0 ? { system: systemTexts.map((t) => ({ text: t })) } : {}),
						messages: [ { role: 'user', content: [ { text: userPayload } ] } ],
						inferenceConfig: {
							temperature: (judgeConfig.model?.parameters?.temperature as number) ?? 0.9,
							maxTokens: (judgeConfig.model?.parameters?.maxTokens as number) ?? 1000,
						},
						...(grId && grVersion ? { 
							guardrailConfig: { 
								guardrailIdentifier: grId, 
								guardrailVersion: grVersion, 
								trace: 'enabled',
								...(grKnowledgeId ? { knowledgeBaseId: grKnowledgeId } : {})
							} 
						} : {}),
					});
					const resp: any = await bedrockClient.send(command);
					const text = resp?.output?.message?.content?.[0]?.text ?? '';
					const start = text.indexOf('{');
					const end = text.lastIndexOf('}');
					let parsed: any = {};
					if (start !== -1 && end !== -1 && end > start) {
						const maybe = text.slice(start, end + 1);
						try { parsed = JSON.parse(maybe); } catch {}
					}
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
				const systemMessage = `You are a fact-checking expert. Compare the response against the source material and identify any factual errors.\n\nInstructions:\n1. Extract key factual claims from the response (names, numbers, dates, policies, requirements)\n2. Check each factual claim against the source material\n3. When the response uses "your", "you", or personal pronouns, match them to the specific user mentioned in USER CONTEXT\n4. Ignore tone, style, helpfulness - focus ONLY on factual accuracy\n5. Return a JSON with:\n   - "factual_claims": list of key facts claimed in response\n   - "accurate_claims": list of claims that are accurate per source\n   - "inaccurate_claims": list of claims that are wrong or unsupported\n   - "accuracy_score": decimal from 0.0 to 1.0\n\nResponse format: {"factual_claims": [...], "accurate_claims": [...], "inaccurate_claims": [...], "accuracy_score": 0.95}`;
				const userPayload = `USER CONTEXT: ${JSON.stringify(params.userContext)}\n\nUSER QUESTION: ${params.userQuestion}\n\nSOURCE MATERIAL:\n${params.sourcePassages.join('\n---\n')}\n\nRESPONSE TO CHECK:\n${params.responseText}`;
				// Fallback judge always uses Bedrock
				const command = new ConverseCommand({
					modelId: fallbackModelId,
					system: [ { text: systemMessage } ],
					messages: [ { role: 'user', content: [ { text: userPayload } ] } ],
					inferenceConfig: { temperature: 0.9, maxTokens: 1000 },
					...(envGrId && envGrVersion ? { 
						guardrailConfig: { 
							guardrailIdentifier: envGrId, 
							guardrailVersion: envGrVersion, 
							trace: 'enabled',
							...(envKnowledgeId ? { knowledgeBaseId: envKnowledgeId } : {})
						} 
					} : {}),
				});
				const resp: any = await bedrockClient.send(command);
				const text = resp?.output?.message?.content?.[0]?.text ?? '';
				const start = text.indexOf('{');
				const end = text.lastIndexOf('}');
				let parsed: any = {};
				if (start !== -1 && end !== -1 && end > start) {
					const maybe = text.slice(start, end + 1);
					try { parsed = JSON.parse(maybe); } catch {}
				}
				const accuracy = typeof parsed?.accuracy_score === 'number' ? parsed.accuracy_score : 0;
				return {
					accuracy,
					factual_claims: parsed?.factual_claims,
					accurate_claims: parsed?.accurate_claims,
					inaccurate_claims: parsed?.inaccurate_claims,
				};
			} catch (e) {
				console.error('Judge error', e);
				return { accuracy: 0 };
			}
		}

		const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
		const aiClient = initAi(ldClient);
		const context: any = clientSideContext || {
			kind: "user",
			key: uuidv4(),
		};

		// Get initial AI config to extract knowledge base parameters
		const initialAiConfig = await aiClient.config(aiConfigKey, context, {}, {userInput: userInput, chatHistory: chatHistory});
		
		// Extract knowledge base configuration from AI config custom parameters
		const configDict = (initialAiConfig as any).to_dict?.() || {};
		const modelConfig = configDict.model || {};
		const customParams = modelConfig.custom || {};
		const kbId = customParams.kb_id;
		
		// Enhanced RAG query strategy with user context and tier information
		let enhancedQuery = userInput;
		if (kbId) {
			const userContextName = context.name || '';
			const userTier = context.tier || '';
			
			// Check if this is a personal query
			if (['my', 'i', 'me', 'mine'].some(word => userInput.toLowerCase().includes(word))) {
				// Personal queries should include the user's name and tier for better RAG results
				enhancedQuery = `${userContextName} ${userTier} tier ${userInput}`;
			} else {
				// Non-personal queries include tier for relevant policy information
				enhancedQuery = `${userTier} tier ${userInput}`;
			}
		}
		
		// Retrieve knowledge base passages if KB ID is available
		let sourcePassages: string[] = [];
		if (kbId) {
			const passages = await getKbPassages(enhancedQuery, kbId, context);
			
			// Validate that we have relevant passages for this user
			if (!passages.includes("No relevant passages found") && !passages.includes("Error retrieving")) {
				sourcePassages = passages.split('\n\n---\n\n').filter(p => p.trim().length > 0);
			} else {
				// Try a broader search without user context
				const fallbackQuery = userInput;
				const fallbackPassages = await getKbPassages(fallbackQuery, kbId, context);
				
				if (!fallbackPassages.includes("No relevant passages found") && !fallbackPassages.includes("Error retrieving")) {
					sourcePassages = fallbackPassages.split('\n\n---\n\n').filter(p => p.trim().length > 0);
				}
			}
		} else {
			// Even without KB, include ToggleBank general information
			const toggleBankInfo = `ToggleBank offers a comprehensive range of financial services! I can help you with:

• Checking & Savings Accounts - Checking balances, viewing transaction history, and managing your accounts
• Loans & Credit - Personal loans, home mortgages, auto loans, and credit card applications
• Investment Services - Portfolio management, investment advice, and retirement planning
• Digital Banking - Mobile app support, online transfers, and bill payments
• Customer Support - Account inquiries, technical assistance, and general banking questions

Is there a specific service you'd like to know more about?`;
			
			sourcePassages = [toggleBankInfo];
		}

		const aiConfig = initialAiConfig;
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
				const isBedrock = isBedrockModel(modelId);
				
				if (isBedrock && !modelId.startsWith('us.')) {
					modelId = 'us.' + modelId;
				}

				// Combine AI config messages with chat history
				const chatHistoryMessages = mapChatHistoryToConversation(chatHistory);
				const allMessages = [...mapPromptToConversation(aiConfig.messages ?? []), ...chatHistoryMessages];
				

				let fullResponse = '';
				let timeToFirstToken = 0;
				let firstTokenReceived = false;
				const startTime = Date.now(); // Start time for total duration
				let totalInputTokens = 0;
				let totalOutputTokens = 0;
				let totalTokens = 0;

				if (isBedrock) {
					// Use Bedrock streaming API
					const streamCommand = new ConverseStreamCommand({
						modelId: modelId,
						messages: allMessages,
						inferenceConfig: {
							temperature: (aiConfig.model?.parameters?.temperature as number) ?? 0.5,
							maxTokens: (aiConfig.model?.parameters?.maxTokens as number) ?? 200,
						},
					});

					const streamResponse = await bedrockClient.send(streamCommand);

					// Process the Bedrock stream
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
				} else {
					// Use OpenAI non-streaming API
					const openaiMessages = mapMessagesToOpenAIFormat(allMessages);
					const response = await openai.chat.completions.create({
						model: modelId,
						messages: openaiMessages,
						max_completion_tokens: (aiConfig.model?.parameters?.maxTokens as number) ?? 1000,
						response_format: { type: "text" }
					});

					// Get the full response - check multiple possible locations
					const choice = response.choices[0];
					fullResponse = choice?.message?.content ?? '';
					
					// If content is empty, check if there's reasoning or other content
					if (!fullResponse && choice?.message) {
						const message = choice.message;
						
						// Check for reasoning content or other possible content fields
						if (message.reasoning) {
							fullResponse = message.reasoning;
						} else if (message.annotations && message.annotations.length > 0) {
							fullResponse = message.annotations[0].content || '';
						} else {
							// If still no content, create a fallback response
							fullResponse = "I apologize, but I'm having trouble generating a response at the moment. Please try again.";
						}
					}
					
					// Track timing
					timeToFirstToken = Date.now() - startTime;
					tracker.trackTimeToFirstToken(timeToFirstToken);
					firstTokenReceived = true;

					// Get actual token usage from OpenAI response
					totalInputTokens = response.usage?.prompt_tokens ?? 0;
					totalOutputTokens = response.usage?.completion_tokens ?? 0;
					totalTokens = response.usage?.total_tokens ?? 0;

					// Send the complete response as a single chunk
					res.write(`data: ${JSON.stringify({ 
						chunk: fullResponse,
						done: false 
					})}\n\n`);
				}

				// After processing, send the total token usage
				const tokens: LDTokenUsage = {
					input: totalInputTokens,
					output: totalOutputTokens,
					total: totalTokens,
				};
				tracker.trackTokens?.(tokens);

		// Calculate total generation time
		const totalTime = Date.now() - startTime;
		tracker.trackDuration?.(totalTime);

		// Calculate cost based on model and token usage
		function calculateModelCost(modelId: string, inputTokens: number, outputTokens: number): number {
			// Pricing per 1000 tokens (as of early 2025)
			const pricing: { [key: string]: { input: number; output: number } } = {
				// Claude models
				'claude-3-7-sonnet': { input: 0.003, output: 0.015 },
				'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
				'claude-3-haiku': { input: 0.00025, output: 0.00125 },
				// Nova models  
				'nova-pro': { input: 0.0008, output: 0.0032 },
				'nova-lite': { input: 0.0006, output: 0.0024 },
				// OpenAI models
				'gpt-4o': { input: 0.005, output: 0.015 },
				'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
				'gpt-5-mini': { input: 0.0002, output: 0.0008 },
				// Fallback pricing
				'default': { input: 0.002, output: 0.008 }
			};

			// Find matching pricing by checking model name
			let modelPricing = pricing.default;
			for (const [key, value] of Object.entries(pricing)) {
				if (modelId.toLowerCase().includes(key.toLowerCase())) {
					modelPricing = value;
					break;
				}
			}

			// Calculate cost: (tokens / 1000) * price_per_1000_tokens
			const inputCost = (inputTokens / 1000) * modelPricing.input;
			const outputCost = (outputTokens / 1000) * modelPricing.output;
			return Number((inputCost + outputCost).toFixed(6));
		}

		const responseCost = calculateModelCost(modelId, totalInputTokens, totalOutputTokens);

		// Notify client that validation is in progress
				try {
					res.write(`data: ${JSON.stringify({ status: 'validating' })}\n\n`);
					// Flush by sending a heartbeat event to nudge the stream
					res.write(`data: ${JSON.stringify({ heartbeat: true })}\n\n`);
					await new Promise((r) => setTimeout(r, 30));
				} catch {}

				// Compute metrics with retrieved passages: LLM-based relevance with Claude Sonnet 4, else jaccard; fidelity via judge
				const judge = await judgeFactualAccuracy({ 
					userContext: context, 
					sourcePassages: sourcePassages, 
					responseText: fullResponse,
					userQuestion: userInput
				});
				const relModel = process.env.RELEVANCE_MODEL_ID || 'us.anthropic.claude-sonnet-4-20250514-v1:0';
				let relevance: number | null = await computeRelevanceLLM(userInput, fullResponse, relModel);
				if (relevance === null) relevance = computeRelevanceJaccard(userInput, fullResponse);
				const sourceFidelity = (judge as any).sourceFidelity ?? judge.accuracy ?? 0;

				// Track custom metrics in LaunchDarkly using the existing client
				try {
					ldClient.track?.('ai-source-fidelity', context, undefined, sourceFidelity);
					ldClient.track?.('ai-relevance', context, undefined, relevance);
					ldClient.track?.('ai-accuracy', context, undefined, judge.accuracy);
					ldClient.track?.('ai-cost', context, undefined, responseCost);
				} catch (e) {
					console.warn('LD tracking failed', e);
				}

				// Push to local buffer for metrics endpoint
				try { pushMetric({ ts: Date.now(), sourceFidelity, relevance, accuracy: judge.accuracy, cost: responseCost }); } catch {}

				// Send the final response with timing information and metrics
				const data = {
					response: fullResponse,
					modelName: aiConfig?.model?.name,
					modelType: isBedrock ? 'bedrock' : 'openai',
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
						cost: responseCost,
						judge,
						sourcePassageCount: sourcePassages.length,
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
