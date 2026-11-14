import type { Metadata } from "next";
import Link from "next/link";

import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { PackageCard } from "@/components/packages/PackageCard";
import { getActivePackages } from "@/lib/content/packages";
import { getSiteSettings } from "@/lib/content/siteSettings";
import { pageCard } from "@/lib/ogCards";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { jsonLdScript } from "@/lib/utils";
import { photo } from "@/lib/images";
import { packageAudiences } from "@/data/packageAudiences";

export async function generateMetadata(): Promise<Metadata> {
  const { showPackagePrices } = await getSiteSettings();

  return pageMetadata({
    title: "Fixed departure packages",
    description: `${showPackagePrices ? "Priced, dated" : "Dated"} tour packages with flights, stay and sightseeing bundled in — pick a departure and enquire.`,
    path: "/packages",
    image: pageCard("packages", "Travel Magazine Tours & Travels — Fixed departure packages ready to book."),
  });
}

const breadcrumb = [{ label: "Home", href: "/" }];

// On-demand revalidation is skipped entirely in the admin actions (it can
// time out on Hostinger's shared hosting during form submission — see
// revalidatePackages() in actions.ts), so this is the only mechanism that
// refreshes this listing after an edit. Kept short so admin changes surface
// quickly instead of within the hour.
export const revalidate = 60;

export default async function PackagesPage() {
  const [packages, { showPackagePrices }] = await Promise.all([
    getActivePackages(),
    getSiteSettings(),
  ]);

  return (
    <Section className="pt-32 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([...breadcrumb, { label: "Packages", href: "/packages" }]),
          ),
        }}
      />
      <Container>
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ink-3">
          <Link href="/" className="transition-colors duration-200 hover:text-ink">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span aria-current="page" className="text-ink">
            Packages
          </span>
        </nav>

        <SectionHeading
          as="h1"
          eyebrow="Fixed departures"
          title="Packages ready to book"
          lede={`Flights, stay and sightseeing bundled ${showPackagePrices ? "into one price" : "together"}, with real departure dates and seat counts — pick one and enquire, and we confirm it within a working day.`}
        />
        <div className="prose-body mt-10 max-w-3xl text-lg text-ink-2">
          <p>
            Fixed departures are group trips with set dates, a set itinerary and a
            limited number of seats. They suit travellers who would rather not plan
            every detail, and they make it easy to compare what is included before
            you commit. Each package lists its departure dates and the flights, stay
            and sightseeing that come with it.
          </p>
          <p>
            Enquire about any departure and we confirm within a working day, with
            the hotels named and any extras stated plainly. If none of the listed
            dates suit you, tell us your dates and the people travelling, and we can
            look at a private itinerary instead.
          </p>
        </div>

        <section className="mt-20" aria-labelledby="who-its-for">
          <h2 id="who-its-for" className="font-display text-[length:var(--step-h2)]">
            Which trip suits your group?
          </h2>
          <p className="mt-5 max-w-3xl text-lg text-ink-2">
            The same destinations can feel very different depending on who is
            travelling. Find the group that sounds like yours.
          </p>
          <ul className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {packageAudiences.map((audience) => (
              <li key={audience.slug} className="flex flex-col">
                <div className="aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo(audience.image, 800)}
                    alt={audience.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-display mt-6 text-2xl text-ink">{audience.title}</h3>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-brass-deep">
                  {audience.forWhom}
                </p>
                <p className="mt-4 text-ink-2">{audience.body}</p>
                <ul className="mt-5 space-y-2 text-ink-2">
                  {audience.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span aria-hidden="true" className="text-brass">—</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link href={audience.cta.href} className="link-underline mt-6 self-start text-brass-deep">
                  {audience.cta.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

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

        <div className="mt-20 max-w-3xl">
          <h2 className="font-display text-[length:var(--step-h2)]">Common questions</h2>
          <dl className="mt-8 space-y-8 text-ink-2">
            <div>
              <dt className="font-display text-xl text-ink">What is included?</dt>
              <dd className="mt-2">Each package lists its flights, stay and sightseeing. We name the hotels in our reply to your enquiry, and state any extras that are not covered.</dd>
            </div>
            <div>
              <dt className="font-display text-xl text-ink">How quickly will I hear back?</dt>
              <dd className="mt-2">We confirm within one working day. Include your travel dates, the number of people and your budget range, so the reply is specific.</dd>
            </div>
            <div>
              <dt className="font-display text-xl text-ink">What if none of the departures suit me?</dt>
              <dd className="mt-2">Tell us your dates and we will look at a private itinerary built around them. Our Kurla West office is open to visitors during working hours.</dd>
            </div>
          </dl>
        </div>
      </Container>
    </Section>
  );
}
