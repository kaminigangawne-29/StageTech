/** @type {import('next').NextConfig} */
const isGithubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true';

const nextConfig = {
  ...(isGithubPages && {
    output: 'export',
    distDir: 'out',
    basePath: '/StageTech',
    assetPrefix: '/StageTech',
    images: {
      unoptimized: true,
    },
  }),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'next-auth'],
  },
};

module.exports = nextConfig;
