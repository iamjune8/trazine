/**
 * Reports an event to GTM by pushing it onto dataLayer — the sole tracking
 * pipe for this codebase. GTM (NEXT_PUBLIC_GTM_CONTAINER_ID) owns GA4
 * entirely: its own GA4 Configuration tag initializes the property, and its
 * GA4 event tags trigger off these pushes via GTM's Custom Event trigger.
 *
 * This used to also call `window.gtag(...)` directly, as a second pipe for
 * when GA4 ran bare (no GTM container). Once GTM went live, that became
 * actively harmful rather than redundant: `gtag()` is itself implemented as
 * `dataLayer.push(arguments)`, so the direct call landed a *second*,
 * differently-shaped entry in the same dataLayer GTM already reads from —
 * satisfying GTM's Custom Event trigger a second time and double-firing
 * every GA4 tag (confirmed via GTM Preview: generate_lead firing twice per
 * submission). Now there is exactly one push per call, so exactly one tag
 * fire per event.
 */
export function trackEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...data });
}

/**
 * Pushes a dataLayer event a Google Ads Conversion Tracking tag inside GTM
 * can trigger on. Inert until both NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID and
 * a conversion label are set (same "safe to call unconditionally, does
 * nothing until configured" pattern as GA4/GTM/Turnstile/Resend elsewhere in
 * this codebase) — every call site below can call this without an `if`
 * guard.
 *
 * Previously called `gtag('event', 'conversion', ...)` directly — a second
 * tracking pipe entirely outside GTM, invisible to the container the same
 * way the old trackEvent() gtag call was. The actual Ads conversion tag
 * (built from the conversion ID + label) now lives in GTM, triggered off
 * this push instead.
 *
 * `email`/`phone` are passed through unhashed for GTM's own Enhanced
 * Conversions / User-Provided Data variable to hash — this code never
 * transmits them anywhere itself, same guarantee as before — see
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
  if (!conversionId) return;

  const { value, currency = "INR", email, phone } = options ?? {};

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "ads_conversion",
    conversion_id: conversionId,
    conversion_label: conversionLabel,
    ...(value !== undefined ? { value, currency } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
  });
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
