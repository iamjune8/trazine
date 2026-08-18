"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { photo, photoBlur } from "@/lib/images";
import type { Destination } from "@/data/destinations";

/**
 * Concept destinations grid for /demo/redesign. The live DestinationsShowcase
 * treats every card the same size; this version gives the first featured
 * destination a large lead card (the one the homepage most wants a reader to
 * notice) with the rest following at a smaller, denser scale beside it, a
 * real bento asymmetry rather than a uniform 3-column repeat. Reuses the same
 * real destination data and photography — the card itself already works
 * (see DestinationCard.tsx); what's different here is only the arrangement.
 */
export function RedesignDestinations({ destinations }: { destinations: Destination[] }) {
  const reduced = useReducedMotion();
  const [lead, ...rest] = destinations;
  if (!lead) return null;

  return (
    <section className="border-t border-line bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <motion.h2
            className="font-display max-w-lg text-[length:var(--step-h2)] text-ink"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Two ways to travel, as many countries as you like.
          </motion.h2>
          <ButtonLink href="/destinations" variant="outline" withArrow>
            All destinations
          </ButtonLink>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <DestinationTile destination={lead} large reduced={!!reduced} delay={0.1} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.slice(0, 2).map((destination, i) => (
              <DestinationTile
                key={destination.slug}
                destination={destination}
                reduced={!!reduced}
                delay={0.2 + i * 0.1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DestinationTile({
  destination,
  large = false,
  reduced,
  delay,
}: {
  destination: Destination;
  large?: boolean;
  reduced: boolean;
  delay: number;
}) {
  return (
    <motion.div
      className={large ? "lg:col-span-7" : ""}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/destinations/${destination.slug}`} className="group block">
        <div
          className={`relative overflow-hidden bg-ink-3 ${
            large ? "aspect-[16/11]" : "aspect-[16/10] lg:aspect-[16/9]"
          }`}
        >
          <Image
            src={photo(destination.cardImage ?? destination.heroImage, large ? 1600 : 900)}
            alt={`${destination.name} — ${destination.tagline}`}
            fill
            sizes={large ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 50vw, 30vw"}
            loading="lazy"
            placeholder="blur"
            blurDataURL={photoBlur(destination.cardImage ?? destination.heroImage)}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
          <div className="photo-scrim-soft absolute inset-0" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
            <div>
              <p className="text-[0.625rem] font-medium uppercase tracking-[0.24em] text-brass-light">
                {destination.region}
              </p>
              <h3
                className={`font-display mt-2 text-paper ${large ? "text-3xl sm:text-4xl" : "text-xl"}`}
              >
                {destination.name}
              </h3>
            </div>
            <Icon
              name="arrow-up-right"
              size={large ? 22 : 18}
              className="mb-1 shrink-0 text-brass-light transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
