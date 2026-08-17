import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { approach } from "@/data/services";

/**
 * How the company works — a three-step promise beside a photograph that
 * drifts gently against the scroll. The parallax is small (8%) on purpose:
 * enough to give the column depth, not enough to notice as an effect.
 */
export function Approach() {
  return (
    <Section tone="paper-2">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="How we work"
              title="Three conversations, and then we take it from you"
              lede="Most of what makes an international trip stressful happens before departure. That is the part we take on."
            />

            <Reveal delay={0.2} className="mt-12 hidden lg:block">
              <ParallaxImage
                image="planningFlatlay"
                alt="A map, notebook and camera laid out while planning a route"
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
                className="border-t border-line-2 py-9 first:pt-0 last:pb-0"
              >
                <div className="flex gap-6 sm:gap-10">
                  <span
                    className="font-display shrink-0 text-2xl text-brass sm:text-3xl"
                    aria-hidden="true"
                  >
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-display text-[length:var(--step-h3)] text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-prose text-ink-2">{item.body}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
