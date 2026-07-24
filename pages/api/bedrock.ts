import {
    BedrockRuntimeClient,
    InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { NextApiRequest, NextApiResponse } from 'next';
import { recordErrorToLD } from "@/utils/observability/server";


export default async function bedrockCall(req: NextApiRequest, res: NextApiResponse) {
    const client = new BedrockRuntimeClient({ 
        region: process.env.AWS_REGION || "us-east-1",
        // Credentials automatically provided by EKS Pod Identity
    });

    // Body arrives either as a raw JSON string (no Content-Type) or a parsed
    // object (Content-Type: application/json). Handle both, then extract the
    // caller's prompt string.
    const parsedBody = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const prompt: string =
        typeof parsedBody === "string" ? parsedBody : parsedBody?.prompt ?? "";

    // Claude Instant (old completion API) was retired from Bedrock. Haiku 4.5
    // uses the Anthropic Messages API instead. Response shape changes from
    // { completion: "..." } to { content: [{ text: "..." }] }, so we adapt the
    // response back to { completion } to keep frontend callers unchanged.
    const input = {
        modelId: "anthropic.claude-haiku-4-5-20251001-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 500,
            temperature: 0.9,
            top_p: 1,
            messages: [{ role: "user", content: prompt }],
        }),
    };
    
    const command = new InvokeModelCommand(input);
    try {
        const response = await client.send(command);
        let decoder = new TextDecoder();
        let jsontext = JSON.parse(decoder.decode(response.body));
        const completion = jsontext?.content?.[0]?.text ?? "";
        res.status(200).json({ ...jsontext, completion });
    } catch (error: any) {
        const errorObj = error instanceof Error ? error : new Error(error?.message || "Unknown error");
        await recordErrorToLD(
            errorObj,
            "Failed to invoke Bedrock model",
            {
                component: "BedrockAPI",
                endpoint: "/api/bedrock",
                modelId: input.modelId || "unknown",
            }
        );
        throw new Error(error.message);
    }
}
