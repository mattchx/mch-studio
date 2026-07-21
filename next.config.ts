import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/.next/**",
          "**/node_modules/**",
          "**/remotion/build/**",
          "**/remotion/node_modules/**",
          "**/studio-runs/media/**",
        ],
      };
    }

    return config;
  },
};

export default nextConfig;
