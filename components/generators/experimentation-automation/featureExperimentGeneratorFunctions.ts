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

const probablityExperimentTypeSearchEngine = {
	["bayesian"]: { ["trueProbablity"]: 30, ["falseProbablity"]: 60 },
	["frequentist"]: { ["trueProbablity"]: 52, ["falseProbablity"]: 60 },
};

export const generateAIChatBotFeatureExperimentResults = async ({
	client,
	updateContext,
	setProgress,
	setExpGenerator,
	experimentTypeObj,
}: {
	client: any;
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
			"ai-config--togglebot",
			`{
				"model": {
					"name": "cohere.command-text-v14",
					"parameters": {
						"maxTokens": 200,
						"temperature": 0.5
					}
				},
				"_ldMeta": {
					"versionKey": "cohere-coral",
					"enabled": true,
					"variationKey": "cohere-coral",
					"version": 1
				},
				"messages": [
					{
						"content": "As an AI bot for a banking site ToggleBank, your purpose is to answer questions related to banking services and financial products. Act as a customer representative. Only answer queries related to banking and finance. Remove quotation in response. Limit response to 20 words. Do not exceed this limit and do not specify any limits in responses. Here is the user prompt",
						"role": "system"
					}
				]
			}`
		);
			if(aiModelVariation._ldMeta.enabled){
				if (aiModelVariation.model.name.includes(ANTHROPIC)) {
					let probablity = Math.random() * 100;
					if (
						probablity <
						probablityExperimentTypeAI[experimentType as keyof typeof probablityExperimentTypeAI][ANTHROPIC]
					) {
						await client?.track("AI chatbot good service");
            await client?.flush();
					} else {
						await client?.track("AI Chatbot Bad Service");
            await client?.flush();
					}
				} else {
					//cohere
					let probablity = Math.random() * 100;
					if (
						probablity <
						probablityExperimentTypeAI[experimentType as keyof typeof probablityExperimentTypeAI][COHERE]
					) {
						await client?.track("AI chatbot good service");
            await client?.flush();
					} else {
						await client?.track("AI Chatbot Bad Service");
            await client?.flush();
					}
				}
				await client?.flush();
				setProgress((prevProgress: number) => prevProgress + (1 / experimentTypeObj.numOfRuns) * 100);
				await wait(waitTime);
				await updateContext();
			}
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
	client: any;
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
		if (cartSuggestedItems) { //winner
			totalPrice = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
			let probablity = Math.random() * 100;
			if (
				probablity <
				probablityExperimentType[experimentType as keyof typeof probablityExperimentType][
					"trueProbablity"
				]
			) {
				await client?.track("upsell-tracking");
        await client?.flush();
			}
			await client?.track("in-cart-total-price", undefined, totalPrice);
      await client?.flush();
		} else {
			totalPrice = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
			let probablity = Math.random() * 100;
			if (
				probablity <
				probablityExperimentType[experimentType as keyof typeof probablityExperimentType][
					"falseProbablity"
				]
			) {
				await client?.track("upsell-tracking");
        await client?.flush();
			}
			await client?.track("in-cart-total-price", undefined, totalPrice);
      await client?.flush();
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
	client: any;
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
			false,
		);
		if (newSearchEngineFeatureFlag?.includes("new-search-engine")) {
			totalPrice = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
			let probablity = Math.random() * 100;
			if (probablity < probablityExperimentTypeSearchEngine[experimentType as keyof typeof probablityExperimentTypeSearchEngine][
				"trueProbablity"
			]) {
				await client?.track("search-engine-add-to-cart");
        await client?.flush();
			}
			await client?.track("in-cart-total-price", undefined, totalPrice);
      await client?.flush();
		} else { //winner is old search engine
			totalPrice = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
			let probablity = Math.random() * 100;
			if (probablity < probablityExperimentTypeSearchEngine[experimentType as keyof typeof probablityExperimentTypeSearchEngine][
				"falseProbablity"
			]) {
				await client?.track("search-engine-add-to-cart");
        await client?.flush();
			}
			await client?.track("in-cart-total-price", undefined, totalPrice);
      await client?.flush();
		}
		setProgress((prevProgress: number) => prevProgress + (1 / experimentTypeObj.numOfRuns) * 100);
		await wait(waitTime)
		await updateContext();
	}
	setExpGenerator(false);
};
