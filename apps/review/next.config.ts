import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // This app is local only — never deployed to Vercel.
  // It uses Node.js fs directly for reading/writing data/*.json.
  experimental: {},
}

export default nextConfig
