import Link from "next/link";

import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal } from "@/components/motion/Reveal";
import { EnquireButton } from "@/components/enquiry/EnquireButton";
import { TrackedExternalButton } from "@/components/ui/TrackedExternalButton";
import { Icon } from "@/components/ui/Icon";
import type { SeoSection } from "@/data/destinationSeo";

/**
 * A titled block of labelled points (how a trip is built, or what moves its
 * price) that ends on links to the next page a reader needs and on an
 * enquiry. No fixed price is ever published here: the cost variant lists what
 * moves the number, and the enquiry is how a reader gets one.
 */
export function DestinationCost({
  destinationName,
  slug,
  section,
  sectionKey,
  tone = "paper-2",
  whatsappHref,
}: {
  destinationName: string;
  slug: string;
  section: SeoSection;
  /** Distinguishes this block in enquiry and click tracking. */
  sectionKey: "plan" | "cost";
  tone?: "paper" | "paper-2";
  /** When set, a WhatsApp button sits beside the enquiry button. */
  whatsappHref?: string;
}) {
  const source = `destination-${slug}-${sectionKey}`;

  return (
    <Section tone={tone}>
      <Container>
        <SectionHeading eyebrow={section.eyebrow} title={section.title} lede={section.lede} />

        <Reveal delay={0.1} className="mt-12">
          <dl className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            {section.items.map((item) => (
              <div key={item.label} className="border-t border-line-2 pt-5">
                <dt className="font-display text-xl text-ink">{item.label}</dt>
                <dd className="mt-2 text-ink-2">{item.text}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.15} className="mt-12 max-w-3xl">
          <p className="text-lg text-ink-2">{section.closing}</p>

          {section.links.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-underline text-brass-deep">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <EnquireButton destination={destinationName} source={source} withArrow>
              {section.cta ?? "Get an itemised proposal"}
            </EnquireButton>

            {whatsappHref ? (
              <TrackedExternalButton
                href={whatsappHref}
                event="whatsapp_click"
                data={{ source, destination: destinationName }}
                conversionLabel={process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP}
                variant="outline"
              >
                <span className="inline-flex items-center gap-2.5">
                  <Icon name="whatsapp" size={17} />
                  WhatsApp us
                </span>
              </TrackedExternalButton>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
