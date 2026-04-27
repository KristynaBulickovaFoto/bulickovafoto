import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "eu.zonerama.com",
      },
      {
        protocol: "https",
        hostname: "zonerama.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "framer-motion"],
  },
};

export default nextConfig;
