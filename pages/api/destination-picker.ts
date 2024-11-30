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

    const ai_config_version = await ldClient.variation("ai-config--destination-picker-new-ai-model", context, {
        messages: [
            {
                content: "give me three recommendations of places to travel based on popular travel destinations, consider best air fare prices and places tourists / travelers are visiting currently and any unique characteristics that would appeal to the average traveler. Try to be creative and choose different spots that you don't think the users would pick. Return the results in markdown with the destination name sized ##, the subsequent reason for why they should go there listed below it, and finally add a line break before the next destination. I only want the destinations and a singe reason, do not add extra copy and do not alter the markdown instructions, I want it formatted the same way every time. ",
                role: "system"
            }
        ],
        model: {
            parameters: {
                temperature: 0.7
            },
            id: "cohere.command-text-v14"
        },
        _ldMeta: {
            versionKey: "aedbe7e5-d275-40d7-93e6-d18862145713",
            enabled: true
        }
    })    

    const messages = [
        {
            role: "user" as ConversationRole,
            content: [
                {
                    text: ai_config_version?.messages[0].content || ""
                }
            ]
        }
    ]

    const command = new ConverseCommand({
        modelId: ai_config_version?.model?.id, 
        messages: messages,
        inferenceConfig: {
                maxTokens: ai_config_version?.model?.parameters?.maxTokens || 100,
                temperature: ai_config_version?.model?.parameters?.temperature || 0.5
            }});
    try {
        const response = await client.send(command);
        const responseText = response?.output?.message?.content?.[0]?.text || ""
        return res.status(200).json(responseText)

    } catch (error: any) {

        throw new Error(error.message);
    }
}
