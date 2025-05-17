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
    // Only keep supported features
    optimizeCss: false, // Disable this to avoid critters dependency
  },
  serverExternalPackages: ['prisma', '@prisma/client'],
  webpack: (config) => {
    // Add plugin to help with missing dependencies
    config.infrastructureLogging = {
      level: 'error', // Reduce warning noise
    };
    return config;
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 