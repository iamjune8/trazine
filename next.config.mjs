/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Baseline security headers — none of this is currently set at the
  // Hostinger/CDN layer, so it's applied here instead. No Content-Security-
  // Policy yet: this site loads scripts/iframes from several third parties
  // (GA4, GTM, Google Maps, Resend), and a CSP written without carefully
  // auditing every one of those origins first risks silently breaking them.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
