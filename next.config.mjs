import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  async rewrites() {
    return [
      { source: "/subscribe/v1", destination: "/subscribe/v1.html" },
      { source: "/subscribe/v1/", destination: "/subscribe/v1.html" },
      { source: "/subscribe/v2", destination: "/subscribe/v2.html" },
      { source: "/subscribe/v2/", destination: "/subscribe/v2.html" },
    ];
  },
};

export default nextConfig;
