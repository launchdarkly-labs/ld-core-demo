import {
    BedrockRuntimeClient,
    InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { NextApiRequest, NextApiResponse } from 'next';


export default async function bedrockCall(req: NextApiRequest, res: NextApiResponse) {
    const client = new BedrockRuntimeClient({ region: "us-west-2" });
    const prompt = req.body;

    console.log("Here comes your query: " + prompt)

// Debug jurassic another time 
    const input2 = {
        modelId: "ai21.j2-ultra-v1",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({"prompt":`\n${prompt}`,"maxTokens":200,"temperature":0.7,"topP":1,"stopSequences":[],"countPenalty":{"scale":0},"presencePenalty":{"scale":0},"frequencyPenalty":{"scale":0}})
    }
//

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
        // jurassic return structure
        // console.log(jsontext.completions[0].data.text)
        res.status(200).json(jsontext);
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }
}
