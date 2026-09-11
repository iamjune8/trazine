/**
 * Reports an event to whichever tag is actually listening.
 *
 * Previously this only pushed a plain object ({event, ...data}) onto
 * dataLayer — the format Google Tag Manager's container script watches for.
 * That's fine once a GTM container is live, but this site currently has
 * NEXT_PUBLIC_GA_MEASUREMENT_ID set and NEXT_PUBLIC_GTM_CONTAINER_ID unset
 * (see .env.local) — bare GA4 via gtag.js, no GTM. gtag.js's own dataLayer
 * processing loop only understands *its* command format (arguments arrays
 * starting with 'event'/'config'/'js', pushed by calling `gtag(...)`), not
 * GTM's plain-object convention. So every call_click/whatsapp_click/
 * generate_lead event fired by this codebase has been landing in the
 * dataLayer array and then going precisely nowhere — not reaching GA4, not
 * reaching Google Ads, silently.
 *
 * Fix: call `window.gtag(...)` directly when it exists (true the moment
 * <GoogleAnalytics> from @next/third-parties has rendered), which is the
 * correct, working call for a bare-GA4 setup. Also still push the
 * GTM-shaped object, so nothing needs touching here if a GTM container is
 * added later instead of/alongside gtag.js.
 */
export function trackEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...data });

  if (typeof window.gtag === "function") {
    window.gtag("event", event, data);
  }
}

/**
 * Fires a Google Ads conversion alongside the GA4 event above. Inert until
 * NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID is set (same "safe to call
 * unconditionally, does nothing until configured" pattern as GA4/GTM/
 * Turnstile/Resend elsewhere in this codebase) — every call site below can
 * call this without an `if` guard.
 *
 * `email`/`phone` enable Google Ads' Enhanced Conversions for leads: gtag.js
 * hashes them client-side before sending, this code never transmits them in
 * the clear and never stores them — see
 * https://support.google.com/google-ads/answer/9888656
 */
export function trackConversion(
  /** One of NEXT_PUBLIC_GOOGLE_ADS_LABEL_* — undefined (that action's label
      not configured yet) is a normal, silent no-op, not an error. */
  conversionLabel: string | undefined,
  options?: { value?: number; currency?: string; email?: string; phone?: string },
) {
  if (typeof window === "undefined" || !conversionLabel) return;
  const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
  if (!conversionId || typeof window.gtag !== "function") return;

  const { value, currency = "INR", email, phone } = options ?? {};

  if (email || phone) {
    window.gtag("set", "user_data", {
      ...(email ? { email } : {}),
      ...(phone ? { phone_number: phone } : {}),
    });
  }

  window.gtag("event", "conversion", {
    send_to: `${conversionId}/${conversionLabel}`,
    ...(value !== undefined ? { value, currency } : {}),
  });
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}
