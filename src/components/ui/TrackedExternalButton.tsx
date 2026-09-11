"use client";

import { trackEvent, trackConversion } from "@/lib/analytics";
import { base, sizes, variants, Inner } from "./Button";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "on-dark";
type Size = "md" | "lg";

/**
 * Same rendering as `ExternalButton` (see Button.tsx), plus a data-layer
 * event fired on click. Split into its own client component rather than
 * making ExternalButton itself trackable, so the shared Button.tsx — used
 * all over the site, mostly from server components — stays server-only.
 */
export function TrackedExternalButton({
  href,
  event,
  data,
  variant = "outline",
  size = "md",
  className,
  children,
  withArrow,
  conversionLabel,
}: {
  href: string;
  event: string;
  data?: Record<string, unknown>;
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  className?: string;
  withArrow?: boolean;
  /** A NEXT_PUBLIC_GOOGLE_ADS_LABEL_* value — pass this to also fire a
      Google Ads conversion on click (WhatsApp buttons pass the WhatsApp
      label; a plain external link with no conversion meaning omits it). */
  conversionLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent(event, data);
        trackConversion(conversionLabel);
      }}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      <Inner withArrow={withArrow}>{children}</Inner>
    </a>
  );
}
