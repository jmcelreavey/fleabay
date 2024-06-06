const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@fleabay/db", "fleabayto/auth", "@fleabay/api"],
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};
