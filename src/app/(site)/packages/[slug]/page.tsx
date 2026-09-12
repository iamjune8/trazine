import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Container, Section } from "@/components/ui/Layout";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { PackagePanel } from "@/components/packages/PackagePanel";
import { PackageBookingCard } from "@/components/packages/PackageBookingCard";
import { PackageHeroImage } from "@/components/packages/PackageHeroImage";
import { getPackages, getPackage, getActivePackages } from "@/lib/content/packages";
import { getDestination } from "@/lib/content/destinations";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { jsonLdScript } from "@/lib/utils";
import { photo, photoBlur } from "@/lib/images";
import { PackageFAQSection, RelatedPackagesRail } from "@/components/packages/PackageGuide";
import { CTABand } from "@/components/sections/CTABand";
import { site } from "@/data/site";

type Params = { params: Promise<{ slug: string }> };

// On-demand revalidation is skipped entirely in the admin actions (it can
// time out on Hostinger's shared hosting during form submission — see
// revalidatePackages() in actions.ts), so this is the only mechanism that
// refreshes a package page after an edit. Kept short so admin changes
// (including new departure dates) surface quickly instead of within the
// hour.
export const revalidate = 60;

export async function generateStaticParams() {
  const packages = await getPackages();
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) return { title: "Package not found" };

  return pageMetadata({
    title: `${pkg.name} — ${pkg.nightsSummary} package`,
    description: `${pkg.name}, ${pkg.nightsSummary}, ex-${pkg.departureCity}. Flights, stay and sightseeing included — starting at ${pkg.basePrice.toLocaleString("en-IN")} ${pkg.currency} per person.`,
    path: `/packages/${pkg.slug}`,
    image: pkg.heroImage || undefined,
  });
}

function formatMoney(amount: number, currency: string) {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function PackagePage({ params }: Params) {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg || !pkg.active) notFound();

  const [destination, allActivePackages] = await Promise.all([
    pkg.destinationSlug ? getDestination(pkg.destinationSlug) : Promise.resolve(undefined),
    getActivePackages(),
  ]);

  // Any un-sold-out departure with seats means the package is genuinely
  // bookable right now; an empty departures list also counts as in-stock —
  // it just means no dates are published yet, not that the package is dead.
  // Deliberately no AggregateRating/Review here — this site has no real
  // review data to attach to a package, and fabricating one is exactly the
  // kind of fake structured data Google's spam policies penalise.
  const hasAvailableDeparture =
    pkg.departures.length === 0 ||
    pkg.departures.some((d) => !d.soldOut && d.seatsLeft > 0);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pkg.name,
    description: pkg.overview || `${pkg.name}, ${pkg.nightsSummary}, ex-${pkg.departureCity}.`,
    image: pkg.heroImage
      ? pkg.heroImage.startsWith("http")
        ? pkg.heroImage
        : `${site.url}${pkg.heroImage}`
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${site.url}/packages/${pkg.slug}`,
      priceCurrency: pkg.currency,
      price: pkg.basePrice,
      availability: hasAvailableDeparture
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { label: "Home", href: "/" },
              { label: "Packages", href: "/packages" },
              { label: pkg.name, href: `/packages/${pkg.slug}` },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(productJsonLd) }}
      />
      <Section className="pb-16 pt-32 sm:pb-20 sm:pt-40">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-ink-3">
            <Link href="/" className="transition-colors duration-200 hover:text-ink">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <Link href="/packages" className="transition-colors duration-200 hover:text-ink">
              Packages
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span aria-current="page" className="text-ink">
              {pkg.name}
            </span>
          </nav>

          {/* ── Summary card + booking rail ── */}
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                {pkg.heroImage ? (
                  <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden bg-ink-3">
                    <PackageHeroImage
                      src={pkg.heroImage}
                      alt={pkg.name}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      priority
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="border border-line-2 bg-paper">
                  <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-start sm:justify-between sm:p-8">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="font-display text-[length:var(--step-h2)] text-ink">
                          {pkg.name}
                        </h1>
                        {pkg.departureCode ? (
                          <span className="border border-line-2 bg-paper-2 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.1em] text-ink-2">
                            {pkg.departureCode}
                          </span>
                        ) : null}
                      </div>
                      {pkg.routeLabel ? (
                        <p className="mt-2 text-ink-2">{pkg.routeLabel}</p>
                      ) : null}
                    </div>

                    <div className="shrink-0 border-t border-line-2 pt-5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0 sm:text-right">
                      <p className="text-xs uppercase tracking-[0.14em] text-ink-3">
                        Starting at
                      </p>
                      <p className="font-display mt-1 text-3xl text-brass-deep">
                        {formatMoney(pkg.basePrice, pkg.currency)}
                      </p>
                      <p className="text-sm text-ink-3">per person</p>
                    </div>
                  </div>

                  <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-line px-7 py-5 sm:px-8">
                    {pkg.flightsIncluded ? (
                      <li className="flex items-center gap-2 text-sm text-ink-2">
                        <Icon name="check" size={16} className="text-success" />
                        Flights included
                      </li>
                    ) : (
                      <li className="flex items-center gap-2 text-sm text-ink-2">
                        <Icon name="suitcase" size={16} className="text-ink-3" />
                        Land package — flights not included
                      </li>
                    )}
                    <li className="flex items-center gap-2 text-sm text-ink-2">
                      <Icon name="check" size={16} className="text-success" />
                      Stay included
                    </li>
                    <li className="flex items-center gap-2 text-sm text-ink-2">
                      <Icon name="check" size={16} className="text-success" />
                      Sightseeing included
                    </li>
                  </ul>
                </div>
              </Reveal>

              {/* ── Gallery — the linked destination's own photo set, so a
                  package page shows more than the single hero image without
                  needing separate photos entered per package. Local catalogue
                  files only (no Unsplash), same as everywhere else on the
                  site. ── */}
              {destination && destination.gallery.length > 0 ? (
                <Reveal delay={0.02} className="mt-6">
                  <Stagger
                    as="ul"
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                  >
                    {destination.gallery.map((key, index) => (
                      <StaggerItem
                        as="li"
                        key={key}
                        className="relative aspect-[4/3] overflow-hidden bg-paper-3"
                      >
                        <Image
                          src={photo(key, 700)}
                          alt={`${destination.name} — photograph ${index + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 19vw"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL={photoBlur(key)}
                          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05]"
                        />
                      </StaggerItem>
                    ))}
                  </Stagger>
                </Reveal>
              ) : null}

              {/* ── Overview, highlights, who it suits ── */}
              {pkg.overview || pkg.highlights.length > 0 || pkg.idealTraveller ? (
                <Reveal delay={0.03} className="mt-6">
                  <PackagePanel title="Overview" icon="compass" accent="brass">
                    {pkg.overview ? (
                      <p className="text-ink-2">{pkg.overview}</p>
                    ) : null}

                    {pkg.highlights.length > 0 ? (
                      <ul className={pkg.overview ? "mt-6 space-y-2.5" : "space-y-2.5"}>
                        {pkg.highlights.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-ink-2">
                            <Icon
                              name="check"
                              size={16}
                              className="mt-0.5 shrink-0 text-success"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {pkg.idealTraveller ? (
                      <div className="mt-6 border-t border-line pt-6">
                        <p className="eyebrow">Who this suits</p>
                        <p className="mt-3 text-ink-2">{pkg.idealTraveller}</p>
                      </div>
                    ) : null}

                    {pkg.bestSeason ? (
                      <div className="mt-6 border-t border-line pt-6">
                        <p className="eyebrow">Best season</p>
                        <p className="mt-3 text-ink-2">{pkg.bestSeason}</p>
                      </div>
                    ) : null}
                  </PackagePanel>
                </Reveal>
              ) : null}

              {/* ── Flight details ── */}
              {pkg.flightsIncluded ? (
                <Reveal delay={0.05} className="mt-6">
                  <PackagePanel title="Flight details" icon="plane" accent="info">
                    {pkg.onwardRoute || pkg.returnRoute ? (
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="border border-line-2 bg-paper-2 p-5">
                          <p className="flex items-center gap-2 text-sm font-medium text-ink">
                            <Icon name="plane" size={16} className="text-info" />
                            Onward
                          </p>
                          <p className="mt-3 text-ink">
                            {pkg.flightCarrier} {pkg.onwardFlightNumber}
                          </p>
                          <p className="mt-1 text-ink-2">{pkg.onwardRoute}</p>
                          {pkg.onwardDepartureTime ? (
                            <p className="mt-3 flex items-center gap-2 text-sm text-ink-3">
                              <Icon name="clock" size={14} />
                              Departure: {pkg.onwardDepartureTime}
                            </p>
                          ) : null}
                        </div>
                        <div className="border border-line-2 bg-paper-2 p-5">
                          <p className="flex items-center gap-2 text-sm font-medium text-ink">
                            <Icon name="plane" size={16} className="rotate-180 text-info" />
                            Return
                          </p>
                          <p className="mt-3 text-ink">
                            {pkg.flightCarrier} {pkg.returnFlightNumber}
                          </p>
                          <p className="mt-1 text-ink-2">{pkg.returnRoute}</p>
                          {pkg.returnDepartureTime ? (
                            <p className="mt-3 flex items-center gap-2 text-sm text-ink-3">
                              <Icon name="clock" size={14} />
                              Departure: {pkg.returnDepartureTime}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      // Exact flight numbers/times aren't always set at the
                      // time a package is first published — a plain
                      // carrier line beats showing empty onward/return
                      // fields until a consultant fills those in.
                      <p className="flex items-center gap-2 text-ink-2">
                        <Icon name="plane" size={16} className="text-info" />
                        International and domestic flights included
                        {pkg.flightCarrier ? `, operated by ${pkg.flightCarrier}` : ""}.
                      </p>
                    )}
                  </PackagePanel>
                </Reveal>
              ) : null}

              {/* ── Hotels & meal plan ── */}
              {pkg.hotels.length > 0 ? (
                <Reveal delay={0.08} className="mt-6">
                  <PackagePanel title="Hotels & meal plan" icon="bed" accent="violet">
                    <ul className="space-y-4">
                      {pkg.hotels.map((hotel, i) => (
                        <li
                          key={i}
                          className="flex flex-wrap items-start gap-4 border border-line-2 bg-paper-2 p-5"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet/10 text-violet">
                            <Icon name="bed" size={18} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
                              {hotel.location}
                              {hotel.nights ? (
                                <span className="border border-line-2 bg-paper px-2 py-0.5 text-xs font-medium uppercase tracking-[0.08em] text-ink-2">
                                  {hotel.nights}N
                                </span>
                              ) : null}
                            </p>
                            <p className="mt-1 text-ink-2">
                              {hotel.name}
                              {hotel.room ? ` — ${hotel.room}` : ""}
                            </p>
                            {hotel.meal ? (
                              <p className="mt-2 text-sm text-ink-3">{hotel.meal}</p>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </PackagePanel>
                </Reveal>
              ) : null}

              {/* ── Sightseeing ── */}
              {pkg.sightseeing.length > 0 ? (
                <Reveal delay={0.1} className="mt-6">
                  <PackagePanel title="Sightseeing" icon="map-route" accent="amber">
                    <ul className="space-y-3">
                      {pkg.sightseeing.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <Icon
                            name="check"
                            size={16}
                            className="mt-0.5 shrink-0 text-amber"
                          />
                          <span className="text-ink-2">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </PackagePanel>
                </Reveal>
              ) : null}

              {/* ── Itinerary ── */}
              {pkg.itinerary.length > 0 ? (
                <Reveal delay={0.12} className="mt-6">
                  <PackagePanel title="Itinerary" icon="calendar" accent="indigo">
                    <ol className="space-y-7">
                      {pkg.itinerary.map((day, i) => (
                        <li key={i} className="border-l-2 border-indigo/25 pl-5">
                          <p className="font-display text-lg text-indigo">{day.title}</p>
                          <ul className="mt-2 space-y-1.5">
                            {day.lines.map((line, j) => (
                              <li key={j} className="text-ink-2">
                                {line}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ol>
                  </PackagePanel>
                </Reveal>
              ) : null}

              {/* ── Inclusions / exclusions ── */}
              {(pkg.inclusions.length > 0 || pkg.exclusions.length > 0) ? (
                <Reveal delay={0.14} className="mt-6 border border-line-2 bg-paper p-7 sm:p-8">
                  <h2 className="font-display text-xl text-ink">Detailed inclusions</h2>
                  <div className="mt-6 grid gap-8 sm:grid-cols-2">
                    <div>
                      <p className="eyebrow flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                          <Icon name="check" size={14} />
                        </span>
                        Inclusions
                      </p>
                      <ul className="mt-4 space-y-2.5">
                        {pkg.inclusions.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-ink-2">
                            <Icon
                              name="check"
                              size={16}
                              className="mt-0.5 shrink-0 text-success"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="eyebrow flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
                          <Icon name="close" size={14} />
                        </span>
                        Exclusions
                      </p>
                      <ul className="mt-4 space-y-2.5">
                        {pkg.exclusions.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-ink-2">
                            <Icon
                              name="close"
                              size={16}
                              className="mt-0.5 shrink-0 text-danger"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              ) : null}

              {/* ── Payment & cancellation ── */}
              {(pkg.paymentTerms.length > 0 || pkg.cancellationTerms.length > 0) ? (
                <Reveal delay={0.16} className="mt-6">
                  <PackagePanel title="Payment & cancellation policy" icon="receipt" accent="teal">
                    <div className="grid gap-8 sm:grid-cols-2">
                      {pkg.paymentTerms.length > 0 ? (
                        <div>
                          <p className="eyebrow">Payment policy</p>
                          <ul className="mt-4 space-y-2 text-ink-2">
                            {pkg.paymentTerms.map((term, i) => (
                              <li key={i}>&bull; {term}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {pkg.cancellationTerms.length > 0 ? (
                        <div>
                          <p className="eyebrow">Cancellation policy</p>
                          <ul className="mt-4 space-y-2 text-ink-2">
                            {pkg.cancellationTerms.map((term, i) => (
                              <li key={i}>&bull; {term}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </PackagePanel>
                </Reveal>
              ) : null}

              {/* ── Travel tips ── */}
              {pkg.travelTips.length > 0 ? (
                <Reveal delay={0.18} className="mt-6">
                  <PackagePanel title="Travel tips" icon="sparkle" accent="rose">
                    <ul className="space-y-3">
                      {pkg.travelTips.map((tip) => (
                        <li key={tip} className="flex items-start gap-2.5 text-ink-2">
                          <Icon
                            name="check"
                            size={16}
                            className="mt-0.5 shrink-0 text-rose"
                          />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </PackagePanel>
                </Reveal>
              ) : null}
            </div>

            {/* ── Booking rail ── */}
            <div className="lg:col-span-5">
              <Reveal delay={0.05} className="lg:sticky lg:top-28">
                <PackageBookingCard
                  packageName={pkg.name}
                  departureCode={pkg.departureCode}
                  slug={pkg.slug}
                  departureCity={pkg.departureCity}
                  departureAirportCode={pkg.departureAirportCode}
                  flightsIncluded={pkg.flightsIncluded}
                  basePrice={pkg.basePrice}
                  currency={pkg.currency}
                  departures={pkg.departures}
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <PackageFAQSection packageName={pkg.name} faqs={pkg.faqs} />

      <RelatedPackagesRail
        currentSlug={pkg.slug}
        destinationName={destination?.name}
        destinationSlug={pkg.destinationSlug}
        packages={allActivePackages}
      />

      <CTABand
        image={pkg.heroImage || "aircraftWing"}
        eyebrow="Ready to go"
        title={`Let's confirm your ${pkg.name} dates.`}
        body="Pick a departure, tell us who's travelling, and a consultant confirms availability within one working day."
        destination={destination?.name ?? pkg.name}
        source={`package-cta-${pkg.slug}`}
      />
    </>
  );
}
