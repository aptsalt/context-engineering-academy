import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/context-engineering-academy",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
