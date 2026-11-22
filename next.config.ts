import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent out-of-memory crashes on container/shared hosts by limiting parallel workers
  experimental: {
    cpus: 1,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
