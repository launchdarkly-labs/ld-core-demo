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
      "@traceloop/node-server-sdk",
    ],
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
