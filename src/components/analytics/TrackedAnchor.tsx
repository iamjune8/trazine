"use client";

import type { ComponentProps } from "react";
import { trackEvent, trackConversion } from "@/lib/analytics";

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
  conversionLabel,
  onClick,
  ...rest
}: ComponentProps<"a"> & {
  event: string;
  data?: Record<string, unknown>;
  /** A NEXT_PUBLIC_GOOGLE_ADS_LABEL_* value — also fires a Google Ads
      conversion on click when set. */
  conversionLabel?: string;
}) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent(event, data);
        trackConversion(conversionLabel);
        onClick?.(e);
      }}
    />
  );
}
