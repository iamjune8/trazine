"use client";

import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { useCountUp } from "./useCountUp";

/**
 * A KPI figure with a signed delta vs the previous period — never color
 * alone: the arrow icon and the sign both carry direction, so a red/green
 * mistake (or grayscale) still reads correctly.
 */
export function KpiCard({
  icon,
  label,
  value,
  suffix = "",
  deltaPercent,
  accent = "violet",
}: {
  icon: IconName;
  label: string;
  /** Raw numeric value, used to drive the count-up animation. */
  value: number;
  /** Appended after the counted-up number, e.g. "%". A plain string, not a
   * formatter function — this component is a Client Component rendered from
   * a Server Component, and functions can't cross that boundary as props. */
  suffix?: string;
  deltaPercent: number | null;
  accent?: "violet" | "cyan" | "pink";
}) {
  const counted = useCountUp(Math.round(value));

  const accentClass = {
    violet: "from-admin-violet/30 to-admin-indigo/10 text-admin-violet",
    cyan: "from-admin-cyan/30 to-admin-indigo/10 text-admin-cyan",
    pink: "from-admin-pink/30 to-admin-violet/10 text-admin-pink",
  }[accent];

  const isUp = (deltaPercent ?? 0) >= 0;

  return (
    <div className="admin-glass rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br",
            accentClass,
          )}
        >
          <Icon name={icon} size={18} />
        </span>
        {deltaPercent !== null ? (
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              isUp ? "bg-admin-success/10 text-admin-success" : "bg-admin-danger/10 text-admin-danger",
            )}
          >
            <Icon name={isUp ? "trend-up" : "trend-down"} size={12} />
            {isUp ? "+" : ""}
            {deltaPercent.toFixed(1)}%
          </span>
        ) : null}
      </div>

      <p className="mt-5 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-admin-text-3">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold tabular-nums text-admin-text">
        {counted.toLocaleString("en-IN")}
        {suffix}
      </p>
      <p className="mt-1.5 text-xs text-admin-text-3">vs previous period</p>
    </div>
  );
}
