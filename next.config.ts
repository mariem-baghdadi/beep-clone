import type { NextConfig } from "next";

const nextConfig = {
  // Pour résoudre l'avertissement cross-origin
  allowedDevOrigins: ['localhost', '10.32.13.188'],
  // Pour indiquer la racine du projet à Turbopack
  turbopack: {
    root: process.cwd(),
  },
};
export default nextConfig;
