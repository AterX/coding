/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  // Configure webpack to use memory cache instead of file system cache
  webpack: (config) => {
    config.cache = {
      type: 'memory'
    };
    return config;
  }
};

module.exports = nextConfig;
