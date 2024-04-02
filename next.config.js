/** @type {import('next').NextConfig} */
const { version } = require('./package.json');

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true
  },
  publicRuntimeConfig: {
    lastAccessedDate: new Date().toISOString(),
    appVersion: version
  },
}

module.exports = nextConfig

