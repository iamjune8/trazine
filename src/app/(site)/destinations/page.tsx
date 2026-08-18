import type { Metadata } from "next";

import { MediaHeader } from "@/components/sections/MediaHeader";
import { DestinationCard } from "@/components/DestinationCard";
import { DestinationsElasticGallery } from "@/components/sections/DestinationsElasticGallery";
import { CTABand } from "@/components/sections/CTABand";
import { Container, Section } from "@/components/ui/Layout";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/Reveal";
import { getPremiumDestinations, getEasyDestinations } from "@/lib/content/destinations";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Two ways to travel with us: a Premium Luxury circuit across the whole of Europe, or Easy & Affordable getaways to Dubai, Bali, Thailand, Vietnam, Malaysia, Singapore, the Maldives, Sri Lanka, Nepal and Kenya.",
  alternates: { canonical: "/destinations" },
};

export default async function DestinationsPage() {
  const [premiumDestinations, easyDestinations] = await Promise.all([
    getPremiumDestinations(),
    getEasyDestinations(),
  ]);

  return (
    <>
      <MediaHeader
        image="icelandWaterfall"
        imageAlt="Goðafoss waterfall in Iceland, one stop on the Scandinavian circuit"
        eyebrow="Where we work"
        title="Two ways to travel with us"
        lede="A grand, multi-country circuit through Europe, or a shorter, easier, better-value escape across Asia and the Gulf. Both are planned with the same care — the difference is scale, pace and what the trip asks of your leave balance."
        breadcrumb={[{ label: "Home", href: "/" }]}
        breadcrumbLabel="Destinations"
      />

      <Section className="pb-0! sm:pb-0! lg:pb-0!">
        <Container>
          <Reveal className="max-w-3xl">
            <p className="text-lg leading-relaxed text-ink-2">
              Below are the two shelves of our catalogue. <strong className="font-medium text-ink">Premium Luxury</strong>{" "}
              covers the whole of Europe as one circuit — seventeen countries, routed
              together and narrowed down to the two or three that belong in your trip —
              built for travellers with the time and budget for something grand.{" "}
              <strong className="font-medium text-ink">Easy &amp; Affordable</strong> covers
              Dubai, Bali, Thailand, Vietnam, Malaysia, Singapore, the Maldives, Sri Lanka,
              Nepal and Kenya, each its own destination — short flights, straightforward
              visas, and a holiday that doesn&rsquo;t need two weeks of leave to feel
              complete.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-ink-2">
              Neither is a lesser version of the other. They serve different trips, and we
              plan both with the same itemised, no-surprises approach. You will not find a
              price on either — every journey differs by dates, hotel category and group
              size, so send an enquiry and you&rsquo;ll get a costed proposal instead.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ── Premium Luxury — Europe ─────────────────────────────────────── */}
      <Section tone="ink" id="premium" className="scroll-mt-24">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="eyebrow eyebrow-on-dark">Tier one</p>
            <h2 className="font-display mt-5 text-[length:var(--step-h2)] text-paper">
              Premium Luxury — the whole of Europe, one circuit
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-paper/75">
              One page, seventeen countries, mostly under a single Schengen visa. Ten to
              sixteen nights, two or three bases chosen from wherever in Europe you want to
              go, and the kind of pace where a country gets the days it deserves rather
              than a single rushed stop.
            </p>
          </Reveal>

          <Stagger as="ul" className="mt-16 grid max-w-md grid-cols-1 lg:mt-20">
            {premiumDestinations.map((destination) => (
              <StaggerItem as="li" key={destination.slug}>
                <DestinationCard destination={destination} aspect="aspect-[4/5]" onDark />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ── Easy & Affordable — Asia and the Gulf ───────────────────────── */}
      <Section tone="paper-2" id="easy" className="scroll-mt-24">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Tier two</p>
            <h2 className="font-display mt-5 text-[length:var(--step-h2)] text-ink">
              Easy &amp; Affordable — Asia and the Gulf
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-2">
              Some of the shortest international flights out of Mumbai, straightforward
              paperwork, and a holiday that fits comfortably into a long weekend or a
              single week of leave — without asking you to compromise on where you stay or
              what you see.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-16 lg:mt-20">
            <DestinationsElasticGallery destinations={easyDestinations} />
          </Reveal>
        </Container>
      </Section>

      <CTABand
        image="planningFlatlay"
        eyebrow="Undecided?"
        title="Not sure which tier is right for you?"
        body="Tell us your dates, who is travelling and roughly what the trip should cost. We will tell you honestly which fits — including when the answer is a country from the other list."
        source="destinations-index"
      />
    </>
  );
}
