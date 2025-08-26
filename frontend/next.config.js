/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
  // Optional: silences workspace root warning; set to your monorepo root
  outputFileTracingRoot: 'D:/Workspace/Dynamic Portfolio Dashboard',
};

module.exports = nextConfig;
