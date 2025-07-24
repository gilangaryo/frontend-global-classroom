import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['gilangaryo.online'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
