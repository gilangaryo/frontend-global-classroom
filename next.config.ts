import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/uploads/:path*',
        destination: 'http://192.168.56.1:4100/uploads/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4100',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.56.1',
        port: '4100',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'link.com',
        pathname: '/**',
      },
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