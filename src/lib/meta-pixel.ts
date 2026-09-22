/**
 * Meta (Facebook) Pixel — a second, independent tracking pipe from
 * src/lib/analytics.ts. That file pushes everything onto `dataLayer` for
 * GTM to read; this one calls `window.fbq(...)` directly. The two are kept
 * deliberately separate rather than routed through one shared pipe: Meta
 * events must never depend on GTM being present/configured correctly, and
 * a GTM container change must never be able to affect what Meta receives.
 *
 * Inert until NEXT_PUBLIC_META_PIXEL_ID is set (see .env.example) — no
 * script loads, `window.fbq` never exists, and every call below is a
 * silent no-op.
 */
export function trackMetaEvent(eventName: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (data) {
    window.fbq("track", eventName, data);
  } else {
    window.fbq("track", eventName);
  }
}

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
    _fbq?: Window["fbq"];
  }
}
