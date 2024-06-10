import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
  InvokeModelCommand,
  ConverseStreamCommand,
  ConverseCommand,
  ConversationRole,
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
import { NextResponse } from "next/server";
import { getServerClient } from "@/utils/ld-server";
import * as ld from "launchdarkly-js-client-sdk";
import { wait } from "@/utils/utils";

// export const dynamic = "force-dynamic";
// export const runtime = "edge";

export default async function something(req: NextApiRequest, res: NextApiResponse) {
  const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_DEFAULT_REGION ?? "us-west-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
  const { messages } = await req.body;
  console.log("awefawefmessages", messages);
  // Ask Claude for a streaming chat completion given the prompt
  const claudeMessage = [
    {
      role: "user",
      content: "Where is a good vacation place for under $1000? Limit to 100 characters.",
    },
  ];
  let claude, jsontext;
  wait(10)
  claude = new InvokeModelCommand({
    modelId: "anthropic.claude-instant-v1",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: experimental_buildAnthropicPrompt(messages),
      temperature: 0.9,
      max_tokens_to_sample: 500,
      top_p: 1,
    }),
  });

  //const stream = AWSBedrockAnthropicStream(bedrockResponse); // Convert the response into a friendly text-stream
  //return new StreamingTextResponse(stream);

  try {
 ;
    const bedrockResponse = await bedrockClient.send(claude);
    const decoder = new TextDecoder();
    jsontext = JSON.parse(decoder.decode(bedrockResponse.body));

    res.status(200).json(jsontext);
  } catch (error: any) {
    throw new Error(error.message);
  }

  // const llamaMessage = [
  //   {
  //     role: "user",
  //     content: "Where is a good vacation place for under $1000? Limit to 100 characters.",
  //   },
  // ];

  // const llama = new InvokeModelWithResponseStreamCommand({
  //   modelId: "meta.llama2-13b-chat-v1",
  //   contentType: "application/json",
  //   accept: "application/json",
  //   body: JSON.stringify({
  //     prompt: experimental_buildLlama2Prompt(llamaMessage),
  //     temperature: 0.9,
  //     max_gen_len: 500,
  //     top_p: 1,
  //   }),
  // });

  // const bedrockResponse = await bedrockClient.send(llama);
  // const stream = AWSBedrockLlama2Stream(bedrockResponse); // Convert the response into a friendly text-stream
  // return new StreamingTextResponse(stream);   // Respond with the stream

  // const cohereMessage = [
  //   {
  //     role: "user",
  //     content: "Where is a good vacation place for under $1000? Limit to 100 characters.",
  //   },
  // ];

  // const cohere = new InvokeModelWithResponseStreamCommand({
  //   modelId: "cohere.command-text-v14",
  //   contentType: "application/json",
  //   accept: "application/json",
  //   body: JSON.stringify({
  //     prompt: experimental_buildLlama2Prompt(cohereMessage),
  //     temperature: 0.9,
  //     max_tokens: 500,
  //     p: 1,
  //   }),
  // });

  // const bedrockResponse = await bedrockClient.send(cohere);
  // const stream = AWSBedrockCohereStream(bedrockResponse); // Convert the response into a friendly text-stream
  // console.log("bedrockResponse", bedrockResponse)
  // console.log("stream",stream)
  // console.log("new StreamingTextResponse(stream)",new StreamingTextResponse(stream))
  // return new StreamingTextResponse(stream);   // Respond with the stream
}
