import { LDClient } from "launchdarkly-js-client-sdk";
import type { UpdateContextFunction } from "@/utils/typescriptTypesInterfaceMarketplace";

export const generateStoreHeaderFunnelExperimentResults = async ({
  client,
  updateContext,
  setProgress,
  setExpGenerator,
}: {
  client: LDClient | undefined;
  updateContext: UpdateContextFunction;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setExpGenerator: React.Dispatch<React.SetStateAction<boolean>>;
}): Promise<void> => {
  setProgress(0);
  setExpGenerator(true);
  let totalPrice = 0;
  let metric1 = 0;
  let metric2 = 0;
  let metric3 = 0;
  let metric4 = 0;

  for (let i = 0; i < 500; i++) {
    const flagVariation: string = client?.variation("storeAttentionCallout", "New Items");

    if (flagVariation === "Final Hours!") {
      metric1 = 70;
      metric2 = 60;
      metric3 = 60;
      metric4 = 20;
      totalPrice = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
    }
    if (flagVariation === "Sale") {
      metric1 = 70;
      metric2 = 60;
      metric3 = 50;
      metric4 = 25;
      totalPrice = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
    }
    if (flagVariation === "New Items") {
      metric1 = 70;
      metric2 = 50;
      metric3 = 30;
      metric4 = 20;
      totalPrice = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
    }

    let stage1metric = Math.random() * 100;

    if (stage1metric < metric1) {
      client?.track("store-accessed", client.getContext());
      let stage2metric = Math.random() * 100;

      if (stage2metric < metric2) {
        client?.track("item-added", client.getContext());
        let stage3metric = Math.random() * 100;

        if (stage3metric < metric3) {
          client?.track("cart-accessed", client.getContext());
          let stage4metric = Math.random() * 100;

          if (stage4metric < metric4) {
            client?.track("customer-checkout", client.getContext());
            client?.track("in-cart-total-price", client.getContext(), totalPrice);
          }
        }
      }
    }
    await client?.flush();
    setProgress((prevProgress: number) => prevProgress + (1 / 500) * 100);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await updateContext();
  }
  setExpGenerator(false);
};

export const generateShortenCollectionsPageFunnelExperimentResults = async ({
  client,
  updateContext,
  setProgress,
  setExpGenerator,
}: {
  client: LDClient | undefined;
  updateContext: UpdateContextFunction;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setExpGenerator: React.Dispatch<React.SetStateAction<boolean>>;
}): Promise<void> => {
  setProgress(0);
  setExpGenerator(true);
  let totalPrice = 0;
  let metric1 = 0;
  let metric2 = 0;
  let metric3 = 0;

  for (let i = 0; i < 500; i++) {
    const flagVariation: string = client?.variation(
      "release-new-shorten-collections-page",
      "old-long-collections-page"
    );

    if (flagVariation === "old-long-collections-page") {
      metric1 = 50;
      metric2 = 40;
      metric3 = 20;
      totalPrice = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
    }
    if (flagVariation === "new-shorten-collections-page") {
      metric1 = 70;
      metric2 = 60;
      metric3 = 30;
      totalPrice = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
    }

    let stage1metric = Math.random() * 100;

    if (stage1metric < metric1) {
      client?.track("item-added", client.getContext());
      let stage2metric = Math.random() * 100;

      if (stage2metric < metric2) {
        client?.track("cart-accessed", client.getContext());
        let stage3metric = Math.random() * 100;

        if (stage3metric < metric3) {
          client?.track("customer-checkout", client.getContext());
          client?.track("in-cart-total-price", client.getContext(), totalPrice);
        }
      }
    }
    await client?.flush();
    setProgress((prevProgress: number) => prevProgress + (1 / 500) * 100);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await updateContext();
  }
  setExpGenerator(false);
};
