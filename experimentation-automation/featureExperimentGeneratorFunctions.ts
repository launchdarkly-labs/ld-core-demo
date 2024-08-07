import { LDClient } from "launchdarkly-js-client-sdk";
import type { UpdateContextFunction } from "@/experimentation-automation/typescriptTypesInterface";

export const generateAIChatBotFeatureExperimentResults = async ({
  client,
  updateContext,
  setProgress,
  setExpGenerator,
}: {
  client: LDClient;
  updateContext: UpdateContextFunction;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setExpGenerator: React.Dispatch<React.SetStateAction<boolean>>;
}): Promise<void> => {
  setProgress(0);
  setExpGenerator(true);
  for (let i = 0; i < 500; i++) {
    const aiModelVariation: {
      max_tokens_to_sample: number;
      modelId: string;
      temperature: number;
      top_p: number;
    } = client?.variation(
      "ai-chatbot",
      '{ "max_tokens_to_sample": 500, "modelId": "anthropic.claude-instant-v1", "temperature": 0.3, "top_p": 1 }'
    );

    if (aiModelVariation.modelId === "meta.llama2-13b-chat-v1") {
      let probablity = Math.random() * 100;
      if (probablity < 40) {
        client?.track("AI chatbot good service", client.getContext());
      } else {
        client?.track("AI Chatbot Bad Service", client.getContext());
      }
    } else if (aiModelVariation.modelId === "anthropic.claude-instant-v1") {
      let probablity = Math.random() * 100;
      if (probablity < 70) {
        client?.track("AI chatbot good service", client.getContext());
      } else {
        client?.track("AI Chatbot Bad Service", client.getContext());
      }
    } else {
      let probablity = Math.random() * 100;
      if (probablity < 60) {
        client?.track("AI chatbot good service", client.getContext());
      } else {
        client?.track("AI Chatbot Bad Service", client.getContext());
      }
    }
    await client?.flush();
    setProgress((prevProgress: number) => prevProgress + (1 / 500) * 100);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await updateContext();
  }
  setExpGenerator(false);
};

export const generateSuggestedItemsFeatureExperimentResults = async ({
  client,
  updateContext,
  setProgress,
  setExpGenerator,
}: {
  client: LDClient;
  updateContext: UpdateContextFunction;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setExpGenerator: React.Dispatch<React.SetStateAction<boolean>>;
}): Promise<void> => {
  setProgress(0);
  setExpGenerator(true);
  let totalPrice = 0;
  for (let i = 0; i < 500; i++) {
    const cartSuggestedItems: boolean = client?.variation("cartSuggestedItems", false);
    if (cartSuggestedItems) {
      totalPrice = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
      let probablity = Math.random() * 100;
      if (probablity < 60) {
        client?.track("upsell-tracking", client.getContext());
      }
      client?.track("in-cart-total-price", client.getContext(), totalPrice);
    } else {
      totalPrice = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
      let probablity = Math.random() * 100;
      if (probablity < 40) {
        client?.track("upsell-tracking", client.getContext());
      }
      client?.track("in-cart-total-price", client.getContext(), totalPrice);
    }
    await client?.flush();
    setProgress((prevProgress: number) => prevProgress + (1 / 500) * 100);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await updateContext();
  }
  setExpGenerator(false);
};

export const generateNewSearchEngineFeatureExperimentResults = async ({
  client,
  updateContext,
  setProgress,
  setExpGenerator,
}: {
  client: LDClient;
  updateContext: UpdateContextFunction;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setExpGenerator: React.Dispatch<React.SetStateAction<boolean>>;
}): Promise<void> => {
  setProgress(0);
  setExpGenerator(true);
  let totalPrice = 0;
  for (let i = 0; i < 500; i++) {
    const newSearchEngineFeatureFlag: string = client?.variation(
      "release-new-search-engine",
      "old-search-engine"
    );
    if (newSearchEngineFeatureFlag?.includes("new-search-engine")) {
      totalPrice = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
      let probablity = Math.random() * 100;
      if (probablity < 60) {
        client?.track("search-engine-add-to-cart", client.getContext());
      }
      client?.track("in-cart-total-price", client.getContext(), totalPrice);
    } else {
      totalPrice = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
      let probablity = Math.random() * 100;
      if (probablity < 40) {
        client?.track("search-engine-add-to-cart", client.getContext());
      }
      client?.track("in-cart-total-price", client.getContext(), totalPrice);
    }
    await client?.flush();
    setProgress((prevProgress: number) => prevProgress + (1 / 500) * 100);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await updateContext();
  }
  setExpGenerator(false);
};
