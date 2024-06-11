import {
    BedrockRuntimeClient,
    InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { NextApiRequest, NextApiResponse } from 'next';


export default async function bedrockCall(req: NextApiRequest, res: NextApiResponse) {
    const client = new BedrockRuntimeClient({ region: "us-west-2" });
    const prompt = req.body;

<<<<<<< HEAD
    
=======
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
>>>>>>> b0c8e53 (latest changes)
    const command = new InvokeModelCommand(input);
    try {
        const response = await client.send(command);
        let decoder = new TextDecoder();
        let jsontext = JSON.parse(decoder.decode(response.body));
        // jurassic return structure

        res.status(200).json(jsontext);
    } catch (error: any) {
      
        throw new Error(error.message);
    }
}
