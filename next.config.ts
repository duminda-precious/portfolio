import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * ⚠️ SCAFFOLDING ONLY. Unsplash stands in for real project imagery while
     * the site is built out. Once Gumlet assets and local stills land (Phase
     * 2), remove this entry — leaving an open remote host in production lets
     * anyone proxy arbitrary images through the optimiser.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    /** AVIF first, WebP fallback — both well under the JPEG weight. */
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
