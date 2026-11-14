import type { Metadata } from "next";

import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { photo } from "@/lib/images";
import { jsonLdScript } from "@/lib/utils";
import { MediaHeader } from "@/components/sections/MediaHeader";
import { CTABand } from "@/components/sections/CTABand";
import { GuideCard } from "@/components/guides/GuideCard";
import { Container, Section } from "@/components/ui/Layout";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { guides } from "@/data/guides";

export const metadata: Metadata = pageMetadata({
  title: "Travel Guides for Indian Travellers",
  description:
    "Plain, sourced guides to Schengen visas and planning a first Europe trip from India, from a Mumbai travel house that files the visas and books the tickets.",
  path: "/guides",
  image: photo("planningFlatlay", 1200),
});

export default function GuidesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { label: "Home", href: "/" },
              { label: "Guides", href: "/guides" },
            ]),
          ),
        }}
      />
      <MediaHeader
        image="planningFlatlay"
        imageAlt="A map, notebook and camera laid out on a desk"
        eyebrow="Guides"
        title="Plain answers before you book"
        lede="The parts of international travel that trip people up, explained from Mumbai. Sourced where the rules are official, and clear about what is our judgement."
        breadcrumb={[{ label: "Home", href: "/" }]}
        breadcrumbLabel="Guides"
      />

      <Section>
        <Container>
          <div className="prose-body mx-auto mb-16 max-w-3xl text-lg text-ink-2">
            <p>
              Most of what travellers ask us before they book comes down to a few
              questions: how long a Schengen visa takes, what the paperwork
              looks like, how many countries a first Europe trip should include,
              and how to tell a realistic itinerary from one that will have you
              on a coach at five in the morning. These guides answer those
              questions in plain language.
            </p>
            <p>
              Where a rule comes from an official source, we say so and point to
              it. Where a point is our own judgement from planning trips, we label
              it that way. Each guide ends with the next step, in case you would
              rather we handled it for you.
            </p>
          </div>
          <Stagger className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <StaggerItem key={guide.slug}>
                <GuideCard guide={guide} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CTABand
        eyebrow="Still unsure?"
        title="Ask us the question directly."
        body="If your trip doesn't fit a guide, tell us the dates and the people travelling. You'll get an honest answer on what's achievable."
        source="guides-index"
      />
    </>
  );
}
