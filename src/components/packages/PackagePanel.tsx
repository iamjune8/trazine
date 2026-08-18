import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * A collapsible content block for the package page (Flight Details, Hotels,
 * Sightseeing, Itinerary). Built on native <details>/<summary> rather than a
 * client accordion — free keyboard support, works with JS disabled, and
 * every panel can be open by default without any client state.
 */
export function PackagePanel({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon?: IconName;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group border border-line-2 bg-paper [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 sm:px-8">
        <span className="flex items-center gap-3">
          {icon ? <Icon name={icon} size={19} className="shrink-0 text-brass-deep" /> : null}
          <span className="font-display text-xl text-ink">{title}</span>
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
