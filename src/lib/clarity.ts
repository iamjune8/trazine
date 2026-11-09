/**
 * Microsoft Clarity project ID for travzine.in (session replays and heatmaps).
 *
 * The ID is public by design: it appears in the page source of every site that
 * uses Clarity, so it is safe to ship as a default. NEXT_PUBLIC_CLARITY_PROJECT_ID
 * overrides it; set that variable to an empty string to switch Clarity off.
 */
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "zb0eqen6ma";
