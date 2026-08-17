/**
 * Push a custom event into GTM's data layer. Safe to call unconditionally —
 * before a GTM container ID is set in .env.local the array simply queues
 * events nobody reads; once a container is live, existing pushes are picked
 * up retroactively since GTM replays the data layer from the start.
 *
 * Event names follow GA4's recommended naming where one exists
 * (`generate_lead`); everything else is a plain, descriptive snake_case name
 * with a `source` telling you which part of the site it fired from.
 */
export function trackEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...data });
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
