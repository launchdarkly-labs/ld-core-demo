import {
  BedrockRuntimeClient,
  ConverseCommand,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerClient } from "@/utils/ld-server";
import { getCookie } from "cookies-next";
import { initAi } from "@launchdarkly/server-sdk-ai";
import { LD_CONTEXT_COOKIE_KEY } from "@/utils/constants";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_AI_MODEL } from "@/utils/constants";

export default async function chatResponse(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const bedrockClient = new BedrockRuntimeClient({
      region: process.env.AWS_DEFAULT_REGION ?? "us-west-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
      },
    });

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("AWS credentials are not set");
    }
    const body = JSON.parse(req.body);
    const aiConfigKey = body?.aiConfigKey;
    const userInput = body?.userInput;
    const clientSideContext = JSON.parse(
      getCookie(LD_CONTEXT_COOKIE_KEY, { res, req }) || "{}"
    );
    const extractedClientSideAudienceKey = clientSideContext?.audience?.key;

    const clientSideAudienceContext = {
      kind: "audience",
      key: extractedClientSideAudienceKey,
    };

    function mapPromptToConversation(
      prompt: { role: 'user' | 'assistant' | 'system'; content: string }[],
    ): Message[] {
      return prompt.map((item) => ({
        // Bedrock doesn't support systems in the converse command.
        role: item.role !== 'system' ? item.role : 'user',
        content: [{ text: item.content.replace('${userInput}', userInput) }],
      }));
    }    

    const ldClient = await getServerClient(process.env.LD_SDK_KEY || "");
    const aiClient = initAi(ldClient);
    const context: any = clientSideAudienceContext || {
      kind: "audience",
      key: uuidv4().slice(0, 6),
    };

    const aiConfig = await aiClient.config(aiConfigKey!, context, {}, {});
    if (!aiConfig.enabled) {
      throw new Error("AI config is disabled");
    } else {
      const parameters = aiConfig.model?.parameters || {};
      const objWithoutModelId2 = Object.keys(parameters).reduce(
        (newObj: any, key) => {
          if (
            key === "maxTokens" &&
            aiConfig.model &&
            aiConfig.model?.parameters &&
            aiConfig?.model.name.includes("cohere")
          ) {
            newObj["max_tokens"] = aiConfig.model.parameters[key];
          }
          if (
            key === "maxTokens" &&
            aiConfig.model &&
            aiConfig.model?.parameters && 
            aiConfig?.model.name.includes("anthropic")
          ) {
            newObj["max_tokens_to_sample"] =
              aiConfig.model.parameters[key];
          }
          if (key !== "maxTokens" &&
            aiConfig.model
          ) {
            newObj[key] = (aiConfig.model as any)[key];
          }
          return newObj;
        },
        {}
      );

      if (!aiConfig.model) {
        throw new Error("AI model configuration is undefined");
      }
      
      if (!aiConfig.messages || aiConfig.messages.length === 0) {
        throw new Error("AI config messages are undefined or empty");
      }

      const { tracker } = aiConfig;

      try {
        const completion = tracker.trackBedrockConverseMetrics( 
          await bedrockClient.send(
            new ConverseCommand({
              modelId: aiConfig.model.name,
              messages: mapPromptToConversation(aiConfig.messages ?? []),
              inferenceConfig: {
                temperature: (aiConfig.model?.parameters?.temperature as number) ?? 0.5,
                maxTokens: (aiConfig.model?.parameters?.maxTokens as number) ?? 200,
              },
            })
          )
        );
        const response = completion.output?.message?.content?.[0]?.text ?? 'no-response';
        const data = {
          response: response,
          modelName: aiConfig?.model?.name,
          enabled: aiConfig.enabled,
        };
        res.status(200).json(data);
      } catch (error: any) {
        console.error("Error sending request to Bedrock:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  } catch (error: any) {
    console.error("Error in chatResponse:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}