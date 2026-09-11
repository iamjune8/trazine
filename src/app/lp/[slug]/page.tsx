import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LpHeader } from "@/components/lp/LpHeader";
import { LpFooter } from "@/components/lp/LpFooter";
import { LpHero } from "@/components/lp/LpHero";
import { LpStickyBar } from "@/components/lp/LpStickyBar";
import { LpEnquiryForm } from "@/components/lp/LpEnquiryForm";
import { LpFaqAccordion } from "@/components/lp/LpFaqAccordion";
import { StatsBand } from "@/components/sections/StatsBand";
import { Icon } from "@/components/ui/Icon";
import { getDestination } from "@/lib/content/destinations";
import { photo } from "@/lib/images";
import { pageMetadata, truncateAtWord } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

/**
 * The six destinations this Google Ads launch is built for. A deliberately
 * fixed, short list — not "every destination gets a /lp/ page" — because
 * these pages exist to match specific ad campaigns (see
 * docs/google-ads-implementation-guide.md), not to duplicate the whole
 * destinations catalogue under a second URL.
 */
const AD_LANDING_SLUGS = ["dubai", "thailand", "bali", "japan", "europe", "vietnam"] as const;

export async function generateStaticParams() {
  return AD_LANDING_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!AD_LANDING_SLUGS.includes(slug as (typeof AD_LANDING_SLUGS)[number])) {
    return { title: "Not found" };
  }

  const destination = await getDestination(slug);
  if (!destination) return { title: "Not found" };

  const title = `${destination.name} Tour Packages From India — Get a Free Itinerary`;
  const description = truncateAtWord(
    `${destination.tagline}. Tell us your dates and group size — a named consultant sends back a costed, itemised ${destination.name} proposal within one working day.`,
    155,
  );

  return pageMetadata({
    title,
    description,
    path: `/lp/${slug}`,
    // Points search engines at the full organic destination page rather
    // than this trimmed paid-traffic version, so the two don't compete as
    // near-duplicate content — see the doc comment on pageMetadata().
    canonicalPath: `/destinations/${slug}`,
    image: photo(destination.heroImage, 1200),
  });
}

export default async function LandingPage({ params }: Params) {
  const { slug } = await params;
  if (!AD_LANDING_SLUGS.includes(slug as (typeof AD_LANDING_SLUGS)[number])) {
    notFound();
  }

  const destination = await getDestination(slug);
  if (!destination) notFound();

  const source = `lp-${slug}`;

  return (
    <>
      <LpHeader />

      <main>
        <LpHero
          destinationName={destination.name}
          tagline={destination.tagline}
          heroImage={destination.heroImage}
          source={source}
        />

        <StatsBand />

        {/* Why us — trimmed to the handful of facts that matter for a
            first decision, not the full site's editorial "the case for the
            place" copy. */}
        <section className="border-t border-line bg-paper py-16 sm:py-20">
          <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
            <p className="eyebrow">Particularly good for</p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {destination.idealFor.map((item) => (
                <li
                  key={item}
                  className="border border-line-2 px-4 py-2 text-sm text-ink-2"
                >
                  {item}
                </li>
              ))}
            </ul>

            {destination.facts.length > 0 ? (
              <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-3">
                {destination.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-ink-3">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 text-sm text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </section>

        {/* Enquiry — the one thing this page exists to collect. */}
        <section id="enquiry" className="border-t border-line bg-paper-2 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-md px-5 sm:px-8">
            <p className="eyebrow text-center">Start here</p>
            <h2 className="font-display mt-4 text-center text-[length:var(--step-h2)] text-ink">
              Plan your {destination.name} trip
            </h2>
            <p className="mt-3 text-center text-ink-2">
              Two minutes of your time — the itinerary is our work from here.
            </p>

            <div className="mt-9">
              <LpEnquiryForm destination={destination.name} source={source} />
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-ink-3">
              <Icon name="shield" size={14} className="text-brass" />
              We never pass your details on.
            </p>
          </div>
        </section>

        <LpFaqAccordion faqs={destination.faqs ?? []} />
      </main>

      <LpFooter />
      <LpStickyBar destination={destination.name} source={source} />
    </>
  );
}
