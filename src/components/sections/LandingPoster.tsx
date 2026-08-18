"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEnquiry } from "@/components/enquiry/EnquiryContext";
import { Icon } from "@/components/ui/Icon";
import { trackEvent } from "@/lib/analytics";
import type { LandingPoster as LandingPosterData } from "@/lib/content/landingPoster";

const DISMISS_KEY = "poster-dismissed";
const APPEAR_DELAY_MS = 700;

/**
 * A large, blocking welcome poster for a campaign with an end date — distinct
 * from the small always-on corner banner (PromotionPopup). Shown once per
 * browser tab session, on first landing, then never again until a new
 * session — not once per page. `onDone` fires the moment this component has
 * nothing left to show (inactive, or already dismissed this session) so the
 * caller (PromotionLayer) knows it's safe to bring up the corner banner.
 */
export function LandingPoster({
  poster,
  onDone,
}: {
  poster: LandingPosterData;
  onDone: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const { open } = useEnquiry();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!poster.active || sessionStorage.getItem(DISMISS_KEY) === "1") {
      onDone();
      return;
    }

    const timer = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => clearTimeout(timer);
    // onDone is stable (useCallback in the parent); poster identity is what matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poster.active]);

  if (!poster.active) return null;

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
    onDone();
  }

  function handleOpen() {
    trackEvent("promotion_click", { source: "landing-poster", heading: poster.heading });
    dismiss();
    open({ source: "landing-poster" });
  }

  return (
    <AnimatePresence>
      {visible ? (
        <div className="fixed inset-0 z-95 flex items-center justify-center p-5">
          <motion.button
            type="button"
            aria-label="Close"
            onClick={dismiss}
            className="absolute inset-0 cursor-pointer bg-ink/70 backdrop-blur-sm"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            role="dialog"
            aria-label="Special offer"
            initial={reduced ? false : { opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl overflow-hidden border border-line-2 bg-paper shadow-2xl"
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ink/55 text-paper backdrop-blur-sm transition-colors duration-200 hover:bg-ink/75"
            >
              <Icon name="close" size={20} />
            </button>

            <button
              type="button"
              onClick={handleOpen}
              className="group block w-full cursor-pointer text-left"
            >
              {poster.imageUrl ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin-pasted URL from any host */}
                  <img
                    src={poster.imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                </div>
              ) : null}

              <div className="p-8 sm:p-10">
                {poster.heading ? (
                  <p className="font-display text-3xl leading-[1.15] text-ink sm:text-4xl">
                    {poster.heading}
                  </p>
                ) : null}
                {poster.subheading ? (
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-2">
                    {poster.subheading}
                  </p>
                ) : null}
                <span className="link-underline mt-7 inline-flex items-center gap-2 text-base font-medium text-brass-deep">
                  {poster.ctaLabel}
                  <Icon
                    name="arrow-right"
                    size={17}
                    className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  />
                </span>
              </div>
            </button>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
