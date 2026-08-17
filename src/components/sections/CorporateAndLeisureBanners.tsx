import Image from "next/image";
import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { photo, photoBlur } from "@/lib/images";
import { getServices } from "@/lib/content/services";
import { cn } from "@/lib/utils";

/**
 * Two large photo banners for the services that carry real photography
 * (corporate-travel, leisure-packages) rather than the plain icon treatment
 * every other service gets in ServicesSection — pulled from the same
 * `services` table (see src/lib/content/services.ts), filtered to whichever
 * rows have an `image` set. Renders nothing if neither is present, so this
 * section never leaves an empty gap on the page.
 */
export async function CorporateAndLeisureBanners() {
  const services = (await getServices()).filter((service) => service.image);

  if (services.length === 0) return null;

  return (
    <Section tone="ink">
      <Container>
        <SectionHeading
          onDark
          eyebrow="Beyond the itinerary"
          title="Two more ways we can help"
          lede="Not every trip is a bespoke circuit planned from scratch — some need a company account, others just a good template to start from."
        />

        <Stagger
          as="ul"
          className={cn(
            "mt-16 grid grid-cols-1 gap-8 lg:mt-20",
            services.length > 1 ? "sm:grid-cols-2" : "sm:max-w-xl",
          )}
        >
          {services.map((service) => (
            <StaggerItem as="li" key={service.slug}>
              <Link
                href={`/services#${service.slug}`}
                className="group block focus-visible:outline-offset-4"
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-paper-3">
                  <Image
                    src={photo(service.image!, 1200)}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={photoBlur(service.image!)}
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                  <div className="photo-scrim-soft absolute inset-0" aria-hidden="true" />

                  <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                    <h3 className="font-display text-2xl text-paper sm:text-[1.75rem]">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-[38ch] text-paper/80">{service.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-brass-light">
                      How it works
                      <Icon
                        name="arrow-up-right"
                        size={16}
                        className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
