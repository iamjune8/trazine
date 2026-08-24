import type { Metadata } from "next";

import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { PackageCard } from "@/components/packages/PackageCard";
import { getActivePackages } from "@/lib/content/packages";

export const metadata: Metadata = {
  title: "Fixed departure packages",
  description:
    "Priced, dated tour packages with flights, stay and sightseeing bundled in — pick a departure and enquire.",
  alternates: { canonical: "/packages" },
};

// Revalidate every hour so package changes appear within 60 minutes without
// explicit on-demand revalidation (which can timeout on Hostinger). This acts
// as a safety net alongside the admin's explicit revalidatePath() calls.
export const revalidate = 3600;

export default async function PackagesPage() {
  const packages = await getActivePackages();

  return (
    <Section className="pt-32 sm:pt-40">
      <Container>
        <SectionHeading
          eyebrow="Fixed departures"
          title="Packages ready to book"
          lede="Flights, stay and sightseeing bundled into one price, with real departure dates and seat counts — pick one and enquire, and we confirm it within a working day."
        />

        {packages.length === 0 ? (
          <p className="mt-16 text-ink-2">No packages published yet — check back soon.</p>
        ) : (
          <Stagger
            as="ul"
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {packages.map((pkg) => (
              <StaggerItem as="li" key={pkg.slug}>
                <PackageCard pkg={pkg} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Container>
    </Section>
  );
}
