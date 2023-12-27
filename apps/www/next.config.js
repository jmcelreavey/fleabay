/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@fleabay/db", "fleabayto/auth", "@fleabay/api"],
  experimental: {
    webpackBuildWorker: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};
