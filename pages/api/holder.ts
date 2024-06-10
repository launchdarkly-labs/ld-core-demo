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
  
  // export const dynamic = "force-dynamic";
  // export const runtime = "edge";
  const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_DEFAULT_REGION ?? "us-west-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
  
  export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    // Extract the `prompt` from the body of the request
  
    const messages = await req.body;
     console.log(messages["messages"])
  
    // Set the model ID, e.g., Command R.
    const modelId = "anthropic.claude-instant-v1";
  
    // Start a conversation with the user message.
    const userMessage = "Describe the purpose of a 'hello world' program in one line.";
    const conversation = [
      {
        role: "user" as ConversationRole,
        content: [{ text: userMessage }],
      },
    ];
    
    const command = new ConverseStreamCommand({
      modelId,
      messages: conversation,
      inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
    });
  
    try {
      // Send the command to the model and wait for the response
      const response = await bedrockClient.send(command);
    
      // Extract and print the streamed response text in real-time.
      for await (const item of response?.stream) {
        console.log("item",item)
        if (item.contentBlockDelta) {
          const responseText = process.stdout.write(item?.contentBlockDelta?.delta?.text);
          console.log(responseText)
          return responseText
          // res.status(200).json(responseText)
         
        }
      }
    } catch (err) {
      console.log(`ERROR: Can't invoke '${modelId}'. Reason: ${err}`);
      process.exit(1);
    }
    
  }
  
  // export default async function POST(req: Request,) {
  //   // Extract the `prompt` from the body of the request
  
  //      const { messages } = await req.json();
  //   // console.log(messages)
  //   // Ask Claude for a streaming chat completion given the prompt
  //   const claudeMessage = [
  //     {
  //       role: "user",
  //       content: "Where is a good vacation place for under $1000? Limit to 100 characters.",
  //     },
  //   ];
  
  //   const claude = new InvokeModelWithResponseStreamCommand({
  //     modelId: "anthropic.claude-instant-v1",
  //     contentType: "application/json",
  //     accept: "application/json",
  //     body: JSON.stringify({
  //       prompt: experimental_buildAnthropicPrompt(messages),
  //       temperature: 0.9,
  //       max_tokens_to_sample: 500,
  //       top_p: 1,
  //     }),
  //   });
  
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
  
  //   const bedrockResponse = await bedrockClient.send(claude);
  //   const stream = AWSBedrockAnthropicStream(bedrockResponse); // Convert the response into a friendly text-stream
  
  //   return new StreamingTextResponse(stream);
  
    // const bedrockResponse = await bedrockClient.send(llama);
    // const stream = AWSBedrockLlama2Stream(bedrockResponse); // Convert the response into a friendly text-stream
    // return new StreamingTextResponse(stream);   // Respond with the stream
  
    // const bedrockResponse = await bedrockClient.send(cohere);
    // const stream = AWSBedrockCohereStream(bedrockResponse); // Convert the response into a friendly text-stream
    // console.log("bedrockResponse", bedrockResponse)
    // console.log("stream",stream)
    // console.log("new StreamingTextResponse(stream)",new StreamingTextResponse(stream))
    // return new StreamingTextResponse(stream);   // Respond with the stream
  
  // }
  