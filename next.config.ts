import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/sysvis",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
