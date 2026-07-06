import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nécessaire pour le Dockerfile : génère .next/standalone (server.js
  // autonome + node_modules minimal), voir docs/architecture.md.
  output: "standalone",
};

export default nextConfig;
