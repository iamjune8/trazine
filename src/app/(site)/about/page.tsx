import type { Metadata } from "next";

import { MediaHeader } from "@/components/sections/MediaHeader";
import { CTABand } from "@/components/sections/CTABand";
import { StatsBand } from "@/components/sections/StatsBand";
import { Testimonials } from "@/components/sections/Testimonials";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Icon } from "@/components/ui/Icon";
import { site, fullAddress } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "A travel house working across two disciplined tiers — Premium Luxury circuits through Europe and Easy & Affordable journeys across Asia and the Gulf — with one named consultant on every trip.",
  alternates: { canonical: "/about" },
};

// Safety net alongside the admin's on-demand revalidatePath() calls: some
// hosts don't reliably honor on-demand revalidation across process restarts,
// so this guarantees admin edits (testimonials, etc.) surface within a
// minute regardless.
export const revalidate = 60;

const principles = [
  {
    title: "Two tiers, known well",
    body: "Not forty scattered destinations — two disciplined catalogues, Premium Luxury and Easy & Affordable, each with a clear reason to exist. Every itinerary is drawn by someone who has walked the route, argued about the hotels, and knows which morning to spend where.",
  },
  {
    title: "Fewer bases, longer stays",
    body: "The commonest thing we do is talk people out of a fifth city. What replaces it — a slower route, an afternoon with nothing scheduled — is what people describe when they tell us about the trip afterwards.",
  },
  {
    title: "Costs stated plainly",
    body: "Every proposal names the hotels, lists what is included and states what is not. If something is excluded because it is genuinely better bought locally, we say so rather than quietly leaving it out.",
  },
  {
    title: "One person, start to finish",
    body: "The consultant who takes your first call plans the trip, files the visa and is reachable while you are travelling. Nobody is handed to a queue once the invoice clears.",
  },
];

export default function AboutPage() {
  return (
    <>
      <MediaHeader
        image="/images/other/about-trust.jpg"
        imageAlt="A globe and a stack of travel guides on a sunlit desk"
        objectPosition="55% 15%"
        eyebrow="About us"
        title="A travel house, not a booking counter"
        lede="We are a small team in Kurla West who spend most of our week on two kinds of journey — grand European circuits and easy, affordable escapes across Asia and the Gulf — and the paperwork that stands between our clients and them."
        breadcrumb={[{ label: "Home", href: "/" }]}
        breadcrumbLabel="About"
      />

      {/* Story */}
      <Section>
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="font-display text-[length:var(--step-h3)] leading-[1.4] text-ink">
                  Travel Magazine began in 2020 with a ticketing desk, a landline
                  and a stubborn view about how much of a holiday should be left
                  to chance.
                </p>
              </Reveal>

              <Reveal delay={0.1} className="prose-body mt-9 text-lg text-ink-2">
                <p>
                  The business grew the way most good ones in this trade do —
                  slowly, and almost entirely by referral. A family we sent to
                  Switzerland told their neighbours. A couple whose Schengen file
                  we rebuilt after a refusal told their office. Today, the
                  majority of the people who walk into our Kurla office were
                  sent by someone we have already travelled.
                </p>
                <p>
                  Along the way we narrowed rather than widened. We used to sell
                  everywhere. We now sell two clear kinds of journey — Premium
                  Luxury circuits across Europe, and Easy &amp; Affordable escapes
                  across Asia and the Gulf — because those are the trips we can
                  speak about from the inside, country by country, and because a
                  recommendation is only worth anything if the person making it
                  knows what they are choosing between.
                </p>
                <p>
                  The rest of the work is unglamorous and it is where most of our
                  hours go: visa files that are right the first time, fares that
                  do not need a day of backtracking, and the handful of tickets —
                  a mountain railway, a studio tour, a sunset deck — that are
                  gone three months before anyone thinks to ask for them.
                </p>
              </Reveal>
            </div>

            <Reveal scale delay={0.15} className="lg:col-span-5 lg:col-start-8">
              <ParallaxImage
                image="officeInterior"
                alt="The studio in Kurla West, glass partitions and quiet meeting rooms"
                aspect="aspect-[4/5]"
                sizes="(max-width: 1024px) 100vw, 38vw"
              />
              <div className="mt-8 border-t border-line-2 pt-7">
                <h2 className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-ink-3">
                  Find us
                </h2>
                <address className="mt-4 space-y-3 not-italic text-ink-2">
                  <p className="flex items-start gap-3">
                    <Icon name="pin" size={17} className="mt-1 shrink-0 text-brass" />
                    <span>{fullAddress}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Icon name="clock" size={17} className="mt-1 shrink-0 text-brass" />
                    <span>{site.hours}</span>
                  </p>
                </address>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <StatsBand />

      {/* Principles */}
      <Section tone="paper-2">
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="Four things we will not compromise on"
          />

          <Stagger as="ul" className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-2">
            {principles.map((principle, index) => (
              <StaggerItem as="li" key={principle.title}>
                <span
                  className="font-display text-2xl text-brass"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-4 text-[length:var(--step-h3)] text-ink">
                  {principle.title}
                </h3>
                <p className="mt-4 max-w-prose text-ink-2">{principle.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Testimonials />

      <CTABand
        image="swissPeaksAboveCloud"
        eyebrow="Say hello"
        title="Come in, or call. Either works."
        body="Most of our clients start with a twenty-minute conversation about dates and budget. No obligation, and nothing is drawn up until we understand what you actually want."
        source="about"
      />
    </>
  );
}
