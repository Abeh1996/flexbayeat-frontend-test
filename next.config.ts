// next.config.ts
import type { NextConfig } from "next";

const backendUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://3.250.40.253:5000";

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
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;