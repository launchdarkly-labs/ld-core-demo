import { init, LDClient, LDOptions } from "launchdarkly-node-server-sdk";

export let ldClient: LDClient;

const getServerClient = async (sdkKey: string, options?: LDOptions) => {
    if (!ldClient) {
        ldClient = await init(sdkKey, options);
      }
  await ldClient.waitForInitialization();
  return ldClient;
};

export default getServerClient;