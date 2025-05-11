/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'gopalmetals.com'],
    },
  },
  serverExternalPackages: ['prisma', '@prisma/client'],
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig; 