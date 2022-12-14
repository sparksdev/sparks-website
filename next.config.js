/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ORIGIN: process.env.ORIGIN,
    STATS_PUBLIC_KEY: process.env.STATS_PUBLIC_KEY,
    DEPLOYER_PROFILE_PUBLIC_KEY: process.env.DEPLOYER_PROFILE_PUBLIC_KEY,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      module: false,
    }
    return config
  },
}

module.exports = nextConfig
