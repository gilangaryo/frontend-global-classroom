import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['gilangaryo.online'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.w3.org',
        port: '',
        pathname: '/TR/pdf/**',
      },
    ],
  },
};

export default nextConfig;

