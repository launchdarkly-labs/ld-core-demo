import { LDClient } from "launchdarkly-js-client-sdk";
import type { UpdateContextFunction } from "@/utils/typescriptTypesInterfaceIndustry";
import { META, COHERE, ANTHROPIC } from "@/utils/constants";
import { wait } from "@/utils/utils";

const waitTime = .5;

const probablityExperimentTypeAI = {
  ["bayesian"]: { [META]: 30, [ANTHROPIC]: 50, [COHERE]: 80 },
  ["frequentist"]: { [META]: 47, [ANTHROPIC]: 50, [COHERE]: 58 },
};

const probablityExperimentType = {
  ["bayesian"]: { ["trueProbablity"]: 60, ["falseProbablity"]: 30 },
  ["frequentist"]: { ["trueProbablity"]: 60, ["falseProbablity"]: 52 },
};

export const generateAIChatBotFeatureExperimentResults = async ({
  client,
  updateContext,
  setProgress,
  setExpGenerator,
  experimentTypeObj,
}: {
  client: LDClient | undefined;
  updateContext: UpdateContextFunction;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setExpGenerator: React.Dispatch<React.SetStateAction<boolean>>;
  experimentTypeObj: { experimentType: string; numOfRuns: number };
}): Promise<void> => {
  setProgress(0);

  const experimentType: string = experimentTypeObj.experimentType;
  for (let i = 0; i < experimentTypeObj.numOfRuns; i++) {
    const aiModelVariation: {
      max_tokens_to_sample: number;
      modelId: string;
      temperature: number;
      top_p: number;
    } = client?.variation(
      "ai-chatbot",
      '{ "max_tokens_to_sample": 500, "modelId": "anthropic.claude-instant-v1", "temperature": 0.3, "top_p": 1 }'
    );

    if (aiModelVariation.modelId.includes(META)) {
      let probablity = Math.random() * 100;
      if (
        probablity <
        probablityExperimentTypeAI[experimentType as keyof typeof probablityExperimentTypeAI][META]
      ) {
        client?.track("AI chatbot good service", client.getContext());
      } else {
        client?.track("AI Chatbot Bad Service", client.getContext());
      }
    } else if (aiModelVariation.modelId.includes(ANTHROPIC)) {
      let probablity = Math.random() * 100;
      if (
        probablity <
        probablityExperimentTypeAI[experimentType as keyof typeof probablityExperimentTypeAI][ANTHROPIC]
      ) {
        client?.track("AI chatbot good service", client.getContext());
      } else {
        client?.track("AI Chatbot Bad Service", client.getContext());
      }
    } else {
      //cohere
      let probablity = Math.random() * 100;
      if (
        probablity <
        probablityExperimentTypeAI[experimentType as keyof typeof probablityExperimentTypeAI][COHERE]
      ) {
        client?.track("AI chatbot good service", client.getContext());
      } else {
        client?.track("AI Chatbot Bad Service", client.getContext());
      }
    }
    await client?.flush();
    setProgress((prevProgress: number) => prevProgress + (1 / experimentTypeObj.numOfRuns) * 100);
    await wait(waitTime);
    await updateContext();
  }
  setExpGenerator(false);
};

export const generateSuggestedItemsFeatureExperimentResults = async ({
  client,
  updateContext,
  setProgress,
  setExpGenerator,
  experimentTypeObj,
}: {
  client: LDClient | undefined;
  updateContext: UpdateContextFunction;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setExpGenerator: React.Dispatch<React.SetStateAction<boolean>>;
  experimentTypeObj: { experimentType: string; numOfRuns: number };
}): Promise<void> => {
  setProgress(0);
  let totalPrice = 0;

  const experimentType: string = experimentTypeObj.experimentType;

  for (let i = 0; i < experimentTypeObj.numOfRuns; i++) {
    const cartSuggestedItems: boolean = client?.variation("cartSuggestedItems", false);
    if (cartSuggestedItems) {
      totalPrice = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
      let probablity = Math.random() * 100;
      if (
        probablity <
        probablityExperimentType[experimentType as keyof typeof probablityExperimentType][
          "trueProbablity"
        ]
      ) {
        client?.track("upsell-tracking", client.getContext());
      }
      client?.track("in-cart-total-price", client.getContext(), totalPrice);
    } else {
      totalPrice = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
      let probablity = Math.random() * 100;
      if (
        probablity <
        probablityExperimentType[experimentType as keyof typeof probablityExperimentType][
          "falseProbablity"
        ]
      ) {
        client?.track("upsell-tracking", client.getContext());
      }
      client?.track("in-cart-total-price", client.getContext(), totalPrice);
    }
    await client?.flush();
    setProgress((prevProgress: number) => prevProgress + (1 / experimentTypeObj.numOfRuns) * 100);
    await wait(waitTime)
    await updateContext();
  }
  setExpGenerator(false);
};

export const generateNewSearchEngineFeatureExperimentResults = async ({
  client,
  updateContext,
  setProgress,
  setExpGenerator,
  experimentTypeObj,
}: {
  client: LDClient | undefined;
  updateContext: UpdateContextFunction;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setExpGenerator: React.Dispatch<React.SetStateAction<boolean>>;
  experimentTypeObj: { experimentType: string; numOfRuns: number };
}): Promise<void> => {
  setProgress(0);
  let totalPrice = 0;

  const experimentType: string = experimentTypeObj.experimentType;

  for (let i = 0; i < experimentTypeObj.numOfRuns; i++) {
    const newSearchEngineFeatureFlag: string = client?.variation(
      "release-new-search-engine",
      "old-search-engine"
    );
    if (newSearchEngineFeatureFlag?.includes("new-search-engine")) {
      totalPrice = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
      let probablity = Math.random() * 100;
      if (probablity < probablityExperimentType[experimentType as keyof typeof probablityExperimentType][
        "trueProbablity"
      ]) {
        client?.track("search-engine-add-to-cart", client.getContext());
      }
      client?.track("in-cart-total-price", client.getContext(), totalPrice);
    } else {
      totalPrice = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
      let probablity = Math.random() * 100;
      if (probablity < probablityExperimentType[experimentType as keyof typeof probablityExperimentType][
        "falseProbablity"
      ]) {
        client?.track("search-engine-add-to-cart", client.getContext());
      }
      client?.track("in-cart-total-price", client.getContext(), totalPrice);
    }
    await client?.flush();
    setProgress((prevProgress: number) => prevProgress + (1 / experimentTypeObj.numOfRuns) * 100);
    await wait(waitTime)
    await updateContext();
  }
  setExpGenerator(false);
};
