import type { NextConfig } from "next";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://bookleaf-server-kq8x.onrender.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${SERVER_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
