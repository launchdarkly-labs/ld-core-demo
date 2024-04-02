/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true
  },
  publicRuntimeConfig: {
    lastAccessedDate: new Date().toISOString(),
    appVersion: "1.1"
  },
}

module.exports = nextConfig

