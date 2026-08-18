"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Counts up from 0 to `value` once, when the card first mounts. Cheap and
 * dependency-free — no IntersectionObserver needed since stat cards render
 * above the fold on the dashboard. */
function useCountUp(value: number, duration = 900) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced || value === 0) {
      return;
    }
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, reduced]);

  return display;
}

export function StatCard({
  href,
  icon,
  label,
  value,
  note,
  accent = "violet",
}: {
  href: string;
  icon: IconName;
  label: string;
  value: number;
  note?: string;
  accent?: "violet" | "cyan" | "pink";
}) {
  const displayValue = useCountUp(value);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const accentClass = {
    violet: "from-admin-violet/30 to-admin-indigo/10 text-admin-violet",
    cyan: "from-admin-cyan/30 to-admin-indigo/10 text-admin-cyan",
    pink: "from-admin-pink/30 to-admin-violet/10 text-admin-pink",
  }[accent];

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <Link
      ref={cardRef}
      href={href}
      onMouseMove={handleMouseMove}
      className={cn(
        "admin-glass group relative block overflow-hidden rounded-2xl p-6",
        "transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-admin-violet/40",
      )}
      style={{
        backgroundImage:
          "radial-gradient(220px circle at var(--mx, 50%) var(--my, 0%), rgba(139,92,246,0.14), transparent 70%)",
      }}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br",
            accentClass,
          )}
        >
          <Icon name={icon} size={18} />
        </span>
        <Icon
          name="arrow-up-right"
          size={16}
          className="text-admin-text-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />
      </div>

      <p className="mt-5 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-admin-text-3">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold tabular-nums text-admin-text">{displayValue}</p>
      {note ? <p className="mt-1 text-xs text-admin-text-3">{note}</p> : null}
    </Link>
  );
}
