import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  transpilePackages: [
    "@pmf/ui",
    "@pmf/core",
    "@pmf/db",
    "@pmf/analytics",
    "@pmf/ab-test",
    "@pmf/user-behavior-log",
  ],
};

export default nextConfig;
