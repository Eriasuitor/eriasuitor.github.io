/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {unoptimized: true},
  reactStrictMode: true,
  experimental: {
    // typedRoutes: true,
  }
};
  
module.exports = nextConfig;
  