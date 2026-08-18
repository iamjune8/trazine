"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Testimonial } from "@/data/testimonials";

/**
 * Concept testimonials for /demo/redesign — a horizontal scroll-snap row
 * rather than the live site's single-item auto-rotating carousel, so both
 * compositions can be judged side by side. Real testimonials (same data as
 * the live carousel), no invented quotes.
 *
 * Scroll-snap is native CSS, not a JS carousel library — nothing to clean
 * up, works with touch/trackpad/keyboard for free. Cards get real feedback
 * (`active:scale-[0.98]`) since they're the interactive element here; the
 * row's own entrance is a single whileInView fade (purpose: preventing a
 * jarring appearance on scroll — not decoration on data the reader is
 * trying to read, so it fires once and stops).
 */
export function RedesignTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const reduced = useReducedMotion();

  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-line bg-paper-2 py-20 sm:py-28">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8 lg:px-12">
        <motion.h2
          className="font-display max-w-md text-[length:var(--step-h2)] text-ink"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          People who already made the trip.
        </motion.h2>
      </div>

      <motion.div
        className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="w-[85vw] shrink-0 snap-start border border-line-2 bg-paper p-8 transition-transform duration-200 ease-out active:scale-[0.98] sm:w-[26rem]"
          >
            <p className="font-display line-clamp-3 text-xl leading-[1.4] text-ink">
              {testimonial.quote}
            </p>
            <div className="mt-6 border-t border-line pt-5">
              <p className="font-medium text-ink">{testimonial.name}</p>
              <p className="mt-0.5 text-sm text-ink-3">
                {testimonial.role} &middot; {testimonial.trip}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
