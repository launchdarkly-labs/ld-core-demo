import { pushLog } from "./log-stream";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BankingCategory =
  | "accounts"
  | "loans_credit"
  | "investments"
  | "transfers"
  | "customer_support";

export interface LLMCallResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
}

export type CallLLMFn = (
  systemPrompt: string,
  userMessage: string,
) => Promise<LLMCallResult>;

export interface TriageResult {
  category: BankingCategory;
  confidence: number;
  reasoning: string;
  durationMs: number;
  inputTokens: number;
  outputTokens: number;
}

export interface SpecialistResult {
  content: string;
  category: BankingCategory;
  durationMs: number;
  inputTokens: number;
  outputTokens: number;
}

export interface BrandVoiceResult {
  content: string;
  durationMs: number;
  inputTokens: number;
  outputTokens: number;
}

export interface MultiAgentResult {
  finalResponse: string;
  triage: TriageResult;
  specialist: SpecialistResult;
  brandVoice: BrandVoiceResult;
  totalInputTokens: number;
  totalOutputTokens: number;
}

// ---------------------------------------------------------------------------
// Category metadata
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<BankingCategory, string> = {
  accounts: "Accounts",
  loans_credit: "Loans & Credit",
  investments: "Investments",
  transfers: "Transfers",
  customer_support: "Customer Support",
};

// ---------------------------------------------------------------------------
// System prompts
// ---------------------------------------------------------------------------

const TRIAGE_SYSTEM_PROMPT = `You are a banking query classifier for ToggleBank. Classify the customer's query into exactly one category.

Categories:
- accounts: Checking/savings accounts, balances, transactions, account management, statements, fees
- loans_credit: Personal loans, home mortgages, auto loans, credit cards, credit applications, interest rates, payments
- investments: Portfolio management, investment advice, retirement planning, stocks, bonds, mutual funds, 401k
- transfers: Wire transfers, online transfers, bill payments, money movement, Zelle, ACH
- customer_support: General questions about ToggleBank, technical issues, complaints, other inquiries that don't fit the categories above

Return ONLY a JSON object (no markdown fencing):
{"category": "<key>", "confidence": <0-1>, "reasoning": "<one sentence>"}`;

const SPECIALIST_PROMPTS: Record<BankingCategory, string> = {
  accounts: `You are ToggleBank's Accounts Specialist. You have deep expertise in checking accounts, savings accounts, money market accounts, CDs, account fees, transaction history, and account management.

Answer the customer's question thoroughly and accurately. Use specific details when possible. If the question requires account-specific information you don't have, explain what the customer should do to get that information (e.g., log in to online banking, visit a branch, call support).

Keep your response factual, helpful, and under 200 words unless the question requires a longer explanation.`,

  loans_credit: `You are ToggleBank's Loans & Credit Specialist. You have deep expertise in personal loans, home mortgages, auto loans, credit cards, lines of credit, interest rates, loan applications, payment schedules, and credit-related policies.

Answer the customer's question thoroughly and accurately. Provide specific rate ranges or policy details when relevant. If the question requires application-specific information, guide the customer on next steps.

Keep your response factual, helpful, and under 200 words unless the question requires a longer explanation.`,

  investments: `You are ToggleBank's Investment Services Specialist. You have deep expertise in portfolio management, retirement planning (401k, IRA), stocks, bonds, mutual funds, ETFs, investment advisory services, and wealth management.

Answer the customer's question thoroughly and accurately. When discussing investments, remind customers that past performance doesn't guarantee future results when appropriate. Guide them to speak with a financial advisor for personalized advice.

Keep your response factual, helpful, and under 200 words unless the question requires a longer explanation.`,

  transfers: `You are ToggleBank's Digital Banking & Transfers Specialist. You have deep expertise in wire transfers, ACH transfers, Zelle payments, bill pay, mobile deposits, online banking features, and money movement between accounts.

Answer the customer's question thoroughly and accurately. Include relevant details about transfer limits, processing times, and fees when applicable.

Keep your response factual, helpful, and under 200 words unless the question requires a longer explanation.`,

  customer_support: `You are ToggleBank's Customer Support Specialist. You handle general banking questions, technical support for online and mobile banking, account inquiries, complaints, and any questions that don't fit a specific domain.

Answer the customer's question thoroughly and accurately. Be empathetic and solution-oriented. If the issue requires escalation, explain the process clearly.

Keep your response factual, helpful, and under 200 words unless the question requires a longer explanation.`,
};

const BRAND_VOICE_PROMPT = `You are ToggleBank's Brand Voice editor. Your job is to take a specialist's response and ensure it matches ToggleBank's brand voice.

Brand guidelines:
- Warm, professional, and approachable tone
- Address the customer directly using "you" / "your"
- Be concise and clear — avoid jargon
- Maintain ALL factual content from the specialist response
- Format for readability (short paragraphs, bullet points where helpful)
- End with a helpful next step or offer for further assistance when appropriate

IMPORTANT: Do NOT add any information that wasn't in the specialist's response. Only adjust tone and formatting.

Specialist's response to rewrite:`;

// ---------------------------------------------------------------------------
// Agent functions
// ---------------------------------------------------------------------------

export async function runTriageAgent(
  query: string,
  callLLM: CallLLMFn,
  modelName: string,
): Promise<TriageResult> {
  pushLog({ level: "INFO", message: `🗂️ Triage — classifying query...`, name: "triage" });

  const result = await callLLM(TRIAGE_SYSTEM_PROMPT, query);

  let parsed: { category?: string; confidence?: number; reasoning?: string };
  try {
    const raw = result.content.trim().replace(/^```json?\s*|\s*```$/g, "");
    parsed = JSON.parse(raw);
  } catch {
    parsed = { category: "customer_support", confidence: 0.5, reasoning: "Could not parse triage response" };
  }

  const category = (Object.keys(CATEGORY_LABELS).includes(parsed.category ?? "")
    ? parsed.category
    : "customer_support") as BankingCategory;
  const confidence = typeof parsed.confidence === "number" ? parsed.confidence : 0.5;
  const label = CATEGORY_LABELS[category];

  pushLog({
    level: "INFO",
    message: `✅ Triage ==> ${label} @ ${(confidence * 100).toFixed(0)}% confidence`,
    name: "chat",
  });

  return {
    category,
    confidence,
    reasoning: parsed.reasoning ?? "",
    durationMs: result.durationMs,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
  };
}

export async function runSpecialistAgent(
  category: BankingCategory,
  query: string,
  sourcePassages: string[],
  callLLM: CallLLMFn,
  modelName: string,
): Promise<SpecialistResult> {
  const label = CATEGORY_LABELS[category];
  pushLog({ level: "INFO", message: `   Pulling AI config (${category}_specialist)...`, name: "specialist" });
  pushLog({ level: "INFO", message: `   Running ${category} specialist (${modelName})...`, name: "specialist" });

  let systemPrompt = SPECIALIST_PROMPTS[category];

  if (sourcePassages.length > 0) {
    systemPrompt += `\n\nUse the following reference material to inform your answer. Only use facts from this material:\n\n${sourcePassages.join("\n\n---\n\n")}`;
  }

  const result = await callLLM(systemPrompt, query);

  pushLog({
    level: "INFO",
    message: `   Specialist (${label}) response in ${result.durationMs}ms`,
    name: "specialist",
  });

  return {
    content: result.content,
    category,
    durationMs: result.durationMs,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
  };
}

export async function runBrandVoiceAgent(
  specialistResponse: string,
  query: string,
  category: BankingCategory,
  callLLM: CallLLMFn,
  modelName: string,
): Promise<BrandVoiceResult> {
  pushLog({ level: "INFO", message: `   Pulling AI config (brand_voice)...`, name: "brand" });

  const userMessage = `Original customer question: "${query}"\n\n${BRAND_VOICE_PROMPT}\n${specialistResponse}`;
  const result = await callLLM(
    "You are ToggleBank's brand voice editor. Rewrite the specialist's response following the brand guidelines provided. Return ONLY the rewritten response.",
    userMessage,
  );

  pushLog({
    level: "INFO",
    message: `   Brand response in ${result.durationMs}ms`,
    name: "brand",
  });

  return {
    content: result.content,
    durationMs: result.durationMs,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
  };
}

/**
 * Run the full multi-agent pipeline: Triage → Specialist → Brand Voice.
 * `callLLM` is a function that calls the model (Bedrock or OpenAI) with a
 * system prompt + user message and returns the result.
 */
export async function runMultiAgentPipeline(
  query: string,
  sourcePassages: string[],
  callLLM: CallLLMFn,
  modelName: string,
  sendStatus?: (msg: string) => void,
): Promise<MultiAgentResult> {
  const status = sendStatus ?? (() => {});

  // Step 1: Triage
  status("Classifying query...");
  const triage = await runTriageAgent(query, callLLM, modelName);

  // Step 2: Specialist
  const label = CATEGORY_LABELS[triage.category];
  status(`Consulting ${label} specialist...`);
  const specialist = await runSpecialistAgent(
    triage.category,
    query,
    sourcePassages,
    callLLM,
    modelName,
  );

  // Step 3: Brand Voice
  status("Applying brand voice...");
  const brandVoice = await runBrandVoiceAgent(
    specialist.content,
    query,
    triage.category,
    callLLM,
    modelName,
  );

  const totalInputTokens =
    triage.inputTokens + specialist.inputTokens + brandVoice.inputTokens;
  const totalOutputTokens =
    triage.outputTokens + specialist.outputTokens + brandVoice.outputTokens;

  return {
    finalResponse: brandVoice.content,
    triage,
    specialist,
    brandVoice,
    totalInputTokens,
    totalOutputTokens,
  };
}
