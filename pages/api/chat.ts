import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

import { NextApiRequest, NextApiResponse } from "next";
import { getServerClient } from "@/utils/ld-server";
import { getCookie } from "cookies-next";

import { LD_CONTEXT_COOKIE_KEY } from "@/utils/constants";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_AI_MODEL } from "@/utils/constants";

//https://sdk.vercel.ai/providers/legacy-providers/aws-bedrock
export default async function chatResponse(req: NextApiRequest, res: NextApiResponse) {
  const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_DEFAULT_REGION ?? "us-west-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
  const messages = req.body;
  const clientSideContext = JSON.parse(getCookie(LD_CONTEXT_COOKIE_KEY, { res, req }) || "{}");
  const extractedClientSideAudienceKey = clientSideContext?.audience?.key;

  const clientSideAudienceContext = {
    kind: "audience",
    key: extractedClientSideAudienceKey,
  };

  const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");

  const context: any = clientSideAudienceContext || {
    kind: "audience",
    key: uuidv4().slice(0, 6),
  };

  const model2 = await ldClient.variation("ai-new-model-chatbot", context, DEFAULT_AI_MODEL);


  // const model = await ldClient.variation("ai-chatbot", context, {
  //   modelId: "cohere.command-text-v14",
  //   temperature: 0.4,
  //   max_tokens: 400,
  //   p: 1,
  // });

  // const objWithoutModelId = Object.keys(model)
  //   .filter((objKey) => objKey !== "modelId")
  //   .reduce((newObj: any, key) => {
  //     newObj[key] = model[key];
  //     return newObj;
  //   }, {});
    

    const objWithoutModelId2 = Object.keys(model2?.model)
    .filter((objKey) => objKey !== "modelId")
    .reduce((newObj: any, key) => {
      
      if(key === "maxTokens" && model2?.model.modelId.includes("cohere")){
        newObj["max_tokens"] = model2.model[key];
      }

      if(key === "maxTokens" && model2?.model.modelId.includes("anthropic")){
        newObj["max_tokens_to_sample"] = model2.model[key];
      }

      if(key === "maxTokens" && model2?.model.modelId.includes("meta")){
        newObj["max_gen_len"] = model2.model[key];
      } 
      if(key !== "maxTokens"){
        newObj[key] = model2.model[key];
      }
      return newObj;
    }, {});


  const chatBotModelInput = new InvokeModelCommand({
    modelId: model2.model.modelId,
    // modelId: model.modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: `\n\nHuman:${messages}\n\nAssistant:`,
      ...objWithoutModelId2,
    }),
  });
 
  try {
    const bedrockResponse = await bedrockClient.send(chatBotModelInput);
    const decoder = new TextDecoder();
    const jsontext = JSON.parse(decoder.decode(bedrockResponse.body));
    res.status(200).json(jsontext);
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
    throw new Error(error.message);
  }
}
