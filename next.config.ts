import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  /** Same-origin proxy so browser calls avoid CORS (dev server + hosts that honor rewrites). */
  async rewrites() {
    return [
      {
        source: "/magnatehub-api/:path*",
        destination: "https://dash.magnatehub.au/api/website/:path*",
      },
    ];
  },

  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
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
} as NextConfig;

export default nextConfig;