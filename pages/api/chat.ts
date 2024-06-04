import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { AWSBedrockAnthropicStream, StreamingTextResponse } from "ai";
import { experimental_buildAnthropicPrompt } from "ai/prompts";
import { NextApiRequest, NextApiResponse } from "next";


const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_DEFAULT_REGION ?? "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

// const bedrockClient = new BedrockRuntimeClient({ region: "us-west-2" });
console.log("bedrockClient",bedrockClient)
export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  // Extract the `prompt` from the body of the request
  ///console.log(req);

//   const {messages} = await req.body.json();
  const { messages } = await req.body;
  console.log(messages);
  // Ask Claude for a streaming chat completion given the prompt
  const bedrockResponse = await bedrockClient.send(
    new InvokeModelWithResponseStreamCommand({
      modelId: "anthropic.claude-instant-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: experimental_buildAnthropicPrompt(messages),
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
  try {
    // Respond with the stream
    res.status(200).json(bedrockResponse);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
