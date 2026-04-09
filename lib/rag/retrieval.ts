import {
	BedrockRuntimeClient,
	InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const EMBED_MODEL_ID = "amazon.titan-embed-text-v2:0";

export type RagSource =
	| "investments"
	| "loans"
	| "accounts"
	| "transfers"
	| "support";

const SOURCES: Record<RagSource, string> = {
	investments: "InvestmentAdvisorRAG",
	loans: "LoansAndCreditRAG",
	accounts: "AccountManagementRAG",
	transfers: "TransferTransactionsRAG",
	support: "CustomerSupportRAG",
};

export interface RagChunk {
	chunk_id: string;
	content_type: string;
	title: string;
	text: string;
	metadata: Record<string, unknown>;
	score: number;
}

function getRegion(): string {
	return process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? "us-east-1";
}

let _bedrockClient: BedrockRuntimeClient | null = null;
function getBedrockClient(): BedrockRuntimeClient {
	if (!_bedrockClient) _bedrockClient = new BedrockRuntimeClient({ region: getRegion() });
	return _bedrockClient;
}

let _dynamoClient: DynamoDBDocumentClient | null = null;
function getDynamoClient(): DynamoDBDocumentClient {
	if (!_dynamoClient) {
		const dynamo = new DynamoDBClient({ region: getRegion() });
		_dynamoClient = DynamoDBDocumentClient.from(dynamo, {
			marshallOptions: { convertClassInstanceToMap: true },
		});
	}
	return _dynamoClient;
}

async function embedText(client: BedrockRuntimeClient, text: string): Promise<number[]> {
	const command = new InvokeModelCommand({
		modelId: EMBED_MODEL_ID,
		body: JSON.stringify({ inputText: text }),
		contentType: "application/json",
		accept: "application/json",
	});
	const response = await client.send(command);
	const result = JSON.parse(Buffer.from(response.body as Uint8Array).toString("utf8"));
	return result.embedding;
}

function cosineSimilarity(a: number[], b: number[]): number {
	let dot = 0, normA = 0, normB = 0;
	for (let i = 0; i < a.length; i++) {
		const ai = Number(a[i]), bi = Number(b[i]);
		dot += ai * bi;
		normA += ai * ai;
		normB += bi * bi;
	}
	if (normA === 0 || normB === 0) return 0;
	return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function scanAllItems(
	client: DynamoDBDocumentClient,
	tableName: string,
	contentType: string | null = null,
): Promise<Record<string, unknown>[]> {
	const items: Record<string, unknown>[] = [];
	let lastKey: Record<string, unknown> | undefined;

	do {
		const params: Record<string, unknown> = {
			TableName: tableName,
			...(contentType && {
				FilterExpression: "content_type = :ct",
				ExpressionAttributeValues: { ":ct": contentType },
			}),
			...(lastKey && { ExclusiveStartKey: lastKey }),
		};
		const response = await client.send(new ScanCommand(params as any));
		items.push(...(response.Items ?? []));
		lastKey = response.LastEvaluatedKey as Record<string, unknown> | undefined;
	} while (lastKey);

	return items;
}

export async function retrieve(
	question: string,
	options: { topK?: number; contentType?: string | null; source?: RagSource } = {},
): Promise<RagChunk[]> {
	const { topK = 5, contentType = null, source = "investments" } = options;
	const tableName = SOURCES[source];
	if (!tableName) {
		throw new Error(`Unknown source "${source}". Valid: ${Object.keys(SOURCES).join(", ")}`);
	}

	const bedrock = getBedrockClient();
	const dynamo = getDynamoClient();

	const queryEmbedding = await embedText(bedrock, question);
	const items = await scanAllItems(dynamo, tableName, contentType);

	const scored: RagChunk[] = items
		.filter((item) => item.embedding)
		.map((item) => ({
			chunk_id: item.chunk_id as string,
			content_type: item.content_type as string,
			title: item.title as string,
			text: item.text as string,
			metadata: (item.metadata as Record<string, unknown>) ?? {},
			score: cosineSimilarity(queryEmbedding, item.embedding as number[]),
		}));

	scored.sort((a, b) => b.score - a.score);
	return scored.slice(0, topK);
}

export const VALID_SOURCES = Object.keys(SOURCES) as RagSource[];
