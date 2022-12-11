/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ORIGIN: process.env.ORIGIN,
    STATS_PUBLIC_KEY: process.env.STATS_PUBLIC_KEY,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false }
    return config
  },
}

module.exports = nextConfig
