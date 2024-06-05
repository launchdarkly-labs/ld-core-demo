import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  AWSBedrockAnthropicStream,
  StreamingTextResponse,
  AWSBedrockLlama2Stream,
  AWSBedrockCohereStream,
  AWSBedrockStream,
} from "ai";
import { experimental_buildAnthropicPrompt, experimental_buildLlama2Prompt } from "ai/prompts";
import { NextApiRequest, NextApiResponse } from "next";
// export const dynamic = 'force-dynamic';
export const runtime = "edge";
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_DEFAULT_REGION ?? "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

// const bedrockClient = new BedrockRuntimeClient({ region: "us-west-2" });
export default async function POST(req: Request) {
  // Extract the `prompt` from the body of the request

     const { messages } = await req.json();
  // console.log(messages)
  // Ask Claude for a streaming chat completion given the prompt
  const claudeMessage = [
    {
      role: "user",
      content: "Where is a good vacation place for under $1000? Limit to 100 characters.",
    },
  ];

  const claude = new InvokeModelWithResponseStreamCommand({
    modelId: "anthropic.claude-instant-v1",
    //modelId: "amazon.titan-text-express-v1",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: experimental_buildAnthropicPrompt(messages),
      temperature: 0.9,
      max_tokens_to_sample: 500,
      top_p: 1,
    }),
  });

  const llamaMessage = [
    {
      role: "user",
      content: "Where is a good vacation place for under $1000? Limit to 100 characters.",
    },
  ];

  const llama = new InvokeModelWithResponseStreamCommand({
    modelId: "meta.llama2-13b-chat-v1",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: experimental_buildLlama2Prompt(messages),
      temperature: 0.9,
      max_gen_len: 500,
      top_p: 1,
    }),
  });


  

  // const bedrockResponse = await bedrockClient.send(claude);
  // const stream = AWSBedrockAnthropicStream(bedrockResponse); // Convert the response into a friendly text-stream
  // console.log("bedrockResponse", bedrockResponse)
  // console.log("stream",stream)
  // return new StreamingTextResponse(stream);   // Respond with the stream

  const bedrockResponse = await bedrockClient.send(llama);
  const stream = AWSBedrockLlama2Stream(bedrockResponse); // Convert the response into a friendly text-stream
  console.log("bedrockResponse", bedrockResponse)
  console.log("stream",stream)
  return new StreamingTextResponse(stream);   // Respond with the stream


}
