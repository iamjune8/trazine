"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The tail of the hero headline, typed and retyped through a short list of
 * phrases — "planned as though we ⟨were coming with you / knew where you'd
 * want to stop / …⟩". Built by hand rather than pulling in a typewriter
 * library, for three reasons specific to this being a hero headline:
 *
 *  1. SSR-safe first paint — state starts at `phrases[0]` in full, not empty.
 *     A typewriter that starts every load from a blank string would mean the
 *     hero's largest text block (almost always the LCP element) is missing
 *     text at first paint, and stays missing until this component hydrates.
 *     Here, with JS absent or slow, the reader just sees a complete,
 *     grammatically correct sentence — the first phrase, permanently.
 *  2. WCAG 2.2.2 (Pause, Stop, Hide) — this text changes on its own, forever,
 *     with no visible pause control. The get-out the spec allows is to never
 *     start the motion for a reader who has asked for less of it, so the
 *     cycle simply never begins under `prefers-reduced-motion`.
 *  3. No new dependency — this is ~40 lines of setTimeout, not worth a
 *     package. `framer-motion` (the reference component's dependency) is the
 *     same library as `motion`, already installed and used elsewhere in this
 *     project under its new import path — but nothing here even needs it,
 *     since typing/deleting is plain text-content changes, not a transform.
 *
 * Screen readers never see the cycling: Hero marks this whole clause
 * `aria-hidden` and exposes one clean, complete sentence via sr-only text
 * instead, so nothing is re-announced every time a character changes.
 */

const TYPE_MS = 42;
const DELETE_MS = 26;
const DWELL_MS = 2600;
const BETWEEN_MS = 300;

export function RotatingClause({
  phrases,
  /** Seconds before this clause's own entrance fades in — continues the
   *  lead-in heading's word-by-word stagger rather than restarting it. */
  delay = 0,
  className,
}: {
  phrases: string[];
  delay?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(phrases[0]);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current || phrases.length <= 1) return;

    // Wait for this clause's own fade-in (800ms, see .animate-rise) plus a
    // comfortable reading pause before the first phrase starts changing.
    const entranceMs = (delay + 0.8) * 1000;
    const readingPauseMs = 2000;

    let stepTimer: ReturnType<typeof setTimeout>;

    function runCycle() {
      let phraseIndex = 0;
      let charIndex = phrases[0].length;
      let deleting = false;

      const tick = () => {
        const current = phrases[phraseIndex];

        if (!deleting) {
          if (charIndex < current.length) {
            charIndex += 1;
            setDisplay(current.slice(0, charIndex));
            stepTimer = setTimeout(tick, TYPE_MS);
          } else {
            stepTimer = setTimeout(() => {
              deleting = true;
              tick();
            }, DWELL_MS);
          }
        } else if (charIndex > 0) {
          charIndex -= 1;
          setDisplay(current.slice(0, charIndex));
          stepTimer = setTimeout(tick, DELETE_MS);
        } else {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          charIndex = 0;
          stepTimer = setTimeout(tick, BETWEEN_MS);
        }
      };

      tick();
    }

    const startTimer = setTimeout(runCycle, entranceMs + readingPauseMs);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(stepTimer);
    };
  }, [phrases, delay]);

  return (
    <span
      // Display type (inline-block vs block) is the caller's call — Hero
      // wants this as its own line, other placements might not — so it's
      // never baked in here, only the animation and colour are.
      className={cn("animate-rise italic text-brass-light", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {display}
      <span className="typewriter-cursor" aria-hidden="true" />
    </span>
  );
}
