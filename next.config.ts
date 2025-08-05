import type { NextConfig } from 'next';

// Extract the full URL instead of just the host

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.18.17',
        port: '4200',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.18.17',
        port: '4200',
        pathname: '/api/uploads/**', // Add this for the rewrite path
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },

      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'api.gilangaryo.site',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: 'api.gilangaryo.site',
        pathname: '/files/**',
      }
    ],
  },
};

export default nextConfig;