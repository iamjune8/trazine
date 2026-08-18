"use client";

import { motion, useReducedMotion } from "motion/react";
import { Counter } from "@/components/motion/Counter";
import { stats } from "@/data/services";

/**
 * Concept stats band for /demo/redesign. The live StatsBand.tsx treats all
 * four figures as equal columns; this version gives the single most
 * emotionally load-bearing number (customers served) visual seniority in an
 * asymmetric grid instead, which is the actual hierarchy a reader has among
 * four otherwise-interchangeable trust signals. No card boxes — spacing and
 * a hairline top border carry the grouping instead.
 *
 * Motion is a staggered whileInView reveal (purpose: hierarchy — the hero
 * figure should register a beat before the rest), reusing the same real
 * Counter component and real figures as the live site.
 */
export function RedesignStats() {
  const reduced = useReducedMotion();
  const [hero, ...rest] = stats;

  return (
    <section className="border-t border-line bg-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-[92rem] grid-cols-1 gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <motion.div
          className="lg:col-span-6"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-none text-brass-deep">
            <Counter value={hero.value} suffix={hero.suffix} />
          </p>
          <p className="mt-4 max-w-xs text-lg text-ink-2">{hero.label}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-6 lg:gap-8">
          {rest.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-line pt-5"
            >
              <p className="font-display text-3xl text-ink sm:text-4xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 max-w-[20ch] text-sm leading-relaxed text-ink-3">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
