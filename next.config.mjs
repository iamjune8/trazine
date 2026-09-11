import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Every photo the site actually uses (the images.ts catalogue, plus
    // every destination/package/service image field) now lives under
    // public/images/ — see src/lib/images.ts. That removes the failure mode
    // that justified unoptimized: true here previously: Next's optimizer
    // proxying and re-processing a *remote* image on first request, which
    // broke on Hostinger's shared hosting after the Node process idled
    // overnight and wiped that on-disk cache (cold fetch+resize for every
    // image at once, some failing outright until a reload). A local file
    // read has no such cold-start network risk, so the optimizer is back on
    // — every image now gets automatic avif/webp conversion and per-usage
    // resizing instead of shipping a flat ~2400px JPEG everywhere.
    //
    // remotePatterns stays as a safety net, not the default path: the admin
    // image field still accepts a full external URL as one of its input
    // formats, for the rare case a photo hasn't been localised yet.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.tinyurl.com" },
      { protocol: "https", hostname: "**.com" },
      { protocol: "https", hostname: "**.in" },
      { protocol: "https", hostname: "**.io" },
      { protocol: "https", hostname: "**.co" },
      { protocol: "https", hostname: "**.org" },
    ],
    // Next 16 requires an explicit allowlist. 75 is the site default; 70 is
    // used only for photographs that sit behind a heavy scrim, where the
    // extra compression is invisible.
    qualities: [70, 75],
    formats: ["image/avif", "image/webp"],
  },
  // Baseline security headers — none of this is currently set at the
  // Hostinger/CDN layer, so it's applied here instead.
  //
  // The CSP below was written after auditing every third party this app
  // actually loads: GA4 (script + beacons to *.google-analytics.com and
  // googletagmanager.com), the Contact page's Google Maps iframe, and
  // Unsplash destination photography. GTM isn't in the allowlist — it's
  // only rendered when NEXT_PUBLIC_GTM_CONTAINER_ID is set, which it
  // currently isn't; add https://www.googletagmanager.com to connect-src
  // if that changes. Resend and Supabase never need an entry here — both
  // only run server-side (Server Actions/API routes), so the browser never
  // talks to them directly and CSP (a browser-only mechanism) doesn't
  // apply.
  //
  // script-src allows 'unsafe-inline' rather than a hash or nonce: this
  // site uses next/script's `beforeInteractive` strategy for one inline
  // script (marks <html> as scripted before first paint, avoiding a flash
  // of hidden content on scroll-reveal elements). Next.js injects that
  // through its own internal bootstrap code at runtime rather than a
  // static <script> tag, so a hash would be pinned to Next's internal
  // implementation and could silently break on a framework upgrade; a
  // nonce needs a fresh value per request, which conflicts with this
  // app's static/ISR-cached pages (home, about, destinations). If this
  // app moves to nonce-based CSP later, every cached route needs to
  // become dynamic first, or the nonce would go stale in the cached HTML.
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      // www.google.com and www.google.co.in: GA4's ad-audience-sync pixel
      // (/ads/ga-audiences), which loads as an <img>, not a fetch — and
      // varies by the visitor's regional Google TLD. .com and .co.in cover
      // this site's near-entirely Indian audience; a visitor on a different
      // regional TLD (.co.uk, .de, ...) would silently lose just that one
      // remarketing-audience pixel, not core pageview tracking.
      "img-src 'self' data: https: https://www.google.com https://www.google.co.in",
      "font-src 'self'",
      // GA4's actual collect beacon fans out across several Google-owned
      // domains depending on browser/consent signals — confirmed by testing
      // a real production build, not assumed from docs.
      "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://analytics.google.com https://stats.g.doubleclick.net https://www.google.com https://challenges.cloudflare.com",
      "frame-src https://www.google.com https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

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
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
  // Both travzine.in and www.travzine.in currently resolve (Hostinger's DNS
  // points both at this app) — a classic duplicate-content problem, since
  // search engines see two copies of every page at two hosts. travzine.in
  // (no www) is the canonical domain everywhere else in this codebase
  // (site.url in src/data/site.ts, every canonical/OG/JSON-LD URL derives
  // from it), so this is the enforcement side: any request that arrives on
  // the www host gets a permanent redirect to the same path on the apex
  // domain, before it ever reaches a page.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.travzine.in" }],
        destination: "https://travzine.in/:path*",
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
