import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/category/business-tech', destination: '/knowledge', permanent: false },
      { source: '/category/business-tech/:id', destination: '/knowledge/:id', permanent: false },
      { source: '/category/history', destination: '/knowledge', permanent: false },
      { source: '/category/anti-aging', destination: '/knowledge', permanent: false },
      { source: '/category/knowledge', destination: '/knowledge', permanent: false },
    ]
  },
};

export default nextConfig;
