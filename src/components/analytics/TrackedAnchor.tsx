"use client";

import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * A plain `<a>` that reports a data-layer event on click before navigating.
 * Exists so server-rendered pages (Footer, CTABand, the contact channels
 * list, destination pages) can attach click tracking to a phone/WhatsApp/
 * email link without becoming client components themselves — only this one
 * small wrapper ships JS.
 */
export function TrackedAnchor({
  event,
  data,
  onClick,
  ...rest
}: ComponentProps<"a"> & {
  event: string;
  data?: Record<string, unknown>;
}) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent(event, data);
        onClick?.(e);
      }}
    />
  );
}
