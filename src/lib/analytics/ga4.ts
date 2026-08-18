import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { cache } from "react";

/**
 * Server-only GA4 Data API client for /admin/analytics. Reads the same
 * property the public site's gtag snippet writes to (NEXT_PUBLIC_GA_
 * MEASUREMENT_ID) via a service account granted Viewer access — see
 * .env.example for how that's provisioned. Every exported function is
 * resilient by design: a missing/misconfigured credential or a failed
 * API call returns an empty/null result rather than throwing, so this
 * page degrades to an "not configured" state instead of a 500.
 */

const propertyId = process.env.GA4_PROPERTY_ID?.trim();
const clientEmail = process.env.GA4_SERVICE_ACCOUNT_EMAIL?.trim();
const privateKey = process.env.GA4_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

export const ga4Configured = Boolean(propertyId && clientEmail && privateKey);

let cachedClient: BetaAnalyticsDataClient | null = null;

function getClient(): BetaAnalyticsDataClient | null {
  if (!ga4Configured) return null;
  if (!cachedClient) {
    cachedClient = new BetaAnalyticsDataClient({
      credentials: { client_email: clientEmail, private_key: privateKey },
    });
  }
  return cachedClient;
}

export type DateRangeDays = 7 | 28 | 90;

export type Overview = {
  activeUsers: number;
  sessions: number;
  pageViews: number;
  engagementRate: number; // 0–1
  avgEngagementSeconds: number;
  deltas: {
    activeUsers: number | null; // percent change vs previous period, e.g. 12.4 or -5.1
    sessions: number | null;
    pageViews: number | null;
    engagementRate: number | null;
  };
};

export type DailyPoint = { date: string; label: string; value: number };
export type RankedRow = { label: string; value: number };

function pctDelta(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return ((current - previous) / previous) * 100;
}

async function fetchTotals(client: BetaAnalyticsDataClient, startDate: string, endDate: string) {
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "engagementRate" },
      { name: "averageSessionDuration" },
    ],
  });

  const values = response.rows?.[0]?.metricValues ?? [];
  return {
    activeUsers: Number(values[0]?.value ?? 0),
    sessions: Number(values[1]?.value ?? 0),
    pageViews: Number(values[2]?.value ?? 0),
    engagementRate: Number(values[3]?.value ?? 0),
    avgEngagementSeconds: Number(values[4]?.value ?? 0),
  };
}

export const getOverview = cache(async (days: DateRangeDays): Promise<Overview | null> => {
  const client = getClient();
  if (!client) return null;

  try {
    const [current, previous] = await Promise.all([
      fetchTotals(client, `${days}daysAgo`, "today"),
      fetchTotals(client, `${days * 2}daysAgo`, `${days + 1}daysAgo`),
    ]);

    return {
      activeUsers: current.activeUsers,
      sessions: current.sessions,
      pageViews: current.pageViews,
      engagementRate: current.engagementRate,
      avgEngagementSeconds: current.avgEngagementSeconds,
      deltas: {
        activeUsers: pctDelta(current.activeUsers, previous.activeUsers),
        sessions: pctDelta(current.sessions, previous.sessions),
        pageViews: pctDelta(current.pageViews, previous.pageViews),
        engagementRate: pctDelta(current.engagementRate, previous.engagementRate),
      },
    };
  } catch (error) {
    console.error("[ga4] overview report failed", error);
    return null;
  }
});

export const getDailyActiveUsers = cache(async (days: DateRangeDays): Promise<DailyPoint[]> => {
  const client = getClient();
  if (!client) return [];

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: `${days - 1}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    return (response.rows ?? []).map((row) => {
      const raw = row.dimensionValues?.[0]?.value ?? "";
      const iso = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      const date = new Date(`${iso}T00:00:00`);
      return {
        date: iso,
        label: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        value: Number(row.metricValues?.[0]?.value ?? 0),
      };
    });
  } catch (error) {
    console.error("[ga4] daily active users report failed", error);
    return [];
  }
});

export const getTopPages = cache(
  async (days: DateRangeDays, limit = 8): Promise<RankedRow[]> => {
    const client = getClient();
    if (!client) return [];

    try {
      const [response] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit,
      });

      return (response.rows ?? []).map((row) => ({
        label: row.dimensionValues?.[0]?.value || "/",
        value: Number(row.metricValues?.[0]?.value ?? 0),
      }));
    } catch (error) {
      console.error("[ga4] top pages report failed", error);
      return [];
    }
  },
);

export const getTrafficSources = cache(async (days: DateRangeDays): Promise<RankedRow[]> => {
  const client = getClient();
  if (!client) return [];

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 6,
    });

    return (response.rows ?? []).map((row) => ({
      label: row.dimensionValues?.[0]?.value || "Unassigned",
      value: Number(row.metricValues?.[0]?.value ?? 0),
    }));
  } catch (error) {
    console.error("[ga4] traffic sources report failed", error);
    return [];
  }
});

export const getDeviceBreakdown = cache(async (days: DateRangeDays): Promise<RankedRow[]> => {
  const client = getClient();
  if (!client) return [];

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 4,
    });

    return (response.rows ?? []).map((row) => ({
      label: row.dimensionValues?.[0]?.value || "Unknown",
      value: Number(row.metricValues?.[0]?.value ?? 0),
    }));
  } catch (error) {
    console.error("[ga4] device breakdown report failed", error);
    return [];
  }
});

/** Not wrapped in `cache()` — this one is meant to be called fresh on every poll. */
export async function getRealtimeActiveUsers(): Promise<number | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const [response] = await client.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: "activeUsers" }],
    });
    return Number(response.rows?.[0]?.metricValues?.[0]?.value ?? 0);
  } catch (error) {
    console.error("[ga4] realtime report failed", error);
    return null;
  }
}
