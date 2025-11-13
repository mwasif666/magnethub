import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',

  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "magnatehub.au",
        port: "",
        pathname: "/uploads/project/card/**",
      },
    ],
  },
};

export default nextConfig;