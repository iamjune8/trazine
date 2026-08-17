import type { Metadata } from "next";
import { AirportHero } from "@/components/sections/AirportHero";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Airport hero — concept demo",
  robots: { index: false, follow: false },
};

/**
 * Standalone review route for a proposed new homepage hero — not linked
 * from any nav, not wired into the live homepage. Exists purely so the
 * scroll concept can be scrolled through and judged before anyone commits
 * to building it for real. See AirportHero.tsx for the implementation.
 */
export default function AirportHeroDemoPage() {
  return (
    <>
      <AirportHero />

      <section className="border-t border-line bg-paper-2 px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Concept demo</p>
          <h2 className="font-display mt-4 text-[length:var(--step-h2)] text-ink">
            A first pass at a new homepage hero
          </h2>
          <p className="prose-body mt-5 text-ink-2">
            The clip above plays once on load — muted, no controls — and holds on its last frame
            rather than looping, with a slow continuous zoom and a light cinematic grade and
            grain over the top. Nothing here is wired into the live homepage — this route exists
            only so the concept can be reviewed before it&apos;s built for real.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/" variant="outline">
              Back to the live homepage
            </ButtonLink>
            <ButtonLink href="/destinations" variant="ghost" withArrow>
              See the real destinations
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
