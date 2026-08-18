import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Container, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { PackagePanel } from "@/components/packages/PackagePanel";
import { PackageBookingCard } from "@/components/packages/PackageBookingCard";
import { getPackages, getPackage } from "@/lib/content/packages";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const packages = await getPackages();
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) return { title: "Package not found" };

  return {
    title: `${pkg.name} — ${pkg.nightsSummary} package`,
    description: `${pkg.name}, ${pkg.nightsSummary}, ex-${pkg.departureCity}. Flights, stay and sightseeing included — starting at ${pkg.basePrice.toLocaleString("en-IN")} ${pkg.currency} per person.`,
    alternates: { canonical: `/packages/${pkg.slug}` },
  };
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

  return (
    <>
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
          </nav>

          {/* ── Summary card + booking rail ── */}
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                {pkg.heroImage ? (
                  <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden bg-ink-3">
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin-pasted URL from any host */}
                    <img
                      src={pkg.heroImage}
                      alt={pkg.name}
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
                    <li className="flex items-center gap-2 text-sm text-ink-2">
                      <Icon name="check" size={16} className="text-success" />
                      Flights included
                    </li>
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

              {/* ── Flight details ── */}
              <Reveal delay={0.05} className="mt-6">
                <PackagePanel title="Flight details" icon="plane">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="border border-line-2 bg-paper-2 p-5">
                      <p className="flex items-center gap-2 text-sm font-medium text-ink">
                        <Icon name="plane" size={16} className="text-brass-deep" />
                        Onward
                      </p>
                      <p className="mt-3 text-ink">
                        {pkg.flightCarrier} {pkg.onwardFlightNumber}
                      </p>
                      <p className="mt-1 text-ink-2">{pkg.onwardRoute}</p>
                      <p className="mt-3 flex items-center gap-2 text-sm text-ink-3">
                        <Icon name="clock" size={14} />
                        Departure: {pkg.onwardDepartureTime}
                      </p>
                    </div>
                    <div className="border border-line-2 bg-paper-2 p-5">
                      <p className="flex items-center gap-2 text-sm font-medium text-ink">
                        <Icon name="plane" size={16} className="rotate-180 text-brass-deep" />
                        Return
                      </p>
                      <p className="mt-3 text-ink">
                        {pkg.flightCarrier} {pkg.returnFlightNumber}
                      </p>
                      <p className="mt-1 text-ink-2">{pkg.returnRoute}</p>
                      <p className="mt-3 flex items-center gap-2 text-sm text-ink-3">
                        <Icon name="clock" size={14} />
                        Departure: {pkg.returnDepartureTime}
                      </p>
                    </div>
                  </div>
                </PackagePanel>
              </Reveal>

              {/* ── Hotels & meal plan ── */}
              {pkg.hotels.length > 0 ? (
                <Reveal delay={0.08} className="mt-6">
                  <PackagePanel title="Hotels & meal plan" icon="bed">
                    <ul className="space-y-4">
                      {pkg.hotels.map((hotel, i) => (
                        <li
                          key={i}
                          className="flex flex-wrap items-start gap-4 border border-line-2 bg-paper-2 p-5"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line-2 bg-paper text-ink-3">
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
                  <PackagePanel title="Sightseeing" icon="map-route">
                    <ul className="space-y-3">
                      {pkg.sightseeing.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <Icon
                            name="check"
                            size={16}
                            className="mt-0.5 shrink-0 text-success"
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
                  <PackagePanel title="Itinerary" icon="calendar">
                    <ol className="space-y-7">
                      {pkg.itinerary.map((day, i) => (
                        <li key={i} className="border-l-2 border-line-2 pl-5">
                          <p className="font-display text-lg text-ink">{day.title}</p>
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
                      <p className="eyebrow">Inclusions</p>
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
                      <p className="eyebrow">Exclusions</p>
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
                  <PackagePanel title="Payment & cancellation policy" icon="receipt">
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
            </div>

            {/* ── Booking rail ── */}
            <div className="lg:col-span-5">
              <Reveal delay={0.05} className="lg:sticky lg:top-28">
                <PackageBookingCard
                  packageName={pkg.name}
                  slug={pkg.slug}
                  departureCity={pkg.departureCity}
                  departureAirportCode={pkg.departureAirportCode}
                  basePrice={pkg.basePrice}
                  currency={pkg.currency}
                  departures={pkg.departures}
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
