import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.10.101.155"],
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
}

export default nextConfig
