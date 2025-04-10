import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  typescript: {
    // WARNING: This setting bypasses type checking during production builds
    ignoreBuildErrors: true,
  },
  // ... any other configuration options
};

export default nextConfig;
