import type { Metadata } from "next";
import Link from "next/link";

import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { DestinationsShowcase } from "@/components/sections/DestinationsShowcase";
import { Approach } from "@/components/sections/Approach";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CorporateAndLeisureBanners } from "@/components/sections/CorporateAndLeisureBanners";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQSection } from "@/components/sections/FAQSection";
import { DestinationGallerySection } from "@/components/sections/DestinationGallery";
import { CTABand } from "@/components/sections/CTABand";
import { Container, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title:
    "Travel Magazine — Europe tour packages & easy Asia getaways, pan-India",
  description:
    "A travel house designing Premium Luxury circuits across Europe and Easy & Affordable journeys across Asia and the Gulf. Itinerary design, visas filed in-house, IATA ticketing, and one consultant throughout.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <DestinationsShowcase />

      {/* Editorial manifesto — the argument for a small map, made in the
          company's own voice rather than as another feature grid. */}
      <Section>
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
            <Reveal scale className="lg:col-span-5">
              <ParallaxImage
                image="swissAlpineLake"
                alt="An alpine lake and scattered chalets below the Swiss peaks"
                aspect="aspect-[4/5]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </Reveal>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="eyebrow">Our position</p>
                <h2 className="font-display mt-6 text-[length:var(--step-h2)]">
                  A holiday is not a list of places you were briefly present in.
                </h2>
              </Reveal>

              <Reveal delay={0.12} className="prose-body mt-8 text-lg text-ink-2">
                <p>
                  The commonest thing we do is talk people out of things. Out of
                  six countries in eleven nights. Out of the 5am coach that
                  technically covers three cities. Out of the hotel that is
                  cheaper because it is forty minutes from everything you came
                  for.
                </p>
                <p>
                  What replaces it is quieter and, in our experience, remembered
                  far longer: fewer bases, longer stays, and the two or three
                  things in each place that are genuinely worth arranging your
                  day around.
                </p>
              </Reveal>

              <Reveal delay={0.2} className="mt-10">
                <Link
                  href="/about"
                  className="link-underline group inline-flex min-h-[44px] items-center gap-3 font-medium text-brass-deep"
                >
                  More about how we came to work this way
                  <Icon
                    name="arrow-right"
                    size={17}
                    className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Approach />
      <ServicesSection />
      <CorporateAndLeisureBanners />
      <Testimonials />
      <FAQSection />
      <DestinationGallerySection />
      <CTABand />
    </>
  );
}
