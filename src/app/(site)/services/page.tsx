import type { Metadata } from "next";

import { MediaHeader } from "@/components/sections/MediaHeader";
import { CTABand } from "@/components/sections/CTABand";
import { FAQSection } from "@/components/sections/FAQSection";
import { ServiceIndexRail } from "@/components/sections/ServiceIndexRail";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Icon } from "@/components/ui/Icon";
import { approach } from "@/data/services";
import { getServices } from "@/lib/content/services";
import { cn } from "@/lib/utils";
import type { PhotoKey } from "@/lib/images";

/**
 * A supporting photo for the services where a real, non-arbitrary visual
 * reference exists — not forced onto all six. Itinerary design and flights
 * both have an obvious frame; on-ground arrangements borrows Dubai's skyline
 * because the copy names Burj Khalifa specifically. `aircraftWing` and
 * `londonBusDusk` are deliberately excluded — both already appear elsewhere
 * on this page (the process section and the closing CTA), and repeating a
 * frame the reader saw thirty seconds ago reads as a stock-photo shortcut
 * rather than a considered choice.
 */
const SERVICE_IMAGES: Partial<Record<string, PhotoKey>> = {
  "itinerary-design": "planningFlatlay",
  "visa-assistance": "officeInterior",
  "flights-ticketing": "londonAerial",
  "on-ground": "dubaiSkyline",
  "corporate-travel": "/images/other/corporate-travel.jpg",
  "leisure-packages": "/images/other/leisure-packages.jpg",
};

export const metadata: Metadata = {
  title: "Services",
  description:
    "Itinerary design, visa assistance across Europe, Asia and the Gulf, IATA-accredited ticketing from Mumbai, travel insurance and forex, on-ground arrangements, and support throughout your journey.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <MediaHeader
        image="/images/other/ticketing.jpg"
        imageAlt="An aircraft wing above the clouds at sunrise"
        eyebrow="What we handle"
        title="Everything between the idea and the boarding gate"
        lede="Most of what makes international travel stressful happens months before departure, in an office, with paperwork. That is the part we take on — and the part we are measured by."
        breadcrumb={[{ label: "Home", href: "/" }]}
        breadcrumbLabel="Services"
      />

      {/* Long-form service list */}
      <Section>
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="hidden lg:col-span-3 lg:block">
              <ServiceIndexRail
                items={services.map((service) => ({
                  slug: service.slug,
                  title: service.title,
                  icon: service.icon,
                }))}
              />
            </div>

            <ul className="space-y-24 lg:col-span-9 lg:space-y-32">
              {services.map((service, index) => {
                const flipped = index % 2 === 1;
                const image = SERVICE_IMAGES[service.slug];

                return (
                  <li
                    key={service.slug}
                    id={service.slug}
                    className="relative scroll-mt-28"
                  >
                    {/* Ghost numeral — a watermark, not a label; the real
                        count lives in the rail and in the small brass digit
                        the rail already shows next to each title. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute -top-6 select-none font-display text-[6rem] leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-line-2)] sm:text-[8rem] lg:-top-10 lg:text-[10rem]",
                        flipped ? "right-0" : "right-0 lg:left-0 lg:right-auto",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-16">
                      <Reveal
                        scale
                        className={cn(
                          "lg:col-span-4",
                          flipped ? "lg:col-start-9" : "lg:col-start-1",
                        )}
                      >
                        {image ? (
                          <ParallaxImage
                            image={image}
                            alt=""
                            aspect="aspect-[4/3]"
                            strength={6}
                            sizes="(max-width: 1024px) 100vw, 24vw"
                            className="mb-7"
                          />
                        ) : null}
                        <span className="flex h-12 w-12 items-center justify-center border border-line-2 text-brass-deep">
                          <Icon name={service.icon} size={22} />
                        </span>
                        <h2 className="font-display mt-7 text-[length:var(--step-h2)] text-ink">
                          {service.title}
                        </h2>
                      </Reveal>

                      <div
                        className={cn(
                          "lg:col-span-7",
                          flipped ? "lg:col-start-1" : "lg:col-start-6",
                        )}
                      >
                        <Reveal
                          delay={0.08}
                          className="border-l-2 border-brass py-1 pl-6 sm:pl-8"
                        >
                          <Icon
                            name="quote"
                            size={26}
                            className="text-brass/35"
                            aria-hidden="true"
                          />
                          <p className="font-display mt-3 text-[length:var(--step-h3)] leading-[1.45] text-ink-2">
                            {service.summary}
                          </p>
                        </Reveal>
                        <Reveal delay={0.14} className="mt-7">
                          <p className="text-lg leading-relaxed text-ink-2">
                            {service.detail}
                          </p>
                        </Reveal>

                        <Stagger as="ul" className="mt-9 border-t border-line">
                          {service.points.map((point) => (
                            <StaggerItem
                              as="li"
                              key={point}
                              className="flex items-start gap-4 border-b border-line py-4"
                            >
                              <Icon
                                name="check"
                                size={17}
                                className="mt-1 shrink-0 text-brass"
                              />
                              <span className="text-ink-2">{point}</span>
                            </StaggerItem>
                          ))}
                        </Stagger>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </Section>

      {/* The process, restated as a promise */}
      <Section tone="ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                onDark
                eyebrow="The process"
                title="What working with us actually looks like"
                lede="No account managers, no ticketing queue, no being passed on once the invoice clears."
              />
              <Reveal delay={0.15} className="mt-12 hidden lg:block">
                <ParallaxImage
                  image="aircraftWing"
                  alt="A wing above cloud at sunrise"
                  aspect="aspect-[5/4]"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                />
              </Reveal>
            </div>

            <Stagger as="ol" className="lg:col-span-6 lg:col-start-7">
              {approach.map((item) => (
                <StaggerItem
                  as="li"
                  key={item.step}
                  className="border-t border-line-dark py-9 first:pt-0 last:pb-0"
                >
                  <div className="flex gap-6 sm:gap-10">
                    <span
                      className="font-display shrink-0 text-2xl text-brass-light sm:text-3xl"
                      aria-hidden="true"
                    >
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-display text-[length:var(--step-h3)] text-paper">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-paper/70">{item.body}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      <FAQSection tone="paper-2" />

      <CTABand
        image="londonBusDusk"
        eyebrow="Start here"
        title="Need only the visa, or only the tickets?"
        body="That is completely fine — plenty of clients come to us for one piece and plan the rest themselves. Tell us what you need and we will quote for exactly that."
        source="services"
      />
    </>
  );
}
