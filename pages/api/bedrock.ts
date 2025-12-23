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
    const prompt = req.body;

    const input = {
        modelId: "anthropic.claude-instant-v1",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            prompt: `\n\nHuman:${prompt}\n\nAssistant:`,
            max_tokens_to_sample: 500,
            temperature: 0.9,
            top_p: 1,
        }),
    };
    
    const command = new InvokeModelCommand(input);
    try {
        const response = await client.send(command);
        let decoder = new TextDecoder();
        let jsontext = JSON.parse(decoder.decode(response.body));
        res.status(200).json(jsontext);
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
