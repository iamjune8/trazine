"use client";

import { useEffect, useRef } from "react";

/**
 * Shared scroll-reveal observer.
 *
 * One IntersectionObserver for the whole page rather than one per element —
 * a long editorial page has 40+ reveal targets, and 40 observers is 40 sets of
 * callbacks competing for the same frames.
 *
 * The critical property here is that **failing to fire can never hide
 * content**. The hidden state lives in CSS behind an `html.js` gate, and this
 * hook additionally sweeps once after load: anything already inside (or above)
 * the viewport that the observer somehow missed is revealed outright. A missed
 * callback costs an animation, never a paragraph.
 */

const VISIBLE = "data-visible";

let observer: IntersectionObserver | null = null;

function reveal(element: Element) {
  element.setAttribute(VISIBLE, "true");
  observer?.unobserve(element);
}

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target);
      }
    },
    {
      // Start the entrance slightly before the element's top edge arrives, so
      // it is settling as it enters rather than starting once it is read.
      rootMargin: "0px 0px -8% 0px",
      threshold: 0,
    },
  );

  return observer;
}

/**
 * Safety sweep. Runs shortly after mount and again on load: any still-hidden
 * target whose top edge is above the bottom of the viewport is revealed
 * immediately, covering both a missing IntersectionObserver and a callback
 * lost to a layout jump.
 */
function sweep() {
  const pending = document.querySelectorAll(
    `.reveal:not([${VISIBLE}]), .stagger:not([${VISIBLE}])`,
  );

  for (const element of pending) {
    if (element.getBoundingClientRect().top < window.innerHeight) {
      reveal(element);
    }
  }
}

let sweepBound = false;

function bindSweep() {
  if (sweepBound) return;
  sweepBound = true;

  window.addEventListener("load", sweep, { once: true });
  // A late sweep catches anything the observer missed during hydration.
  window.setTimeout(sweep, 1200);
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || element.hasAttribute(VISIBLE)) return;

    const io = getObserver();

    if (!io) {
      // No IntersectionObserver at all — show everything rather than gamble.
      reveal(element);
      return;
    }

    io.observe(element);
    bindSweep();

    return () => io.unobserve(element);
  }, []);

  return ref;
}
