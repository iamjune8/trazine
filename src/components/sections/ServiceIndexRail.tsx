"use client";

import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type IndexItem = { slug: string; title: string; icon: IconName };

/**
 * Sticky vertical contents rail for the /services long-form list — desktop
 * only (the parent hides it below `lg`). Every entry is a real `<a href="#…">`
 * so jump-navigation works with zero JavaScript; only the "which one is the
 * reader on right now" highlight needs the observer below.
 */
export function ServiceIndexRail({ items }: { items: IndexItem[] }) {
  const [activeSlug, setActiveSlug] = useState(items[0]?.slug ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const targets = items
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);

    // A thin band roughly a third of the way down the viewport — whichever
    // service is crossing it right now is the one the rail marks active.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSlug(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Services on this page" className="sticky top-28">
      <ol className="border-l border-line">
        {items.map((item, index) => {
          const active = item.slug === activeSlug;
          return (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "-ml-px flex items-center gap-3 border-l-2 py-3 pl-5 transition-colors duration-300",
                  active
                    ? "border-brass text-ink"
                    : "border-transparent text-ink-3 hover:text-ink-2",
                )}
              >
                <Icon
                  name={item.icon}
                  size={15}
                  className={cn(
                    "shrink-0 transition-colors duration-300",
                    active ? "text-brass-deep" : "text-line-2",
                  )}
                  aria-hidden="true"
                />
                <span className="font-display text-xs tabular-nums" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.8125rem] uppercase tracking-[0.1em]">
                  {item.title}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
