import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  typescript: {
    // WARNING: This setting bypasses type checking during production builds
    ignoreBuildErrors: true,
  },
  // Disable SWC minification for debugging purposes
  swcMinify: false,
  // Enable production source maps to better trace errors
  productionBrowserSourceMaps: true,
  // ... any other configuration options
};

export default nextConfig;
