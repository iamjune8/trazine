"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/data/heroSlides";

/**
 * Homepage background slideshow.
 *
 * Robustness first: every slide is in the DOM from the first paint, with
 * slide 0 at `opacity: 1` and the rest at `opacity: 0` via a plain CSS class —
 * not an inline style set by JS. So without JavaScript (or before hydration)
 * the hero is a single, complete, correctly-composed photograph, not a blank
 * or half-built carousel. Autoplay, crossfade timing and the dot controls are
 * a layer on top of that, not a precondition for it.
 *
 * Autoplay pauses on hover, on keyboard focus inside the control strip, and
 * whenever the OS requests reduced motion — and is always user-stoppable via
 * the play/pause button, per WCAG 2.2.2 (moving content that starts
 * automatically and runs longer than five seconds must be pausable).
 */

const INTERVAL_MS = 6000;

export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    if (paused || hoverPaused || reducedRef.current) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
    // Restart the countdown from zero on every manual or automatic change,
    // so a click never leaves the next auto-advance seconds away.
  }, [active, paused, hoverPaused, slides.length]);

  function goTo(index: number) {
    setActive(index);
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={() => setHoverPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.key}
          data-active={i === active}
          aria-hidden={i !== active}
          className="hero-slide absolute inset-0"
        >
          <div className="hero-slide-media absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              // Slide 0 is the LCP element; the rest can load lazily and will
              // still be ready well before their turn six seconds in.
              priority={i === 0}
              loading={i === 0 ? undefined : "lazy"}
              sizes="100vw"
              quality={75}
              placeholder="blur"
              className="object-cover object-center"
            />
          </div>
        </div>
      ))}

      {/* Controls: destination dots + a play/pause toggle. Anchored top-right
          rather than near the bottom — the destination rail beneath the copy
          block wraps to a variable number of lines depending on viewport
          width, so anything bottom-anchored risks colliding with it. The top
          corner is clear of content at every breakpoint: only the short
          eyebrow line sits on the left, well below the header. */}
      {slides.length > 1 ? (
        <div className="absolute right-4 top-20 z-10 flex items-center gap-1 rounded-full bg-ink/30 pl-1 pr-2 backdrop-blur-sm sm:right-8 sm:top-24 lg:right-12">
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            aria-pressed={paused}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-paper/80 transition-colors duration-200 hover:text-paper"
          >
            <Icon name={paused ? "play" : "pause"} size={14} />
          </button>

          <ul className="flex items-center" aria-label="Destination photographs">
            {slides.map((slide, i) => (
              <li key={slide.key}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active}
                  aria-label={`Show ${slide.destinationName}`}
                  className="group flex h-11 w-9 cursor-pointer items-center justify-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      i === active
                        ? "w-7 bg-brass-light"
                        : "w-1.5 bg-paper/45 group-hover:bg-paper/75",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
