import type { UpdateContextFunction } from "@/utils/typescriptTypesInterfaceIndustry";
import { wait } from "@/utils/utils";
import {
  SIGN_UP_STARTED,
  INITIAL_SIGN_UP_COMPLETED,
  SIGN_UP_PERSONAL_DETAIL_COMPLETED,
  SIGN_UP_SERVICES_COMPLETED,
  SIGN_UP_FLOW_COMPLETED,
} from "./experimentationConstants";

const waitTime = 0.0005;

const probablityExperimentTypeStoreHeader = {
  ["bayesian"]: {
    ["New Items"]: {
      //control
      metric1: 60,
      metric2: 50,
      metric3: 40,
      metric4: 30,
    },
    ["Sale"]: {
      // winner
      metric1: 70,
      metric2: 60,
      metric3: 50,
      metric4: 40,
    },
    ["Final Hours!"]: {
      metric1: 50,
      metric2: 40,
      metric3: 30,
      metric4: 20,
    },
  },
  ["frequentist"]: {
    ["New Items"]: {
      //control
      metric1: 66,
      metric2: 56,
      metric3: 46,
      metric4: 36,
    },
    ["Sale"]: {
      // winner
      metric1: 70,
      metric2: 60,
      metric3: 50,
      metric4: 40,
    },
    ["Final Hours!"]: {
      metric1: 64,
      metric2: 54,
      metric3: 44,
      metric4: 34,
    },
  },
};

const probablityExperimentTypeShortenCollection = {
  ["bayesian"]: {
    ["old-long-collections-page"]: {
      metric1: 50,
      metric2: 40,
      metric3: 20,
    },
    ["new-shorten-collections-page"]: {
      //winner
      metric1: 70,
      metric2: 60,
      metric3: 30,
    },
  },
  ["frequentist"]: {
    ["old-long-collections-page"]: {
      metric1: 47,
      metric2: 37,
      metric3: 27,
    },
    ["new-shorten-collections-page"]: {
      //winner
      metric1: 50,
      metric2: 40,
      metric3: 30,
    },
  },
};

// togglebank signup funnel experiment probabilities
const probablityExperimentTypeToggleBankSignup = {
  ["bayesian"]: {
    ["old-signup"]: {
      // control - current single-page signup
      signupStarted: 85,
      initialCompleted: 45,
      personalDetailsCompleted: 35,
      servicesCompleted: 30,
      flowCompleted: 25,
    },
    ["new-signup-flow"]: {
      // winner - new multi-step signup
      signupStarted: 90,
      initialCompleted: 60,
      personalDetailsCompleted: 55,
      servicesCompleted: 50,
      flowCompleted: 45,
    },
  },
  ["frequentist"]: {
    ["old-signup"]: {
      // control - current single-page signup
      signupStarted: 83,
      initialCompleted: 43,
      personalDetailsCompleted: 33,
      servicesCompleted: 28,
      flowCompleted: 23,
    },
    ["new-signup-flow"]: {
      // winner - new multi-step signup  
      signupStarted: 88,
      initialCompleted: 58,
      personalDetailsCompleted: 53,
      servicesCompleted: 48,
      flowCompleted: 43,
    },
  },
};

export const generateStoreHeaderFunnelExperimentResults = async ({
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
    const flagVariation: string = client?.variation("storeAttentionCallout", "New Items");
    if (flagVariation === "New Items") {
      totalPrice = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
    }

    if (flagVariation === "Sale") { //winner
      totalPrice = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
    }
    if (flagVariation === "Final Hours!") {
      totalPrice = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
    }

    let stage1metric = Math.random() * 100;

    const metricProbablityObj =
      probablityExperimentTypeStoreHeader[
        experimentType as keyof typeof probablityExperimentTypeStoreHeader
      ];
    const metricProbablity = metricProbablityObj[flagVariation as keyof typeof metricProbablityObj];
    if (stage1metric < metricProbablity.metric1) {
      await client?.track("store-accessed");
      await client?.flush();
      let stage2metric = Math.random() * 100;

      if (stage2metric < metricProbablity.metric2) {
        await client?.track("item-added");
        await client?.flush();
        let stage3metric = Math.random() * 100;

        if (stage3metric < metricProbablity.metric3) {
          await client?.track("cart-accessed");
          await client?.flush();
          let stage4metric = Math.random() * 100;

          if (stage4metric < metricProbablity.metric4) {
            await client?.track("customer-checkout");
            await client?.flush();
            await client?.track("in-cart-total-price", undefined, totalPrice);
            await client?.flush();
          }
        }
      }
    }
    setProgress((prevProgress: number) => prevProgress + (1 / experimentTypeObj.numOfRuns) * 100);
    await wait(waitTime);
    await updateContext();
  }
  setExpGenerator(false);
};

export const generateToggleBankSignupFunnelExperimentResults = async ({
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
    const flagVariation: string = client?.variation(
      "releaseNewSignupPromo",
      "old-signup"
    );

    const metricProbablityObj =
      probablityExperimentTypeToggleBankSignup[
        experimentType as keyof typeof probablityExperimentTypeToggleBankSignup
      ];
    const metricProbablity = metricProbablityObj[flagVariation as keyof typeof metricProbablityObj];

    // step 1: signup started (user clicks join now)
    let signupStartedMetric = Math.random() * 100;
    if (signupStartedMetric < metricProbablity.signupStarted) {
      await client?.track(SIGN_UP_STARTED);
      await client?.flush();

      // step 2: initial signup completed (email/password entered)
      let initialCompletedMetric = Math.random() * 100;
      if (initialCompletedMetric < metricProbablity.initialCompleted) {
        await client?.track(INITIAL_SIGN_UP_COMPLETED);
        await client?.flush();

        // step 3: personal details completed
        let personalDetailsMetric = Math.random() * 100;
        if (personalDetailsMetric < metricProbablity.personalDetailsCompleted) {
          await client?.track(SIGN_UP_PERSONAL_DETAIL_COMPLETED);
          await client?.flush();

          // step 4: services selection completed
          let servicesMetric = Math.random() * 100;
          if (servicesMetric < metricProbablity.servicesCompleted) {
            await client?.track(SIGN_UP_SERVICES_COMPLETED);
            await client?.flush();

            // step 5: full signup flow completed (logged in)
            let flowCompletedMetric = Math.random() * 100;
            if (flowCompletedMetric < metricProbablity.flowCompleted) {
              await client?.track(SIGN_UP_FLOW_COMPLETED);
              await client?.flush();
            }
          }
        }
      }
    }

    setProgress((prevProgress: number) => prevProgress + (1 / experimentTypeObj.numOfRuns) * 100);
    await wait(waitTime);
    await updateContext();
  }
  setExpGenerator(false);
};

export const generateShortenCollectionsPageFunnelExperimentResults = async ({
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
    const flagVariation: string = client?.variation(
      "release-new-shorten-collections-page",
      "old-long-collections-page"
    );

    const metricProbablityObj =
      probablityExperimentTypeShortenCollection[
        experimentType as keyof typeof probablityExperimentTypeShortenCollection
      ];
    const metricProbablity = metricProbablityObj[flagVariation as keyof typeof metricProbablityObj];

    if (flagVariation === "old-long-collections-page") {
      totalPrice = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
    }
    if (flagVariation === "new-shorten-collections-page") {
      totalPrice = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
    }

    let stage1metric = Math.random() * 100;

    if (stage1metric < metricProbablity.metric1) {
      await client?.track("item-added");
      await client?.flush();
      let stage2metric = Math.random() * 100;

      if (stage2metric < metricProbablity.metric2) {
        await client?.track("cart-accessed");
        await client?.flush();
        let stage3metric = Math.random() * 100;

        if (stage3metric < metricProbablity.metric3) {
          await client?.track("customer-checkout");
          await client?.flush();
          client?.track("in-cart-total-price", undefined, totalPrice);
        }
      }
    }
    setProgress((prevProgress: number) => prevProgress + (1 / experimentTypeObj.numOfRuns) * 100);
    await wait(waitTime);
    await updateContext();
  }
  setExpGenerator(false);
};
