import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
      "@launchdarkly/node-server-sdk",
      "@launchdarkly/server-sdk-ai",
      "@launchdarkly/observability-node",
      "@aws-sdk/client-bedrock-runtime",
      "@langchain/aws",
      "@langchain/core",
      "agent-base",
      "https-proxy-agent",
    ],
  outputFileTracingRoot: __dirname,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "node:perf_hooks": "perf_hooks",
        "node:async_hooks": "async_hooks",
        "node:util": "util",
        "node:stream": "stream",
        "node:buffer": "buffer",
        "node:events": "events",
      };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        path: false,
        fs: false,
        os: false,
        crypto: false,
        module: false,
        perf_hooks: false,
        async_hooks: false,
        util: false,
        stream: false,
        buffer: false,
        events: false,
        http: false,
        https: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
