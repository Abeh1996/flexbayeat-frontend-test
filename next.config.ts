// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "192.168.185.36",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flexbay-eat-bucket.s3.eu-west-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;