/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    taint: true,
    serverActions: {
      // 允许代理域名和本地开发地址
      allowedOrigins: [
        'glowing-engine-4qwwjv76g7p25xj9-8081.app.github.dev',
        'localhost:8081', // 可选，本地开发时使用
      ],
    },
  },
  transpilePackages: ['@repo/ui'],
};

export default nextConfig;
