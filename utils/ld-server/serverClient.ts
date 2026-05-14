import { init, LDClient, LDOptions } from "@launchdarkly/node-server-sdk";
import { Observability } from "@launchdarkly/observability-node";

export let ldClient: LDClient;

const getServerClient = async (sdkKey: string, options?: LDOptions) => {
    if (!ldClient) {
        const observabilityOptions = {
            serviceName: 'ld-core-demo',
            serviceVersion: process.env.npm_package_version || 'development',
            environment: process.env.NODE_ENV || 'development'
        };

        const mergedOptions: LDOptions = {
            ...options,
            plugins: [
                ...(options?.plugins || []),
                new Observability(observabilityOptions)
            ]
        };

        ldClient = await init(sdkKey, mergedOptions);
      }
  await ldClient.waitForInitialization();
  return ldClient;
};

export default getServerClient;