import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/tiktok-dl",
  assetPrefix: "/tiktok-dl/",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.tiktokcdn.com' },
      { protocol: 'https', hostname: '**.tiktokcdn-us.com' },
      { protocol: 'https', hostname: '**.tiktok.com' },
      { protocol: 'https', hostname: '**.musical.ly' },
      { protocol: 'https', hostname: '**.byteoversea.com' },
    ],
  },
};

export default nextConfig;
