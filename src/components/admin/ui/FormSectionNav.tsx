"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export type FormSection = { id: string; label: string; icon: IconName };

/**
 * A sticky map of every section in a long admin form — Destinations and
 * Packages both have eight-plus sections stacked in one page, which is
 * exactly the "which part am I even looking at" confusion this exists to
 * fix. Scrollspy highlights the section currently in view; clicking a link
 * jumps straight to it instead of scrolling through everything above it.
 */
export function FormSectionNav({ sections }: { sections: FormSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Form sections"
      className="admin-glass admin-scrollbar sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-2xl p-3"
    >
      {sections.map((section) => {
        const active = activeId === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              "relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              active ? "text-admin-text" : "text-admin-text-3 hover:text-admin-text-2",
            )}
          >
            {active ? (
              <m.span
                layoutId="form-section-active"
                className="absolute inset-0 rounded-xl bg-admin-violet/15 ring-1 ring-admin-violet/30"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            <Icon
              name={section.icon}
              size={15}
              className={cn("relative shrink-0", active ? "text-admin-violet" : "text-admin-text-3")}
            />
            <span className="relative">{section.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
