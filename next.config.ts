import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sinon les chunks client renvoient 403 quand on ouvre le site via 127.0.0.1 en dev.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
