/** @type {import('next').NextConfig} */
const { version } = require('./package.json');

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  productionBrowserSourceMaps: true, // enable source maps for LaunchDarkly
  typescript: {
    ignoreBuildErrors: true
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_CREATED_DATE: new Date().toISOString(),
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // embed source content in sourcemaps for better error visibility in LaunchDarkly
      config.devtool = 'source-map';
    }
    return config;
  }
}

module.exports = nextConfig

