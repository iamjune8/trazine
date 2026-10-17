import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { photo } from "@/lib/images";
import { jsonLdScript } from "@/lib/utils";
import { whatsappLink } from "@/data/site";
import { getDestinations } from "@/lib/content/destinations";
import { getSiteSettings } from "@/lib/content/siteSettings";
import { MediaHeader } from "@/components/sections/MediaHeader";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TrackedExternalButton } from "@/components/ui/TrackedExternalButton";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { Icon, type IconName } from "@/components/ui/Icon";

export const metadata: Metadata = pageMetadata({
  title: "Become a B2B Travel Partner",
  description:
    "An IATA-accredited B2B partner for associates who sell international trips: land packages across Europe, Asia and the Gulf, plus visa processing assistance.",
  path: "/b2b-partners",
  image: photo("departureBoardRetro", 1200),
});

export const revalidate = 3600;

type Offer = { icon: IconName; title: string; summary: string; points: string[] };

const offers: Offer[] = [
  {
    icon: "map-route",
    title: "Land packages",
    summary:
      "Itineraries, hotels and on-the-ground arrangements for the trips your customers ask you for, planned by a named consultant.",
    points: [
      "Day-by-day itineraries with hotels named and inclusions listed",
      "Transfers, sightseeing and timed-entry tickets arranged for you",
      "An itemised proposal within one working day",
    ],
  },
  {
    icon: "stamp",
    title: "Visa processing assistance",
    summary:
      "We prepare, check and file the visa file for your customer's trip, so a thin file is never the reason a trip falls through.",
    points: [
      "Schengen, UK and UAE visas prepared and filed",
      "E-visas and eTAs across Southeast Asia, the Maldives, Sri Lanka, Nepal, Thailand and Kenya",
      "Honest timelines, including when the dates are too tight",
    ],
  },
];

const steps = [
  {
    title: "Send us the trip",
    body: "Tell us the destination, the dates and how many are travelling. A WhatsApp message is enough.",
  },
  {
    title: "We reply with an itemised proposal",
    body: "Hotels named, inclusions listed and exclusions stated plainly, within one working day.",
  },
  {
    title: "We file the visa and run the ground",
    body: "Once the trip is confirmed, we handle the visa file and the arrangements on the ground.",
  },
];

const facts = [
  { label: "Accreditation", value: "IATA-accredited" },
  { label: "Trading since", value: "2020" },
  { label: "Customers served", value: "1,000+" },
  { label: "Based in", value: "Mumbai" },
];

export default async function B2BPartnersPage() {
  const [destinations, settings] = await Promise.all([getDestinations(), getSiteSettings()]);
  const tiers = [
    { label: "Premium Luxury", items: destinations.filter((d) => d.tier === "premium") },
    { label: "Easy & Affordable", items: destinations.filter((d) => d.tier !== "premium") },
  ];
  const whatsappHref = whatsappLink(
    settings.whatsapp,
    "Hello, I'd like to know about becoming a B2B partner with Travel Magazine for land packages and visa support.",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { label: "Home", href: "/" },
              { label: "B2B partners", href: "/b2b-partners" },
            ]),
          ),
        }}
      />
      <MediaHeader
        image="departureBoardRetro"
        imageAlt="A split-flap departures board"
        eyebrow="B2B partners"
        title="Become a B2B partner"
        lede="Land packages and visa processing support for associates who sell international trips to their own customers."
        breadcrumb={[{ label: "Home", href: "/" }]}
        breadcrumbLabel="B2B partners"
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="What we provide"
            title="Land packages and visas, handled for you"
          />
          <Stagger className="mt-14 grid gap-10 md:grid-cols-2">
            {offers.map((offer) => (
              <StaggerItem key={offer.title}>
                <div className="h-full border border-line bg-paper-2 p-8 sm:p-10">
                  <Icon name={offer.icon} size={28} className="text-brass" />
                  <h3 className="font-display mt-6 text-[length:var(--step-h3)] text-ink">
                    {offer.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-ink-2">{offer.summary}</p>
                  <ul className="mt-6 space-y-3 text-ink-2">
                    {offer.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <Icon name="check" size={16} className="mt-1.5 shrink-0 text-brass" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section tone="paper-2">
        <Container>
          <SectionHeading
            eyebrow="Where we can take your customers"
            title="Two catalogues, planned country by country"
            lede="Each destination page shows what we plan there. Ask us about anything that isn't listed."
          />
          <div className="mt-14 grid gap-12 md:grid-cols-2">
            {tiers.map((tier) => (
              <Reveal key={tier.label}>
                <p className="eyebrow">{tier.label}</p>
                <ul className="mt-5 flex flex-wrap gap-3">
                  {tier.items.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/destinations/${d.slug}`}
                        className="inline-block border border-line-2 px-4 py-2 text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper"
                      >
                        {d.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="How it works" title="Three steps, one point of contact" />
          <Stagger className="mt-14 grid gap-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <StaggerItem key={step.title}>
                <p className="font-display text-5xl text-brass/60">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 text-xl font-medium text-ink">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-2">{step.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section tone="paper-2" className="!py-16 sm:!py-20">
        <Container>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-brass-deep">
                  {fact.label}
                </dt>
                <dd className="font-display mt-3 text-2xl text-ink sm:text-3xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section tone="ink">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="eyebrow eyebrow-on-dark">Partner with us</p>
            <h2 className="font-display mt-6 text-[length:var(--step-h1)] text-paper">
              Let&apos;s talk about working together.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-paper/75">
              Message us your city and the destinations your customers ask for most. Rates and
              terms are shared directly with partners who get in touch.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <TrackedExternalButton
                href={whatsappHref}
                event="whatsapp_click"
                data={{ source: "b2b-partners" }}
                size="lg"
                variant="on-dark"
              >
                <span className="inline-flex items-center gap-2.5">
                  <Icon name="whatsapp" size={17} />
                  WhatsApp us
                </span>
              </TrackedExternalButton>
              <TrackedAnchor
                href={`mailto:${settings.email}?subject=${encodeURIComponent("B2B partner enquiry")}`}
                event="email_click"
                data={{ source: "b2b-partners" }}
                className="inline-flex min-h-[54px] items-center justify-center gap-2.5 px-6 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-paper/80 transition-colors duration-200 hover:text-paper"
              >
                <Icon name="mail" size={17} />
                Email us
              </TrackedAnchor>
            </div>
            <p className="mt-8 text-sm text-paper/50">
              Or call{" "}
              <TrackedAnchor
                href={settings.phoneHref}
                event="call_click"
                data={{ source: "b2b-partners" }}
                className="link-underline text-brass-light transition-colors duration-200"
              >
                {settings.phone}
              </TrackedAnchor>{" "}
              &middot; {settings.hours}
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
