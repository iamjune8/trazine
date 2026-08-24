"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  m,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { Icon } from "@/components/ui/Icon";
import type { Testimonial } from "@/data/testimonials";

/**
 * One testimonial at a time — a ghost index number, a word-by-word quote
 * reveal, and an ambient ticker of trip names bleeding behind it — restyled
 * from a generic shadcn "design-testimonial" snippet onto this site's own
 * ink/paper/brass tokens (the source used shadcn's background/foreground/
 * border/accent, none of which exist here) and `motion/react` (the source
 * imported `framer-motion`, a dependency this project carries but never
 * actually uses — every other animation already goes through `motion/react`).
 *
 * `current.company` in the source became `current.trip` here — travel
 * clients don't have companies, but the destination they went on plays the
 * same "small badge above the quote" role. Content is the site's real
 * testimonials (see src/data/testimonials.ts), not the placeholder
 * Linear/Vercel/Stripe quotes in the original.
 *
 * Autoplay pauses on hover/focus and never runs at all under
 * prefers-reduced-motion — the same rule HeroSlideshow.tsx follows, for the
 * same reason: WCAG 2.2.2 requires moving content running longer than five
 * seconds to be pausable, and the prev/next buttons plus hover-pause satisfy
 * that without needing a dedicated play/pause control here (unlike the hero,
 * this carousel isn't the first thing on the page).
 */
export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Mouse position for the ghost number's subtle magnetic drift.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const numberX = useTransform(springX, [-200, 200], [-16, 16]);
  const numberY = useTransform(springY, [-200, 200], [-8, 8]);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(event.clientX - (rect.left + rect.width / 2));
    mouseY.set(event.clientY - (rect.top + rect.height / 2));
  }

  const goNext = () => setActiveIndex((i) => (i + 1) % testimonials.length);
  const goPrev = () => setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (reduced || paused || testimonials.length <= 1) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
    // Restart the countdown from zero on every change, same reasoning as HeroSlideshow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, reduced, paused, testimonials.length]);

  if (testimonials.length === 0) return null;
  const current = testimonials[activeIndex];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative overflow-hidden"
    >
      {/* Oversized ghost index number, bleeding off the left edge. */}
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-3 top-1/2 -translate-y-1/2 select-none text-[7rem] leading-none font-bold tracking-tighter text-ink/[0.04] sm:text-[11rem] lg:-left-6 lg:text-[15rem]"
        style={reduced ? undefined : { x: numberX, y: numberY }}
      >
        <AnimatePresence mode="wait">
          <m.span
            key={activeIndex}
            initial={reduced ? false : { opacity: 0, scale: 0.85, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={reduced ? undefined : { opacity: 0, scale: 1.08, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {String(activeIndex + 1).padStart(2, "0")}
          </m.span>
        </AnimatePresence>
      </m.div>

      <div className="relative flex">
        {/* Vertical label + progress line — dropped below sm, where there's no room for a side column. */}
        <div className="hidden shrink-0 flex-col items-center justify-center border-r border-line pr-8 sm:flex lg:pr-10">
          <span
            className="font-sans text-[0.625rem] uppercase tracking-[0.3em] text-ink-3"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            In their words
          </span>
          <div className="relative mt-7 h-24 w-px bg-line">
            <m.div
              className="absolute left-0 top-0 w-full origin-top bg-brass"
              animate={{ height: `${((activeIndex + 1) / testimonials.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 py-2 sm:pl-10 lg:pl-14">
          {/* Trip badge */}
          <AnimatePresence mode="wait">
            <m.div
              key={activeIndex}
              initial={reduced ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: 16 }}
              transition={{ duration: 0.35 }}
              className="mb-7"
            >
              <span className="inline-flex items-center gap-2 border border-line-2 px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-ink-3">
                <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden="true" />
                {current.trip}
              </span>
            </m.div>
          </AnimatePresence>

          {/* Quote, revealed word by word */}
          <div className="relative mb-10 min-h-[8rem] sm:min-h-[7rem]">
            <AnimatePresence mode="wait">
              <m.blockquote
                key={activeIndex}
                className="font-display text-[1.6rem] leading-[1.35] tracking-tight text-ink sm:text-[2.1rem]"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {current.quote.split(" ").map((word, i) => (
                  <m.span
                    key={i}
                    className="mr-[0.28em] inline-block"
                    variants={
                      reduced
                        ? undefined
                        : {
                            hidden: { opacity: 0, y: 18, rotateX: 90 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              rotateX: 0,
                              transition: {
                                duration: 0.5,
                                delay: i * 0.018,
                                ease: [0.22, 1, 0.36, 1],
                              },
                            },
                            exit: {
                              opacity: 0,
                              y: -8,
                              transition: { duration: 0.18, delay: i * 0.008 },
                            },
                          }
                    }
                  >
                    {word}
                  </m.span>
                ))}
              </m.blockquote>
            </AnimatePresence>
          </div>

          {/* Author + navigation */}
          <div className="flex flex-wrap items-end justify-between gap-6">
            <AnimatePresence mode="wait">
              <m.div
                key={activeIndex}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.35, delay: 0.12 }}
                className="flex items-center gap-4"
              >
                <span className="h-px w-8 bg-brass" aria-hidden="true" />
                <p>
                  <cite className="block not-italic font-medium text-ink">{current.name}</cite>
                  <span className="text-sm text-ink-3">{current.role}</span>
                </p>
              </m.div>
            </AnimatePresence>

            {testimonials.length > 1 ? (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous testimonial"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line-2 text-ink-2 transition-colors duration-200 hover:border-ink hover:text-ink"
                >
                  <Icon name="chevron-left" size={18} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next testimonial"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line-2 text-ink-2 transition-colors duration-200 hover:border-ink hover:text-ink"
                >
                  <Icon name="chevron-right" size={18} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Ambient ticker of trip names, bled to near-invisible — texture, not a message. */}
      {!reduced && testimonials.length > 1 ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden opacity-[0.05]"
        >
          <m.div
            className="flex whitespace-nowrap font-display text-5xl font-bold tracking-tight text-ink sm:text-6xl"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="mx-8">
                {testimonials.map((t) => t.trip).join(" · ")} ·
              </span>
            ))}
          </m.div>
        </div>
      ) : null}
    </div>
  );
}
