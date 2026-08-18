"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * An "accordion" gallery — hovering (or focusing, or tapping on touch)
 * a panel expands it to 4 flex-parts while its siblings collapse to 1,
 * revealing the title and a CTA; collapsed panels show a vertical label.
 *
 * Each panel is a real `<Link>`, not a decorative div — this is content,
 * not a demo, so it has to be keyboard-reachable, screen-reader-sensible
 * and crawlable like everything else in the nav.
 */

export type ElasticGalleryItem = {
  id: string;
  title: string;
  category: string;
  href: string;
  src: string;
  alt: string;
  blurSrc?: string;
  ctaLabel?: string;
};

export function ElasticGallery({
  items,
  defaultActiveId,
  className,
}: {
  items: ElasticGalleryItem[];
  defaultActiveId?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(
    defaultActiveId ?? items[0]?.id ?? null,
  );

  return (
    <div
      className={cn(
        "flex h-[640px] w-full flex-col gap-2 sm:h-[720px] md:h-[820px] md:flex-row md:gap-3",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            onMouseEnter={() => setActiveId(item.id)}
            onFocus={() => setActiveId(item.id)}
            onTouchStart={() => setActiveId(item.id)}
            className={cn(
              "group relative block overflow-hidden border border-line-2 bg-paper-3 outline-none",
              "focus-visible:ring-2 focus-visible:ring-brass-deep focus-visible:ring-offset-2",
              "transition-[flex-grow,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none",
              // The collapsed share is deliberately generous (1.6 vs the
              // active 4): with ten destinations, an extreme ratio squeezes
              // the inactive nine into unreadable slivers and the section
              // reads as though the other destinations are missing.
              isActive ? "flex-[5]" : "flex-[1.3] brightness-[0.6] hover:brightness-90",
            )}
          >
            <div className="absolute inset-0 h-full w-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                placeholder={item.blurSrc ? "blur" : undefined}
                blurDataURL={item.blurSrc}
                className={cn(
                  "object-cover transition-transform duration-[1200ms] ease-out motion-reduce:transition-none",
                  isActive ? "scale-110" : "scale-100",
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent transition-opacity duration-500",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
              {/* Active content — title, category, CTA */}
              <div
                className={cn(
                  "flex flex-col gap-2.5 transition-all duration-500 motion-reduce:transition-none",
                  isActive
                    ? "translate-y-0 opacity-100 delay-200"
                    : "pointer-events-none translate-y-10 opacity-0",
                )}
              >
                <p className="eyebrow eyebrow-on-dark">{item.category}</p>
                <h3 className="font-display text-2xl leading-[1.05] text-paper md:text-4xl">
                  {item.title}
                </h3>
                <span className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-paper/85">
                  {item.ctaLabel ?? "Explore"}
                  <Icon
                    name="arrow-up-right"
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>

              {/* Collapsed content — vertical label (desktop) / id (mobile) */}
              <div
                className={cn(
                  "absolute bottom-5 left-1/2 -translate-x-1/2 transition-all duration-500 motion-reduce:transition-none md:bottom-8",
                  isActive ? "scale-50 opacity-0" : "opacity-100 delay-500",
                )}
              >
                <span className="hidden whitespace-nowrap text-sm font-medium uppercase tracking-[0.2em] text-paper/90 [writing-mode:vertical-rl] md:block">
                  {item.title}
                </span>
                <span className="block text-xs font-medium uppercase tracking-[0.1em] text-paper/90 md:hidden">
                  {item.title}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
