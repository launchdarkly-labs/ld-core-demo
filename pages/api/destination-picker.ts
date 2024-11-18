import {
    BedrockRuntimeClient,
    ConverseCommand,
    ConversationRole,
} from "@aws-sdk/client-bedrock-runtime";
import { NextApiRequest, NextApiResponse } from 'next';
import { ldClient } from "@/utils/ld-server/serverClient";
import { getCookie } from "cookies-next";
import getServerClient from "@/utils/ld-server/serverClient";


export default async function bedrockCall(req: NextApiRequest, res: NextApiResponse) {
    const client = new BedrockRuntimeClient({region: 'us-west-2', credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
    } });
    const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
    const prompt = req.body
    const context: any = getCookie("ld-context") || { "kind": "user", "name": "anonymous", "key": "abc-123" };

    // const model = await ldClient.variation("destination-picker-ai-model", context, {
    //     "anthropic_version": "bedrock-2023-05-31",
    //     "max_tokens": 200,
    //     "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
    //     "name": "claude-haiku"
    // })

    const model2 = await ldClient.variation("destination-picker-new-ai-model", context, {
        prompt: [{ content: "", role: "system" }],
        model: {
          modelId: "cohere.command-text-v14",
          temperature: 0.5,
          max_tokens: 200,
        },
      })

const messages = [
    {
        role: "user" as ConversationRole,
        content: [
            {
                text: prompt
            }
        ]
    }
    ]

    const command = new ConverseCommand({
        modelId: model2?.model?.modelId, 
        messages: messages,
        inferenceConfig: {
                maxTokens: model2?.model?.maxTokens,
                temperature: model2?.model?.temperature || 0.5
            }});
    try {
        const response = await client.send(command);
        const responseText = response?.output?.message?.content?.[0]?.text || ""
        console.log(responseText)
        return res.status(200).json(responseText)

    } catch (error: any) {

        throw new Error(error.message);
    }
}
