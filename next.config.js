/** @type {import('next').NextConfig} */
const { version } = require('./package.json');
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  productionBrowserSourceMaps: true, // enable source maps for LaunchDarkly
  typescript: {
    ignoreBuildErrors: true
  },
  turbopack: {}, // Acknowledge Turbopack is used (webpack config is fallback for non-Turbopack builds)
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_CREATED_DATE: new Date().toISOString(),
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      // Remove the default devtool setting
      config.devtool = false;
      
      // Use SourceMapDevToolPlugin to have full control over source map generation
      // This ensures source content is embedded in the maps for LaunchDarkly
      config.plugins.push(
        new webpack.SourceMapDevToolPlugin({
          filename: '[file].map',
          // Include original source code in the source map
          noSources: false,
          // This embeds the actual source content, not just references
          module: true,
          columns: true,
        })
      );
    }
    return config;
  }
}

module.exports = nextConfig

