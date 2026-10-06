import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/c/:slug", destination: "/docs/:slug", permanent: true },
      { source: "/c", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
