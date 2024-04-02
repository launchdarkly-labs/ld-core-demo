/** @type {import('next').NextConfig} */
const { version } = require('./package.json');

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true
  },
  env: {
    appVersion: version,
    lastAccessedDate: new Date().toISOString(),
  }
}

module.exports = nextConfig

