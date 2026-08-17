"use client";

import { trackEvent } from "@/lib/analytics";
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
}: {
  href: string;
  event: string;
  data?: Record<string, unknown>;
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  className?: string;
  withArrow?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent(event, data)}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      <Inner withArrow={withArrow}>{children}</Inner>
    </a>
  );
}
