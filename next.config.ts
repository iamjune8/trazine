import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Destination photography is served from Unsplash and resized by Next's
    // optimizer. Swap this host when the client's own photography lands.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    // Next 16 requires an explicit allowlist. 75 is the site default; 70 is
    // used only for photographs that sit behind a heavy scrim, where the
    // extra compression is invisible.
    qualities: [70, 75],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
