import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

/** One named accent per recurring package-page section — see the "Package-
 * page section accents" comment in globals.css for why this set is small
 * and fixed rather than a general-purpose palette. */
export type PackageAccent = "brass" | "info" | "violet" | "amber" | "indigo" | "teal" | "rose";

const ACCENT_TEXT: Record<PackageAccent, string> = {
  brass: "text-brass-deep",
  info: "text-info",
  violet: "text-violet",
  amber: "text-amber",
  indigo: "text-indigo",
  teal: "text-teal",
  rose: "text-rose",
};

const ACCENT_BADGE: Record<PackageAccent, string> = {
  brass: "bg-brass/10 text-brass-deep",
  info: "bg-info/10 text-info",
  violet: "bg-violet/10 text-violet",
  amber: "bg-amber/10 text-amber",
  indigo: "bg-indigo/10 text-indigo",
  teal: "bg-teal/10 text-teal",
  rose: "bg-rose/10 text-rose",
};

/**
 * A collapsible content block for the package page (Flight Details, Hotels,
 * Sightseeing, Itinerary). Built on native <details>/<summary> rather than a
 * client accordion — free keyboard support, works with JS disabled, and
 * every panel can be open by default without any client state.
 *
 * `accent` gives each section its own colour (a round icon badge, and the
 * title text) so the page reads as several distinct sections at a glance
 * rather than one long uniform-brass list — defaults to "brass" for a panel
 * that isn't one of the recurring, colour-coded sections.
 */
export function PackagePanel({
  title,
  icon,
  accent = "brass",
  defaultOpen = true,
  children,
}: {
  title: string;
  icon?: IconName;
  accent?: PackageAccent;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group border border-line-2 bg-paper [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 sm:px-8">
        <span className="flex items-center gap-3.5">
          {icon ? (
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ACCENT_BADGE[accent]}`}
            >
              <Icon name={icon} size={17} />
            </span>
          ) : null}
          <span className={`font-display text-xl ${ACCENT_TEXT[accent]}`}>{title}</span>
        </span>
        <Icon
          name="chevron-down"
          size={19}
          className="shrink-0 text-ink-3 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-line px-6 pb-7 pt-6 sm:px-8">{children}</div>
    </details>
  );
}
