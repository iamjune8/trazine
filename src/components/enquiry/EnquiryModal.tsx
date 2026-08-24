"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { useEnquiry } from "./EnquiryContext";
import { EnquiryForm } from "./EnquiryForm";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/site";
import { trackEvent } from "@/lib/analytics";

/**
 * Enquiry dialog.
 *
 * Modal correctness, done by hand rather than pulled from a library:
 *  - `role="dialog"` + `aria-modal` + a labelled title
 *  - Escape closes; the backdrop closes; the panel does not
 *  - focus moves into the panel on open and returns to the trigger on close
 *  - Tab is trapped inside the panel while it is open
 *  - background scroll is locked, with the scrollbar's width compensated so
 *    the page behind doesn't shift sideways as it locks
 */
export function EnquiryModal() {
  const { isOpen, close, destination, source } = useEnquiry();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(isOpen);

  // Mounting is set during render (React re-renders immediately, before
  // paint, so this has the same effect as an effect-based update without
  // the extra render pass). Unmounting stays in an effect since it's a
  // genuinely delayed, cancellable timer — decoupled from AnimatePresence's
  // own exit-complete signal, which can get stuck and leave an invisible,
  // click-blocking overlay in the DOM forever (reproduced in testing); a
  // plain timer matching the longest exit transition below removes it
  // deterministically instead.
  if (isOpen && !mounted) setMounted(true);

  useEffect(() => {
    if (isOpen) return;
    const timer = setTimeout(() => setMounted(false), 420);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    // Focus the panel itself rather than the first input, so the dialog's
    // heading is announced before the form begins.
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      previouslyFocused.current?.focus();
    };
  }, [isOpen, close]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center sm:items-center">
      <m.button
        type="button"
        aria-label="Close enquiry form"
        onClick={close}
        className="absolute inset-0 cursor-pointer bg-ink/55 backdrop-blur-[3px]"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.28 }}
      />

      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-title"
        tabIndex={-1}
        initial={reduced ? false : { opacity: 0, y: 32, scale: 0.985 }}
        animate={
          isOpen
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 24, scale: 0.99 }
        }
        transition={{ duration: reduced ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto bg-paper px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 shadow-2xl outline-none sm:px-10 sm:py-12"
      >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center text-ink-3 transition-colors duration-200 hover:text-ink sm:right-5 sm:top-5"
            >
              <Icon name="close" size={22} />
            </button>

            <p className="eyebrow">Start Your Story</p>
            <h2
              id="enquiry-title"
              className="font-display mt-4 text-[length:var(--step-h3)] sm:text-[length:var(--step-h2)]"
            >
              Tell us where you&rsquo;d like to go
            </h2>
            <p className="mt-4 max-w-xl text-ink-2">
              A consultant replies within one working day with a costed, itemised
              proposal — or call{" "}
              <a
                href={site.phoneHref}
                onClick={() => trackEvent("call_click", { source: "enquiry-modal" })}
                className="link-underline text-brass-deep"
              >
                {site.phone}
              </a>{" "}
              if it&rsquo;s urgent.
            </p>

            <div className="mt-9">
              <EnquiryForm
                compact
                defaultDestination={destination}
                source={source ?? "modal"}
              />
            </div>
      </m.div>
    </div>
  );
}
