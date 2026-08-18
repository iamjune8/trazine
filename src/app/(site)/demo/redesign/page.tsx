import type { Metadata } from "next";
import { RedesignHero } from "@/components/demo/redesign/RedesignHero";
import { RedesignStats } from "@/components/demo/redesign/RedesignStats";
import { RedesignDestinations } from "@/components/demo/redesign/RedesignDestinations";
import { RedesignServices } from "@/components/demo/redesign/RedesignServices";
import { RedesignTestimonials } from "@/components/demo/redesign/RedesignTestimonials";
import { RedesignFAQ } from "@/components/demo/redesign/RedesignFAQ";
import { RedesignCTA } from "@/components/demo/redesign/RedesignCTA";
import { ButtonLink } from "@/components/ui/Button";
import { getFeaturedDestinations } from "@/lib/content/destinations";
import { getServices } from "@/lib/content/services";
import { getTestimonials } from "@/lib/content/testimonials";
import { getFaqs } from "@/lib/content/faqs";

export const metadata: Metadata = {
  title: "Homepage redesign — concept demo",
  robots: { index: false, follow: false },
};

/**
 * Standalone review route — not linked from any nav, not wired into the
 * live homepage. A full rebuild of the homepage's narrative (hero, stats,
 * destinations, services, testimonials, FAQ, closing CTA) with a bolder,
 * more asymmetric layout language and near-zero eyebrows, on the same real
 * content and brand tokens as the live site, so the two can be compared
 * side by side before anything is decided.
 */
export default async function RedesignDemoPage() {
  const [destinations, services, testimonials, faqs] = await Promise.all([
    getFeaturedDestinations(),
    getServices(),
    getTestimonials(),
    getFaqs(),
  ]);

  return (
    <>
      <RedesignHero />
      <RedesignStats />
      <RedesignDestinations destinations={destinations} />
      <RedesignServices services={services.filter((service) => !service.image)} />
      <RedesignTestimonials testimonials={testimonials} />
      <RedesignFAQ faqs={faqs} />
      <RedesignCTA />

      <section className="border-t border-line bg-paper px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Concept demo</p>
          <h2 className="font-display mt-4 text-[length:var(--step-h2)] text-ink">
            A full rebuild of the homepage
          </h2>
          <p className="prose-body mt-5 text-ink-2">
            Same brand, same real content (destinations, services, stats,
            testimonials, FAQs) as the live homepage — rebuilt with a bolder
            asymmetric layout, near-zero eyebrows, and more choreographed
            scroll motion throughout. Nothing here is wired into the live
            site; this route exists purely for review before anything is
            decided.
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
