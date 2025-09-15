import { init, LDClient, LDOptions } from "@launchdarkly/node-server-sdk";
import { Observability } from "@launchdarkly/observability-node";

export let ldClient: LDClient;

const getServerClient = async (sdkKey: string, options?: LDOptions) => {
    if (!ldClient) {
<<<<<<< HEAD
        // Configure options to prevent connection pool warnings
        const defaultOptions: LDOptions = {
            // Reduce event flush frequency to minimize connection usage
            flushInterval: 5, // Flush events every 5 seconds instead of default 2
            // Disable streaming for better connection management
            stream: false,
            // Use polling mode to reduce connection overhead
            useLdd: false,
            // Set timeout for better connection management
            timeout: 10,
            ...options
        };
        
        ldClient = await init(sdkKey, defaultOptions);
    }
    await ldClient.waitForInitialization();
    return ldClient;
=======
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
>>>>>>> 8114ee42a2d4473936073c3f847fbf3a8449c446
};

export default getServerClient;