import { init, LDClient, LDOptions } from "@launchdarkly/node-server-sdk";

export let ldClient: LDClient;

const getServerClient = async (sdkKey: string, options?: LDOptions) => {
    if (!ldClient) {
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
};

export default getServerClient;