"use client";

import { useState } from "react";
import type { RankedRow } from "@/lib/analytics/ga4";
import { cn } from "@/lib/utils";

/**
 * Horizontal ranked bars — magnitude comparison across a small set of
 * labeled rows (top pages, traffic sources, device categories). The value
 * always sits outside the bar end, so it never needs to be measured against
 * the bar's own width to decide whether it fits.
 *
 * `colors`, when given one per row, makes this a categorical chart (traffic
 * sources, devices) — a legend key (the swatch beside each label) carries
 * identity alongside the bar. Omit it for a single-hue magnitude ranking
 * (top pages), where every bar is the same series.
 */
export function RankedBarList({
  rows,
  colors,
  emptyLabel = "No data for this range yet.",
}: {
  rows: RankedRow[];
  colors?: string[];
  emptyLabel?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (rows.length === 0) {
    return <p className="py-6 text-sm text-admin-text-3">{emptyLabel}</p>;
  }

  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <ul className="space-y-3">
      {rows.map((row, i) => {
        const color = colors?.[i] ?? "var(--chart-1)";
        const widthPct = (row.value / max) * 100;
        return (
          <li key={row.label}>
            <button
              type="button"
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered((v) => (v === i ? null : v))}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered((v) => (v === i ? null : v))}
              className="group flex w-full items-center gap-3 rounded-lg text-left"
            >
              {colors ? (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
              ) : null}
              <span className="w-28 shrink-0 truncate text-sm text-admin-text-2 sm:w-40">
                {row.label}
              </span>
              <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/5">
                <span
                  className={cn(
                    "block h-full rounded-full transition-[width,opacity] duration-300",
                    hovered === i && "opacity-80",
                  )}
                  style={{ width: `${widthPct}%`, backgroundColor: color }}
                />
              </span>
              <span className="w-14 shrink-0 text-right text-sm font-medium tabular-nums text-admin-text">
                {row.value.toLocaleString("en-IN")}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
