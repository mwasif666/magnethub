import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'magnatehub.au',
        port: '',
        pathname: '/uploads/project/card/**',
      },
    ],
  },
};

export default nextConfig;
