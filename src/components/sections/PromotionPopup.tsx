"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEnquiry } from "@/components/enquiry/EnquiryContext";
import { Icon } from "@/components/ui/Icon";
import { trackEvent } from "@/lib/analytics";
import type { Promotion } from "@/lib/content/promotion";

const DISMISS_KEY = "promo-dismissed";
const APPEAR_DELAY_MS = 1400;

/**
 * A floating flyer, not a page section — it sits outside the document flow
 * so it can appear over whatever page the visitor is already on. Only
 * renders once `active` is flipped on from /admin/promotion; the whole
 * component returns null otherwise, so an inactive promotion costs nothing.
 *
 * Dismissal is remembered per tab (sessionStorage) rather than forever —
 * a promotion is meant to be seen, and a visitor who closes it today should
 * still see next week's offer without clearing storage by hand.
 */
export function PromotionPopup({ promotion }: { promotion: Promotion }) {
  const [visible, setVisible] = useState(false);
  const { open } = useEnquiry();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!promotion.active) return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;

    const timer = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, [promotion.active]);

  if (!promotion.active) return null;

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  function handleOpen() {
    trackEvent("promotion_click", { heading: promotion.heading });
    dismiss();
    open({ source: "promotion" });
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="dialog"
          aria-label="Current promotion"
          initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 left-1/2 z-90 w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
        >
          <div className="relative overflow-hidden border border-line-2 bg-paper shadow-2xl">
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss promotion"
              className="absolute right-2 top-2 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-ink/55 text-paper backdrop-blur-sm transition-colors duration-200 hover:bg-ink/75"
            >
              <Icon name="close" size={17} />
            </button>

            <button
              type="button"
              onClick={handleOpen}
              className="group block w-full cursor-pointer text-left"
            >
              {promotion.imageUrl ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin-pasted URL from any host, so next/image's fixed remotePatterns allowlist doesn't fit */}
                  <img
                    src={promotion.imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                </div>
              ) : null}

              <div className="p-5">
                {promotion.heading ? (
                  <p className="font-display text-xl leading-snug text-ink">
                    {promotion.heading}
                  </p>
                ) : null}
                {promotion.subheading ? (
                  <p className="mt-1.5 text-sm text-ink-2">{promotion.subheading}</p>
                ) : null}
                <span className="link-underline mt-3 inline-flex items-center gap-2 text-sm font-medium text-brass-deep">
                  {promotion.ctaLabel}
                  <Icon
                    name="arrow-right"
                    size={15}
                    className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  />
                </span>
              </div>
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
