"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Service } from "@/data/services";

/**
 * Concept services section for /demo/redesign. The live ServicesSection uses
 * a bordered box grid; this version drops the boxes for a numbered
 * two-column list, closer in spirit to the "Four things we will not
 * compromise on" list already on the About page, so the demo's visual
 * language has an internal reference point rather than inventing a fourth
 * unrelated pattern. Real service copy, same data as the live grid.
 */
export function RedesignServices({ services }: { services: Service[] }) {
  const reduced = useReducedMotion();

  return (
    <section className="border-t border-line bg-paper-2 py-20 sm:py-28">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8 lg:px-12">
        <motion.h2
          className="font-display max-w-lg text-[length:var(--step-h2)] text-ink"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Everything between the idea and the boarding gate.
        </motion.h2>

        <ul className="mt-16 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
          {services.map((service, i) => (
            <motion.li
              key={service.slug}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-line pt-6"
            >
              <span className="font-display text-2xl text-brass" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-4 text-[length:var(--step-h3)] text-ink">
                {service.title}
              </h3>
              <p className="mt-3 max-w-prose text-ink-2">{service.summary}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
