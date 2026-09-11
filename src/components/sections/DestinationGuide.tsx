import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Accordion } from "@/components/ui/Accordion";
import { PackageCard } from "@/components/packages/PackageCard";
import { jsonLdScript } from "@/lib/utils";
import type {
  ThingToDo,
  ItineraryDay,
  DestinationFaq,
} from "@/data/destinations";
import type { TourPackage } from "@/lib/content/packages";

/**
 * The expanded travel-guide sections for a destination page — things to do,
 * food/shopping, who it suits, adventure activities, a suggested itinerary,
 * travel tips and FAQ. Split out of page.tsx (which was already long before
 * these existed) into one file per the existing convention of grouping
 * closely-related, structurally-similar section components together.
 *
 * Every one of these renders nothing if its data array/string is empty,
 * rather than an empty heading — a destination added before this content
 * existed (or one an admin hasn't finished writing yet) just gets a shorter
 * page instead of a broken-looking gap.
 */

export function GoodToKnow({
  currency,
  language,
  flightTime,
}: {
  currency: string;
  language: string;
  /** e.g. "6–7 hours from Mumbai" — pulled from the destination's own facts,
      not restated here, so there's exactly one source of truth for it. */
  flightTime?: string;
}) {
  if (!currency && !language) return null;

  const items: { icon: IconName; label: string; value: string }[] = [
    ...(currency ? [{ icon: "wallet" as IconName, label: "Currency", value: currency }] : []),
    ...(language ? [{ icon: "globe" as IconName, label: "Language", value: language }] : []),
    ...(flightTime
      ? [{ icon: "plane" as IconName, label: "Flight time", value: flightTime }]
      : []),
  ];

  return (
    <Section className="py-12 sm:py-14">
      <Container>
        <Stagger as="dl" className="grid grid-cols-1 gap-px bg-line sm:grid-cols-3">
          {items.map((item) => (
            <StaggerItem
              as="div"
              key={item.label}
              className="flex items-start gap-4 bg-paper p-6"
            >
              <Icon name={item.icon} size={20} className="mt-1 shrink-0 text-brass" />
              <div>
                <dt className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-ink-3">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-ink">{item.value}</dd>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export function ThingsToDoSection({
  destinationName,
  items,
}: {
  destinationName: string;
  items: ThingToDo[];
}) {
  if (!items?.length) return null;

  return (
    <Section tone="paper-2">
      <Container>
        <SectionHeading
          eyebrow="Beyond the highlights"
          title={`Things to do in ${destinationName}`}
        />
        <Stagger
          as="ul"
          className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <StaggerItem as="li" key={item.title}>
              <h3 className="font-display text-xl text-ink">{item.title}</h3>
              <p className="mt-3 text-ink-2">{item.description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export function FoodAndShopping({
  destinationName,
  food,
  shopping,
}: {
  destinationName: string;
  food: string[];
  shopping: string[];
}) {
  if (!food?.length && !shopping?.length) return null;

  return (
    <Section>
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {food?.length ? (
            <Reveal>
              <p className="eyebrow">Eat</p>
              <h2 className="font-display mt-5 text-[length:var(--step-h3)] text-ink">
                Food in {destinationName}
              </h2>
              <ul className="mt-6 space-y-3">
                {food.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-ink-2">
                    <Icon name="check" size={15} className="mt-1 shrink-0 text-brass" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {shopping?.length ? (
            <Reveal delay={0.1}>
              <p className="eyebrow">Shop</p>
              <h2 className="font-display mt-5 text-[length:var(--step-h3)] text-ink">
                Shopping in {destinationName}
              </h2>
              <ul className="mt-6 space-y-3">
                {shopping.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-ink-2">
                    <Icon name="check" size={15} className="mt-1 shrink-0 text-brass" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

export function TravellerFit({
  destinationName,
  familyFriendly,
  honeymoonSuitable,
  adventureActivities,
}: {
  destinationName: string;
  familyFriendly: string;
  honeymoonSuitable: string;
  adventureActivities: string[];
}) {
  const hasFamily = Boolean(familyFriendly);
  const hasHoneymoon = Boolean(honeymoonSuitable);
  const hasAdventure = Boolean(adventureActivities?.length);

  if (!hasFamily && !hasHoneymoon && !hasAdventure) return null;

  return (
    <Section tone="paper-2">
      <Container>
        <SectionHeading eyebrow="Who this suits" title={`Is ${destinationName} right for your trip?`} />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {hasFamily ? (
            <Reveal className="border border-line-2 bg-paper p-8">
              <Icon name="users" size={22} className="text-brass" />
              <h3 className="font-display mt-4 text-xl text-ink">Family travel</h3>
              <p className="mt-3 text-ink-2">{familyFriendly}</p>
            </Reveal>
          ) : null}

          {hasHoneymoon ? (
            <Reveal delay={0.08} className="border border-line-2 bg-paper p-8">
              <Icon name="sparkle" size={22} className="text-brass" />
              <h3 className="font-display mt-4 text-xl text-ink">Honeymoons</h3>
              <p className="mt-3 text-ink-2">{honeymoonSuitable}</p>
            </Reveal>
          ) : null}

          {hasAdventure ? (
            <Reveal delay={0.16} className="border border-line-2 bg-paper p-8">
              <Icon name="compass" size={22} className="text-brass" />
              <h3 className="font-display mt-4 text-xl text-ink">Adventure</h3>
              <ul className="mt-3 space-y-2">
                {adventureActivities.map((item) => (
                  <li key={item} className="text-ink-2">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

export function SuggestedItinerary({
  destinationName,
  days,
}: {
  destinationName: string;
  days: ItineraryDay[];
}) {
  if (!days?.length) return null;

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="One way to plan it"
          title={`A suggested ${destinationName} itinerary`}
          lede="A realistic starting outline, not a fixed or booked itinerary — your consultant adjusts the pace, order and length once they know your dates."
        />
        <Stagger as="ol" className="mt-14 border-t border-line">
          {days.map((day) => (
            <StaggerItem
              as="li"
              key={day.day}
              className="grid gap-3 border-b border-line py-8 sm:grid-cols-12 sm:gap-8"
            >
              <span className="font-display text-lg text-brass sm:col-span-2">{day.day}</span>
              <h3 className="font-display text-lg text-ink sm:col-span-3">{day.title}</h3>
              <p className="text-ink-2 sm:col-span-7">{day.description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export function TravelTips({ tips }: { tips: string[] }) {
  if (!tips?.length) return null;

  return (
    <Section tone="paper-2">
      <Container>
        <SectionHeading eyebrow="Before you go" title="Travel tips" />
        <Stagger as="ul" className="mt-12 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
          {tips.map((tip) => (
            <StaggerItem as="li" key={tip} className="flex items-start gap-3">
              <Icon name="check" size={15} className="mt-1 shrink-0 text-brass" />
              <span className="text-ink-2">{tip}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export function RelatedPackages({
  destinationName,
  packages,
}: {
  destinationName: string;
  packages: TourPackage[];
}) {
  if (!packages?.length) return null;

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Ready to book"
          title={`${destinationName} packages with real dates`}
          lede="Priced, dated departures — flights, stay and sightseeing already bundled in."
        />
        <Stagger
          as="ul"
          className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {packages.map((pkg) => (
            <StaggerItem as="li" key={pkg.slug}>
              <PackageCard pkg={pkg} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export function DestinationFAQSection({
  destinationName,
  faqs,
}: {
  destinationName: string;
  faqs: DestinationFaq[];
}) {
  if (!faqs?.length) return null;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }}
      />
      <Container size="narrow">
        <SectionHeading
          align="center"
          eyebrow="Questions"
          title={`${destinationName} — frequently asked questions`}
        />
        <Reveal delay={0.1} className="mt-14">
          <Accordion items={faqs} />
        </Reveal>
      </Container>
    </Section>
  );
}
