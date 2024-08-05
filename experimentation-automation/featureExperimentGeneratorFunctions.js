export const generateAIChatBotFeatureExperimentResults = async ({
  client,
  updateContext,
  setProgress,
  setExpGenerator,
}) => {
  setProgress(0);
  setExpGenerator(true);
  for (let i = 0; i < 500; i++) {
    let aiModelVariation = client?.variation(
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
    setProgress((prevProgress) => prevProgress + (1 / 500) * 100);
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
}) => {
  setProgress(0);
  setExpGenerator(true);
  let totalPrice = 0;
  for (let i = 0; i < 500; i++) {
    let cartSuggestedItems = client?.variation("cartSuggestedItems", false);
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
    setProgress((prevProgress) => prevProgress + (1 / 500) * 100);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await updateContext();
  }
  setExpGenerator(false);
};
