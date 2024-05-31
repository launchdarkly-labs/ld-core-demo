import {
    BedrockRuntimeClient,
    InvokeModelCommand,
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

    const model = await ldClient.variation("destination-picker-ai-model", context, {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 200,
        "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
        "name": "claude-haiku"
    })
    let input = {
        modelId: "",
        contentType: "",
        accept: "",
        body: "",
    }
    // Add models here
    if (model?.name === 'claude-haiku') {
    input = {
        modelId: model?.modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            anthropic_version: model?.anthropic_version,
            max_tokens: model?.max_tokens,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt,
                        },
                    ],
                },
            ],
        }),
    }
}
if (model?.name === "cohere-text") {
    console.log(model?.output)
    input = {
        modelId: model?.modelId,
        contentType: "application/json",
        accept: "*/*",
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: model?.max_tokens,
            temperature: model?.temperature,
            p: 0.01,
            k: 0,
            stop_sequences: [],
            return_likelihoods: "NONE",
        }),
    };
}
    //

    const command = new InvokeModelCommand(input);
    try {
        const response = await client.send(command);
        
        let decoder = new TextDecoder();
        let jsontext = await JSON.parse(decoder.decode(response.body));
        console.log(jsontext[model?.output][0].text)
        res.status(200).json(jsontext[model?.output][0].text);
    } catch (error: any) {

        throw new Error(error.message);
    }
}
