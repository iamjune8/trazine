import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/Reveal";
import { DestinationCard } from "@/components/DestinationCard";
import { ButtonLink } from "@/components/ui/Button";
import { getFeaturedDestinations } from "@/lib/content/destinations";

/**
 * The homepage destination grid.
 *
 * Deliberately mixes both tiers in one grid rather than splitting into two
 * sections here — that fuller treatment belongs to /destinations. Each card
 * carries a small tier pill instead, so a reader scanning the homepage still
 * sees the Premium/Easy distinction without the page committing to it twice.
 *
 * Cards enter as a wave rather than all at once — an 80ms stagger reads as one
 * considered movement, where a simultaneous fade reads as a page that simply
 * appeared. Every card lazy-loads: they sit below a full-bleed hero, so none
 * of them can be the LCP element.
 */
export async function DestinationsShowcase() {
  const featuredDestinations = await getFeaturedDestinations();

  return (
    <Section id="destinations">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Where we work"
            title="Two ways to travel, as many countries as you like"
            lede="Grand European circuits for the trip that deserves two weeks, or easy, affordable escapes across Asia and the Gulf for the one that doesn't. Both planned with the same care."
            className="md:max-w-2xl"
          />
          <Reveal delay={0.15} className="shrink-0">
            <ButtonLink href="/destinations" variant="outline" withArrow>
              All destinations
            </ButtonLink>
          </Reveal>
        </div>

        <Stagger
          as="ul"
          className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
          {featuredDestinations.map((destination) => (
            <StaggerItem as="li" key={destination.slug}>
              <DestinationCard destination={destination} showTier />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
