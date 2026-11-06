import Link from "next/link";

import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal } from "@/components/motion/Reveal";
import { EnquireButton } from "@/components/enquiry/EnquireButton";
import type { DestinationSeo } from "@/data/destinationSeo";

/**
 * Answers the "how much does X cost" search without publishing a fixed price:
 * lists what moves the number, links to the two guides that cover the next
 * questions a reader has, and ends on an enquiry.
 */
export function DestinationCost({
  destinationName,
  slug,
  cost,
}: {
  destinationName: string;
  slug: string;
  cost: DestinationSeo["cost"];
}) {
  return (
    <Section tone="paper-2">
      <Container>
        <SectionHeading eyebrow={cost.eyebrow} title={cost.title} lede={cost.lede} />

        <Reveal delay={0.1} className="mt-12">
          <dl className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            {cost.drivers.map((driver) => (
              <div key={driver.label} className="border-t border-line-2 pt-5">
                <dt className="font-display text-xl text-ink">{driver.label}</dt>
                <dd className="mt-2 text-ink-2">{driver.text}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.15} className="mt-12 max-w-3xl">
          <p className="text-lg text-ink-2">{cost.closing}</p>
          {cost.links.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {cost.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-underline text-brass-deep">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <EnquireButton
            destination={destinationName}
            source={`destination-${slug}-cost`}
            className="mt-8"
            withArrow
          >
            Get an itemised proposal
          </EnquireButton>
        </Reveal>
      </Container>
    </Section>
  );
}
