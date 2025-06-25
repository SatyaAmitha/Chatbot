/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Enable experimental features if needed
  experimental: {
    serverActions: true,
  },
  // App directory is enabled by default in Next.js 14
};

module.exports = nextConfig; 