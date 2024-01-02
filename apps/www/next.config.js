import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

/** @type {import('next').NextConfig} */

export const reactStrictMode = true;
export const transpilePackages = [
  "@fleabay/db",
  "fleabayto/auth",
  "@fleabay/api",
];
export const experimental = {
  webpackBuildWorker: true,
};
export const images = {
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
};
export function webpack(config, { isServer }) {
  if (!isServer) {
    config.plugins = [...config.plugins, new PrismaPlugin()];
  }
  return config;
}
