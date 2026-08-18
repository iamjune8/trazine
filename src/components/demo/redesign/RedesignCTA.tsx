"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { EnquireButton } from "@/components/enquiry/EnquireButton";
import { TrackedExternalButton } from "@/components/ui/TrackedExternalButton";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { Icon } from "@/components/ui/Icon";
import { photo, photoBlur } from "@/lib/images";
import { site, whatsappLink } from "@/data/site";

/**
 * Concept closing CTA for /demo/redesign. Same real functional touchpoints
 * as the live CTABand (glass enquire button, WhatsApp, phone, hours) — those
 * already work and aren't what's being explored here. What's different is
 * the composition: a different real photograph and a fade-up entrance,
 * bookending the page with the same asymmetric-over-photo language the hero
 * opened with.
 */
export function RedesignCTA() {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Image
        src={photo("dubaiSkyline", 2000)}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        quality={70}
        placeholder="blur"
        blurDataURL={photoBlur("dubaiSkyline")}
        className="object-cover opacity-40"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <motion.div
          className="max-w-xl"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-[length:var(--step-h1)] text-paper">
            Tell us where you would like to go.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-paper/75">
            One conversation, and you will have an itinerary with the
            reasoning attached, hotels named, inclusions listed, exclusions
            stated plainly.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <EnquireButton size="lg" glass source="redesign-demo-cta" withArrow>
              Start planning
            </EnquireButton>
            <TrackedExternalButton
              href={whatsappLink("Hello, I'd like to plan an international trip.")}
              event="whatsapp_click"
              data={{ source: "redesign-demo-cta" }}
              size="lg"
              variant="ghost"
              className="px-6 text-paper/80 hover:text-paper sm:px-6"
            >
              <span className="inline-flex items-center gap-2.5">
                <Icon name="whatsapp" size={17} />
                WhatsApp us
              </span>
            </TrackedExternalButton>
          </div>

          <p className="mt-8 text-sm text-paper/50">
            Or call{" "}
            <TrackedAnchor
              href={site.phoneHref}
              event="call_click"
              data={{ source: "redesign-demo-cta" }}
              className="link-underline text-brass-light transition-colors duration-200"
            >
              {site.phone}
            </TrackedAnchor>{" "}
            &middot; {site.hours}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
