"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { EnquireButton } from "@/components/enquiry/EnquireButton";

/**
 * Concept hero for /demo/redesign — an asymmetric split rather than the live
 * site's full-bleed centered treatment, so the two can be compared side by
 * side. Same brand tokens (Playfair Display, ink/paper/brass), pushed harder:
 * the photograph bleeds off three edges instead of sitting behind a scrim,
 * and the copy block carries the full weight of the left column alone.
 *
 * Purpose-led motion only: the headline lines rise in sequence (storytelling
 * — the eye reads line one, then line two), the image scales in from
 * slightly-zoomed (state transition — this is the "reveal" moment of the
 * page), and the CTA settles last (hierarchy — nothing is clickable before
 * the reader knows what they'd be clicking for).
 */
export function RedesignHero() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-[92rem] grid-cols-1 lg:grid-cols-12">
        <div className="relative order-2 flex flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:order-1 lg:col-span-5 lg:px-12 lg:py-0">
          <motion.h1
            className="font-display max-w-md text-[length:var(--step-display)] leading-[1.05] text-ink"
            initial={reduced ? false : "hidden"}
            animate="visible"
          >
            <motion.span
              className="block"
              variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Plan less.
            </motion.span>
            <motion.span
              className="block"
              variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              See more of{" "}
              <em className="font-display italic leading-[1.15] text-brass-deep">
                what matters.
              </em>
            </motion.span>
          </motion.h1>

          <motion.p
            className="prose-body mt-7 max-w-sm text-ink-2"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            A Premium Luxury circuit across Europe, or an easy escape across
            Asia and the Gulf, planned by one consultant, start to finish.
          </motion.p>

          <motion.div
            className="mt-9"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <EnquireButton size="lg" source="redesign-demo" withArrow>
              Start planning
            </EnquireButton>
          </motion.div>
        </div>

        <motion.div
          className="relative order-1 aspect-[4/5] overflow-hidden lg:order-2 lg:col-span-7 lg:aspect-auto lg:min-h-[100dvh]"
          initial={reduced ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/images/destinations/switzerland-hero.jpg"
            alt="An alpine valley in Switzerland, mountains catching early light"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
