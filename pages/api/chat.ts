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

import { wait } from "@/utils/utils";
// import { ldClient } from "@/utils/ld-server/serverClient";
import { getCookie } from "cookies-next";
// export const dynamic = "force-dynamic";
// export const runtime = "edge";

export default async function chatResponse(req: NextApiRequest, res: NextApiResponse) {
  const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_DEFAULT_REGION ?? "us-west-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
  const messages =  req.body;
  console.log("awefawefmessages", messages);
  const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
  
  const context: any = getCookie("ld-context") || { "kind": "user", "name": "anonymous", "key": "abc-123" };

  const model = await ldClient.variation("ai-chatbot", context, {
    modelId: 'anthropic.claude-instant-v1',
    temperature: 0.9,
    top_k: 250,
    top_p: 1,
    max_tokens_to_sample: 500
  })

  // Ask Claude for a streaming chat completion given the prompt
  const claudeMessage = [
    {
      role: "user",
      content: "Where is a good vacation place for under $1000? Limit to 100 characters.",
    },
  ];
  
  const chatBotModelInput = new InvokeModelCommand({
    modelId: model.modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: `\n\nHuman:${messages}\n\nAssistant:`,
      temperature: model.temperature,
      max_tokens_to_sample: model?.max_tokens_to_sample,
      max_gen_len: model?.max_gen_len,
      top_p: model.top_p,
    }),
  });



  try {
    const bedrockResponse = await bedrockClient.send(chatBotModelInput);
    const decoder = new TextDecoder();
    const jsontext = JSON.parse(decoder.decode(bedrockResponse.body));

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
