import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { getServices } from "@/lib/content/services";

/**
 * Services overview. On the homepage this is a summary grid; the /services
 * page repeats the same data in long form, so the two never drift apart.
 */
export async function ServicesSection({
  showAllLink = true,
  tone = "paper",
}: {
  showAllLink?: boolean;
  tone?: "paper" | "paper-2";
}) {
  const services = (await getServices()).filter((service) => !service.image);

  return (
    <Section tone={tone} id="services">
      <Container>
        <SectionHeading
          eyebrow="What we handle"
          title="Everything between the idea and the boarding gate"
          lede="Itinerary, visa, tickets, insurance, transfers, and someone reachable when a train is cancelled at nine at night."
        />

        <Stagger
          as="ul"
          className="mt-16 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <StaggerItem
              as="li"
              key={service.slug}
              className="bg-paper p-8 transition-colors duration-300 hover:bg-paper-2 sm:p-9"
            >
              <span className="flex h-11 w-11 items-center justify-center border border-line-2 text-brass-deep">
                <Icon name={service.icon} size={21} />
              </span>
              <h3 className="font-display mt-7 text-[length:var(--step-h3)] text-ink">
                {service.title}
              </h3>
              <p className="mt-4 text-ink-2">{service.summary}</p>
            </StaggerItem>
          ))}
        </Stagger>

        {showAllLink ? (
          <Reveal delay={0.1} className="mt-12">
            <ButtonLink href="/services" variant="outline" withArrow>
              How each of these works
            </ButtonLink>
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}
