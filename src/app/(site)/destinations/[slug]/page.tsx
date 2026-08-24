import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import { MediaHeader } from "@/components/sections/MediaHeader";
import { CTABand } from "@/components/sections/CTABand";
import { DestinationCard } from "@/components/DestinationCard";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { EnquireButton } from "@/components/enquiry/EnquireButton";
import { TrackedExternalButton } from "@/components/ui/TrackedExternalButton";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { Icon } from "@/components/ui/Icon";
import { photo, photoBlur } from "@/lib/images";
import { getDestinations, getDestination } from "@/lib/content/destinations";
import { site, whatsappLink } from "@/data/site";

type Params = { params: Promise<{ slug: string }> };

// The "this month / next month" weather cards read off the server's current
// date, so this page can't stay static forever the way most content pages
// can — without a refresh window it would freeze on whatever month it was
// last built or revalidated and silently go stale at every month boundary.
export const revalidate = 3600;

/**
 * The right-hand code and city shown opposite BOM on the facts box's
 * boarding-pass strip. Real IATA codes for every single-country page;
 * "EUROPE" for the merged circuit, which has no one gateway airport.
 */
const ROUTE_CODES: Record<string, { code: string; city: string }> = {
  europe: { code: "EUROPE", city: "Multiple cities" },
  dubai: { code: "DXB", city: "Dubai" },
  bali: { code: "DPS", city: "Denpasar" },
  vietnam: { code: "HAN", city: "Hanoi" },
  malaysia: { code: "KUL", city: "Kuala Lumpur" },
  singapore: { code: "SIN", city: "Singapore" },
  maldives: { code: "MLE", city: "Malé" },
  "sri-lanka": { code: "CMB", city: "Colombo" },
  nepal: { code: "KTM", city: "Kathmandu" },
};

/**
 * Every destination known at build time prerenders as static HTML; the admin
 * panel's saves call revalidatePath on the affected page (and this one gets
 * re-rendered on the next request), so edits go live without a redeploy.
 */
export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((destination) => ({ slug: destination.slug }));
}

/**
 * Google displays roughly the first 155-160 characters of a meta description
 * before truncating — a plain `.slice()` to that length routinely cuts mid-word
 * (e.g. "...so neither do we anymore. Wherev"), which reads as broken in search
 * results. This trims back to the last full word instead.
 */
function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) return { title: "Destination not found" };

  // "from India" matches how this audience actually searches (confirmed
  // against how TravelTriangle/MakeMyTrip/Thomas Cook title their own
  // destination pages) — "from Mumbai" narrows the query to one city, and
  // Mumbai is already established elsewhere on the page (BOM code, address).
  const title = `${destination.name} Tour Packages from India`;
  const description = truncateAtWord(
    `${destination.tagline}. ${destination.intro}`,
    155,
  );

  return {
    title,
    description,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: {
      title: `${destination.name} — ${destination.tagline}`,
      description,
      images: [{ url: photo(destination.heroImage, 1200) }],
    },
  };
}

export default async function DestinationPage({ params }: Params) {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) notFound();

  const allDestinations = await getDestinations();

  // Same-tier destinations are the more useful cross-sell — a Premium reader
  // is more likely to want another circuit than an Easy getaway, and vice
  // versa — so we fill from the current tier first and only top up from the
  // other one if this tier doesn't have three others.
  const sameTier = allDestinations.filter(
    (d) => d.slug !== destination.slug && d.tier === destination.tier,
  );
  const otherTier = allDestinations.filter(
    (d) => d.slug !== destination.slug && d.tier !== destination.tier,
  );
  const others = [...sameTier, ...otherTier].slice(0, 3);

  const tierLabel = destination.tier === "premium" ? "Premium Luxury" : "Easy & Affordable";

  // Index 0 = January, so this reads straight off the current server date —
  // no month-name matching, and it naturally wraps December → January.
  const thisMonthIndex = new Date().getMonth();
  const nextMonthIndex = (thisMonthIndex + 1) % 12;
  const thisMonthClimate = destination.monthlyClimate[thisMonthIndex];
  const nextMonthClimate = destination.monthlyClimate[nextMonthIndex];

  return (
    <>
      <MediaHeader
        image={destination.heroImage}
        imageAlt={`${destination.name} — ${destination.tagline}`}
        eyebrow={destination.region}
        title={destination.name}
        lede={destination.tagline}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Destinations", href: "/destinations" },
          {
            label: tierLabel,
            href: `/destinations#${destination.tier}`,
          },
        ]}
        facts={destination.facts.slice(0, 3)}
      />

      {/* ── Editorial: the case for the place, with a sticky enquiry rail ── */}
      <Section>
        <Container>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="font-display text-[length:var(--step-h3)] leading-[1.4] text-ink">
                  {destination.intro}
                </p>
              </Reveal>

              <Reveal delay={0.1} className="prose-body mt-10 text-lg text-ink-2">
                {destination.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </Reveal>

              <Reveal delay={0.15} className="mt-12">
                <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink-3">
                  Particularly good for
                </h2>
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {destination.idealFor.map((item) => (
                    <li
                      key={item}
                      className="border border-line-2 px-4 py-2 text-sm text-ink-2"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Enquiry rail — sticks alongside the copy on desktop, sits inline
                on mobile where sticky elements only steal viewport height. */}
            <div className="lg:col-span-4 lg:col-start-9">
              <Reveal delay={0.2} className="lg:sticky lg:top-28">
                <div className="border border-line-2 bg-paper-2 p-8">
                  <p className="eyebrow">Enquire</p>
                  <h2 className="font-display mt-4 text-2xl">
                    A {destination.name} journey, built for your dates
                  </h2>
                  <p className="mt-4 text-ink-2">
                    Tell us who is travelling and roughly when. You will have an
                    itemised proposal within one working day.
                  </p>
                  <p className="mt-3 text-sm text-ink-3">
                    No price listed here on purpose — hotel category, season and
                    group size move the cost more than the destination does. Tell
                    us the basics and it comes back itemised, not guessed.
                  </p>

                  <EnquireButton
                    destination={destination.name}
                    source={`destination-${destination.slug}`}
                    className="mt-7 w-full"
                    withArrow
                  >
                    Plan this journey
                  </EnquireButton>

                  <TrackedExternalButton
                    href={whatsappLink(
                      `Hello, I'd like to plan a trip to ${destination.name}.`,
                    )}
                    event="whatsapp_click"
                    data={{ source: `destination-${destination.slug}`, destination: destination.name }}
                    variant="outline"
                    className="mt-3 w-full"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Icon name="whatsapp" size={17} />
                      WhatsApp
                    </span>
                  </TrackedExternalButton>

                  {/* Boarding-pass strip — the route this itinerary actually
                      flies, in the same monospace/dashed-rule language as a
                      real ticket stub, built entirely from existing tokens. */}
                  <div className="mt-8 border-t border-dashed border-line-2 pt-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-mono text-lg tracking-[0.06em] text-ink">BOM</p>
                        <p className="mt-0.5 text-[0.625rem] uppercase tracking-[0.16em] text-ink-3">
                          Mumbai
                        </p>
                      </div>
                      <Icon
                        name="plane"
                        size={16}
                        className="shrink-0 text-brass"
                        aria-hidden="true"
                      />
                      <div className="text-right">
                        <p className="font-mono text-lg tracking-[0.06em] text-ink">
                          {(ROUTE_CODES[destination.slug] ?? ROUTE_CODES.dubai).code}
                        </p>
                        <p className="mt-0.5 text-[0.625rem] uppercase tracking-[0.16em] text-ink-3">
                          {(ROUTE_CODES[destination.slug] ?? ROUTE_CODES.dubai).city}
                        </p>
                      </div>
                    </div>

                    <dl className="relative mt-6 space-y-4 border-t border-dashed border-line-2 pt-6">
                      <span
                        className="absolute -left-2 top-0 h-3 w-3 -translate-y-1/2 rounded-full bg-paper"
                        aria-hidden="true"
                      />
                      <span
                        className="absolute -right-2 top-0 h-3 w-3 -translate-y-1/2 rounded-full bg-paper"
                        aria-hidden="true"
                      />
                      {destination.facts.map((fact) => (
                        <div key={fact.label}>
                          <dt className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-ink-3">
                            {fact.label}
                          </dt>
                          <dd className="mt-1 text-sm text-ink">{fact.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <p className="mt-7 text-sm text-ink-3">
                    Or call{" "}
                    <TrackedAnchor
                      href={site.phoneHref}
                      event="call_click"
                      data={{ source: `destination-${destination.slug}`, destination: destination.name }}
                      className="link-underline text-brass-deep"
                    >
                      {site.phone}
                    </TrackedAnchor>
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Gallery ── */}
      <Section tone="paper-2" className="py-16 sm:py-20 lg:py-24">
        <Container size="wide">
          <Stagger
            as="ul"
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            {destination.gallery.map((key, index) => (
              <StaggerItem
                as="li"
                key={key}
                className="relative aspect-[3/4] overflow-hidden bg-paper-3"
              >
                <Image
                  src={photo(key, 900)}
                  alt={`${destination.name} — photograph ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={photoBlur(key)}
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05]"
                />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ── Places within this circuit — the "what's actually here" section ── */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow={destination.places.length > 1 ? "Inside this circuit" : "Inside this trip"}
            title={
              destination.places.length > 1
                ? `What each country brings to ${destination.name}`
                : `What ${destination.name} brings together`
            }
            lede="Where each stop sits in the itinerary, and the handful of places within it worth building a day around."
          />

          <Stagger
            as="ul"
            className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2"
          >
            {destination.places.map((place) => (
              <StaggerItem as="li" key={place.name}>
                <div className="relative aspect-[3/2] overflow-hidden bg-paper-3">
                  <Image
                    src={photo(place.image, 1000)}
                    alt={`${place.name} — ${place.blurb}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={photoBlur(place.image)}
                    className="object-cover"
                  />
                </div>

                <h3 className="font-display mt-6 text-2xl text-ink">{place.name}</h3>
                <p className="mt-3 text-ink-2">{place.blurb}</p>

                <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                  {place.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <Icon
                        name="check"
                        size={15}
                        className="mt-1 shrink-0 text-brass"
                      />
                      <span className="text-ink-2">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ── What we arrange ── */}
      <Section tone="paper-2">
        <Container>
          <SectionHeading
            eyebrow="What we arrange"
            title={`The ${destination.name} we actually book`}
            lede="Not an exhaustive list of everything possible — the handful of things we think are worth building days around."
          />

          <Stagger as="ol" className="mt-16 border-t border-line">
            {destination.experiences.map((experience, index) => (
              <StaggerItem
                as="li"
                key={experience.title}
                className="grid gap-4 border-b border-line py-9 sm:grid-cols-12 sm:gap-8"
              >
                <span
                  className="font-display text-xl text-brass sm:col-span-1"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[length:var(--step-h3)] text-ink sm:col-span-4">
                  {experience.title}
                </h3>
                <p className="text-ink-2 sm:col-span-7">{experience.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ── When to go ── */}
      <Section tone="ink">
        <Container>
          <SectionHeading
            onDark
            eyebrow="When to go"
            title="Honest seasons, written for departures out of India"
            lede="Including the months we would talk you out of."
          />

          {thisMonthClimate && nextMonthClimate ? (
            <Stagger as="div" className="mt-16 grid gap-px bg-line-dark sm:grid-cols-2">
              <StaggerItem
                as="div"
                className="flex items-start gap-4 bg-ink p-8 lg:p-9"
              >
                <Icon name="sun" size={22} className="mt-1 shrink-0 text-brass-light" />
                <div>
                  <p className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-paper/50">
                    {thisMonthClimate.month} — this month
                  </p>
                  <p className="font-display mt-2 text-2xl text-paper">
                    {thisMonthClimate.tempRange}
                  </p>
                  <p className="mt-2 text-paper/70">{thisMonthClimate.condition}</p>
                </div>
              </StaggerItem>
              <StaggerItem
                as="div"
                className="flex items-start gap-4 bg-ink p-8 lg:p-9"
              >
                <Icon name="calendar" size={22} className="mt-1 shrink-0 text-brass-light" />
                <div>
                  <p className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-paper/50">
                    {nextMonthClimate.month} — next month
                  </p>
                  <p className="font-display mt-2 text-2xl text-paper">
                    {nextMonthClimate.tempRange}
                  </p>
                  <p className="mt-2 text-paper/70">{nextMonthClimate.condition}</p>
                </div>
              </StaggerItem>
            </Stagger>
          ) : null}

          <Stagger as="ul" className="mt-8 grid gap-px bg-line-dark lg:grid-cols-3">
            {destination.seasons.map((season) => (
              <StaggerItem as="li" key={season.window} className="bg-ink p-8 lg:p-9">
                <h3 className="font-display text-2xl text-brass-light">
                  {season.window}
                </h3>
                <p className="mt-5 text-paper/70">{season.note}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ── Onward ── */}
      <Section>
        <Container>
          <SectionHeading eyebrow="Also worth a look" title="Other journeys" />
          <Stagger
            as="ul"
            className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {others.map((other) => (
              <StaggerItem as="li" key={other.slug}>
                <DestinationCard destination={other} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CTABand
        image={destination.gallery[0] ?? destination.heroImage}
        eyebrow="Start here"
        title={`Let's plan your ${destination.name} journey.`}
        body="One conversation, then an itinerary with the reasoning attached — hotels named, inclusions listed, exclusions stated plainly."
        destination={destination.name}
        source={`destination-cta-${destination.slug}`}
      />
    </>
  );
}
