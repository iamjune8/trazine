"use client";

import { motion, useReducedMotion } from "motion/react";
import { Accordion } from "@/components/ui/Accordion";
import type { Faq } from "@/data/faqs";

/**
 * Concept FAQ for /demo/redesign. The accordion widget itself already works
 * well (progressive disclosure is the right pattern for this content) — the
 * only change from the live FAQSection is dropping the eyebrow and giving
 * the question column more editorial breathing room, consistent with the
 * rest of this page's near-zero-eyebrow treatment.
 */
export function RedesignFAQ({ faqs }: { faqs: Faq[] }) {
  const reduced = useReducedMotion();

  return (
    <section className="border-t border-line bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            className="lg:col-span-4"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-[length:var(--step-h2)] text-ink">
              The questions we get most.
            </h2>
            <p className="mt-4 max-w-xs text-ink-2">
              If yours is not here, call us. We would rather answer it
              properly than have you guess.
            </p>
          </motion.div>

          <motion.div
            className="lg:col-span-7 lg:col-start-6"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Accordion items={faqs} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
