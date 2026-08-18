import Link from "next/link";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Card } from "@/components/admin/ui/Card";
import { KpiCard } from "@/components/admin/ui/KpiCard";
import { TrendChart } from "@/components/admin/ui/TrendChart";
import { RankedBarList } from "@/components/admin/ui/RankedBarList";
import { LiveBadge } from "@/components/admin/ui/LiveBadge";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import {
  ga4Configured,
  getOverview,
  getDailyActiveUsers,
  getTopPages,
  getTrafficSources,
  getDeviceBreakdown,
  getRealtimeActiveUsers,
  type DateRangeDays,
} from "@/lib/analytics/ga4";

export const dynamic = "force-dynamic";

const RANGES: { days: DateRangeDays; label: string }[] = [
  { days: 7, label: "7 days" },
  { days: 28, label: "28 days" },
  { days: 90, label: "90 days" },
];

const DEVICE_ICON: Record<string, IconName> = {
  desktop: "monitor",
  mobile: "smartphone",
  tablet: "tablet",
};

type Props = { searchParams: Promise<{ range?: string }> };

export default async function AnalyticsPage({ searchParams }: Props) {
  const { range } = await searchParams;
  const days = (RANGES.find((r) => String(r.days) === range)?.days ?? 28) as DateRangeDays;

  if (!ga4Configured) {
    return (
      <div>
        <PageHeader
          eyebrow="Traffic"
          title="Analytics"
          description="Live numbers from the site's GA4 property."
        />
        <Card className="mt-8 flex items-start gap-4 p-7">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-admin-warning/10 text-admin-warning">
            <Icon name="activity" size={20} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-admin-text">Not connected yet</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-admin-text-3">
              Set <code className="rounded bg-white/5 px-1.5 py-0.5">GA4_PROPERTY_ID</code>,{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5">GA4_SERVICE_ACCOUNT_EMAIL</code>{" "}
              and{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5">GA4_SERVICE_ACCOUNT_PRIVATE_KEY</code>{" "}
              — see .env.example for how to provision the service account.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const [overview, daily, topPages, sources, devices, realtimeUsers] = await Promise.all([
    getOverview(days),
    getDailyActiveUsers(days),
    getTopPages(days, 8),
    getTrafficSources(days),
    getDeviceBreakdown(days),
    getRealtimeActiveUsers(),
  ]);

  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Traffic"
        title="Analytics"
        description="Live numbers from the site's GA4 property."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <LiveBadge initialActiveUsers={realtimeUsers} />
            <nav aria-label="Date range" className="flex gap-2">
              {RANGES.map((r) => (
                <Link
                  key={r.days}
                  href={`/admin/analytics?range=${r.days}`}
                  className={cn(
                    "rounded-xl border px-3.5 py-2 text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-200",
                    days === r.days
                      ? "border-admin-violet/50 bg-admin-violet/15 text-admin-text"
                      : "border-admin-border text-admin-text-2 hover:border-admin-violet/40",
                  )}
                >
                  {r.label}
                </Link>
              ))}
            </nav>
          </div>
        }
      />

      {!overview ? (
        <p className="mt-8 rounded-xl border border-admin-danger/30 bg-admin-danger/10 px-4 py-3 text-sm text-admin-danger">
          Couldn&rsquo;t reach the GA4 Data API — check the service account still has Viewer
          access on the property, and that the credentials in .env are current.
        </p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              icon="users"
              label="Active users"
              value={overview.activeUsers}
              deltaPercent={overview.deltas.activeUsers}
              accent="violet"
            />
            <KpiCard
              icon="activity"
              label="Sessions"
              value={overview.sessions}
              deltaPercent={overview.deltas.sessions}
              accent="cyan"
            />
            <KpiCard
              icon="eye"
              label="Page views"
              value={overview.pageViews}
              deltaPercent={overview.deltas.pageViews}
              accent="pink"
            />
            <KpiCard
              icon="trend-up"
              label="Engagement rate"
              value={Math.round(overview.engagementRate * 100)}
              suffix="%"
              deltaPercent={overview.deltas.engagementRate}
              accent="violet"
            />
          </div>

          <Card className="mt-6 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--chart-1)" }} />
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-admin-text">
                Active users — last {days} days
              </h2>
            </div>
            <div className="mt-6">
              <TrendChart points={daily} />
            </div>
          </Card>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6 sm:p-7">
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-admin-text">
                Top pages
              </h2>
              <div className="mt-5">
                <RankedBarList rows={topPages} />
              </div>
            </Card>

            <Card className="p-6 sm:p-7">
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-admin-text">
                Traffic sources
              </h2>
              <div className="mt-5">
                <RankedBarList rows={sources} colors={chartColors} />
              </div>
            </Card>
          </div>

          <Card className="mt-6 p-6 sm:p-7">
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-admin-text">
              Devices
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {devices.map((d, i) => (
                <div
                  key={d.label}
                  className="flex items-center gap-3 rounded-xl border border-admin-border-soft bg-white/[0.02] p-4"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${chartColors[i % chartColors.length]}22`, color: chartColors[i % chartColors.length] }}
                  >
                    <Icon name={DEVICE_ICON[d.label.toLowerCase()] ?? "globe"} size={16} />
                  </span>
                  <div>
                    <p className="text-xs capitalize text-admin-text-3">{d.label}</p>
                    <p className="text-lg font-semibold tabular-nums text-admin-text">
                      {d.value.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
              {devices.length === 0 ? (
                <p className="text-sm text-admin-text-3">No data for this range yet.</p>
              ) : null}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
