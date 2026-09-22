"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackMetaEvent } from "@/lib/meta-pixel";

/**
 * Fires a Meta PageView on every client-side route change.
 *
 * Next.js App Router doesn't reload the page between routes, so
 * MetaPixelScript's one `fbq('track', 'PageView')` — fired when the pixel
 * bootstraps — only ever covers the first page of a visit. Every layout in
 * this app persists across navigation within it (confirmed: `(site)` and
 * `lp` are each a single React tree with page.tsx swapping underneath), so
 * without this, a visitor who lands on / then clicks through to three
 * destination pages would register as exactly one PageView, not four.
 *
 * The first pathname this sees is deliberately skipped — that load is
 * already covered by the bootstrap script's own PageView, and firing again
 * here would double-count the very first page of every visit.
 */
export function MetaPixelPageview() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackMetaEvent("PageView");
  }, [pathname]);

  return null;
}
