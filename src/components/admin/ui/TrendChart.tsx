"use client";

import { useId, useMemo, useState } from "react";
import type { DailyPoint } from "@/lib/analytics/ga4";

const WIDTH = 720;
const HEIGHT = 220;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;

/**
 * A single-series area+line chart with a hairline crosshair — one hue
 * (--chart-1), so no legend box is needed (the card title already says
 * what's plotted). Built as inline SVG with a transparent full-height hit
 * strip per point rather than a charting library, matching the rest of the
 * admin panel's hand-rolled-SVG icon approach.
 */
export function TrendChart({ points }: { points: DailyPoint[] }) {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { linePath, areaPath, xy, maxValue } = useMemo(() => {
    if (points.length === 0) {
      return { linePath: "", areaPath: "", xy: [] as [number, number][], maxValue: 0 };
    }
    const max = Math.max(1, ...points.map((p) => p.value));
    const innerWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
    const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
    const step = points.length > 1 ? innerWidth / (points.length - 1) : 0;

    const coords: [number, number][] = points.map((p, i) => {
      const x = PAD_LEFT + step * i;
      const y = PAD_TOP + innerHeight * (1 - p.value / max);
      return [x, y];
    });

    const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
    const area =
      `${line} L${coords[coords.length - 1][0]},${PAD_TOP + innerHeight} ` +
      `L${coords[0][0]},${PAD_TOP + innerHeight} Z`;

    return { linePath: line, areaPath: area, xy: coords, maxValue: max };
  }, [points]);

  if (points.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-admin-text-3">
        No data for this range yet.
      </div>
    );
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;
  const hoveredXY = hoverIndex !== null ? xy[hoverIndex] : null;
  const innerWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const step = points.length > 1 ? innerWidth / (points.length - 1) : innerWidth;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label={`Active users trend, ${points[0].label} to ${points[points.length - 1].label}, peak ${maxValue}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gridlines — hairline, recessive, one step off the surface */}
        {[0, 0.5, 1].map((f) => {
          const y = PAD_TOP + (HEIGHT - PAD_TOP - PAD_BOTTOM) * f;
          return (
            <line
              key={f}
              x1={PAD_LEFT}
              y1={y}
              x2={WIDTH - PAD_RIGHT}
              y2={y}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
          );
        })}

        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path d={linePath} fill="none" stroke="var(--chart-1)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* Crosshair + end marker */}
        {hoveredXY ? (
          <>
            <line
              x1={hoveredXY[0]}
              y1={PAD_TOP}
              x2={hoveredXY[0]}
              y2={HEIGHT - PAD_BOTTOM}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
            <circle cx={hoveredXY[0]} cy={hoveredXY[1]} r={4} fill="var(--chart-1)" stroke="var(--color-admin-surface)" strokeWidth={2} />
          </>
        ) : (
          <circle
            cx={xy[xy.length - 1][0]}
            cy={xy[xy.length - 1][1]}
            r={4}
            fill="var(--chart-1)"
            stroke="var(--color-admin-surface)"
            strokeWidth={2}
          />
        )}

        {/* X-axis labels — first, middle, last only */}
        {[0, Math.floor((points.length - 1) / 2), points.length - 1].map((i, idx) => (
          <text
            key={idx}
            x={xy[i][0]}
            y={HEIGHT - 8}
            fontSize={11}
            textAnchor={idx === 0 ? "start" : idx === 2 ? "end" : "middle"}
            fill="var(--color-admin-text-3)"
          >
            {points[i].label}
          </text>
        ))}

        {/* Hit strips — one per point, full chart height */}
        {points.map((p, i) => (
          <rect
            key={p.date}
            x={PAD_LEFT + step * i - step / 2}
            y={0}
            width={step}
            height={HEIGHT}
            fill="transparent"
            onPointerEnter={() => setHoverIndex(i)}
            onPointerLeave={() => setHoverIndex((v) => (v === i ? null : v))}
          />
        ))}
      </svg>

      {hovered && hoveredXY ? (
        <div
          className="pointer-events-none absolute top-2 -translate-x-1/2 rounded-lg border border-admin-border bg-admin-surface-2 px-3 py-2 text-xs shadow-lg"
          style={{ left: `${(hoveredXY[0] / WIDTH) * 100}%` }}
        >
          <p className="text-admin-text-3">{hovered.label}</p>
          <p className="mt-0.5 font-semibold tabular-nums text-admin-text">
            {hovered.value.toLocaleString("en-IN")} users
          </p>
        </div>
      ) : null}
    </div>
  );
}
