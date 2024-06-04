import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { AWSBedrockAnthropicStream, StreamingTextResponse } from "ai";
import { experimental_buildAnthropicPrompt } from "ai/prompts";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';
export const runtime = 'edge' 
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_DEFAULT_REGION ?? "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

// const bedrockClient = new BedrockRuntimeClient({ region: "us-west-2" });
console.log("bedrockClient",bedrockClient)
export default async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  console.log("req",req.body);

  const messages = await req.body;
  //const { messages } = await req.body;
  console.log(messages);
  // Ask Claude for a streaming chat completion given the prompt
  const bedrockResponse = await bedrockClient.send(
    new InvokeModelWithResponseStreamCommand({
      modelId: "anthropic.claude-instant-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: experimental_buildAnthropicPrompt([{ role: 'user', content: 'what is the weather in nyc?' },]),
        temperature: 0.9,
        max_tokens_to_sample: 500,
        top_p: 1,
      }),
    })
  );

  // Convert the response into a friendly text-stream
  const stream = AWSBedrockAnthropicStream(bedrockResponse);
  console.log("bedrockResponse", bedrockResponse)
  console.log("stream", stream)
  console.log("StreamingTextResponse", new StreamingTextResponse(stream))


    // Respond with the stream
   return new StreamingTextResponse(stream);
//   try {
//     // Respond with the stream
//     res.status(200).json(new StreamingTextResponse(stream));
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
}
