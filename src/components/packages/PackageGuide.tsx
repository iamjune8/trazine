import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { PackageCard } from "@/components/packages/PackageCard";
import { jsonLdScript } from "@/lib/utils";
import type { PackageFaq, TourPackage } from "@/lib/content/packages";

/**
 * The package-page sections that sit outside the main two-column detail
 * grid — FAQ (with its own schema) and related packages/destination
 * cross-links. Split from page.tsx for the same reason as
 * DestinationGuide.tsx: keep the page file from growing past what one
 * screen of context can hold, and keep these structurally-similar,
 * closely-related blocks together in one place.
 */

export function PackageFAQSection({
  packageName,
  faqs,
}: {
  packageName: string;
  faqs: PackageFaq[];
}) {
  if (!faqs?.length) return null;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <Section tone="paper-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }}
      />
      <Container size="narrow">
        <SectionHeading
          align="center"
          eyebrow="Questions"
          title={`${packageName} — frequently asked questions`}
        />
        <Reveal delay={0.1} className="mt-14">
          <Accordion items={faqs} />
        </Reveal>
      </Container>
    </Section>
  );
}

export function RelatedPackagesRail({
  currentSlug,
  destinationName,
  destinationSlug,
  packages,
}: {
  currentSlug: string;
  destinationName?: string;
  destinationSlug?: string | null;
  packages: TourPackage[];
}) {
  const others = packages.filter((p) => p.slug !== currentSlug);
  if (!others.length && !destinationSlug) return null;

  return (
    <Section>
      <Container>
        {destinationSlug && destinationName ? (
          <Reveal className="mb-14 border border-line-2 bg-paper-2 p-7 sm:p-8">
            <p className="eyebrow">See the whole destination</p>
            <h2 className="font-display mt-3 text-xl text-ink">
              More on {destinationName}
            </h2>
            <p className="mt-2 text-ink-2">
              Places, experiences, weather and everything else this itinerary is built from.
            </p>
            <Link
              href={`/destinations/${destinationSlug}`}
              className="link-underline mt-4 inline-flex items-center gap-2 font-medium text-brass-deep"
            >
              Explore {destinationName} →
            </Link>
          </Reveal>
        ) : null}

        {others.length > 0 ? (
          <>
            <SectionHeading eyebrow="Also available" title="Other packages" />
            <Stagger
              as="ul"
              className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {others.map((pkg) => (
                <StaggerItem as="li" key={pkg.slug}>
                  <PackageCard pkg={pkg} />
                </StaggerItem>
              ))}
            </Stagger>
          </>
        ) : null}
      </Container>
    </Section>
  );
}
