import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/download/:path*',
        destination: 'https://api.gilangaryo.site/files/:path*',
      },
      {
        source: '/api/download/:path*',
        destination: 'https://localhost:4200/api/download/:path*',
      },
      {
        source: '/api/download/:path*',
        destination: 'https://backend-global-classroom-production.up.railway.app/api/download/:path*',
      },
    ];
  },
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
        pathname: '/api/uploads/**',
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
      },
      {
        protocol: 'http',
        hostname: 'api.gilangaryo.site',
        pathname: '/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'api.gilangaryo.site',
        pathname: '/image/upload/**',
      },

    ],
  },
};

export default nextConfig;