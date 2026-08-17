import { Container } from "@/components/ui/Layout";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { stats } from "@/data/services";

/**
 * Credibility band on the dark surface — placed immediately after the hero so
 * the claim of experience arrives before any request for the reader's details.
 *
 * The numbers count up once on entry; they are rendered as final values on the
 * server, so nothing here depends on JS to be correct.
 */
export function StatsBand() {
  return (
    <section className="bg-ink py-16 text-paper sm:py-20">
      <Container size="wide">
        <Stagger
          as="dl"
          className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <StaggerItem key={stat.label} className="text-center lg:text-left">
              <dd className="font-display text-4xl text-brass-light sm:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mx-auto mt-4 max-w-[22ch] text-sm leading-relaxed text-paper/60 lg:mx-0">
                {stat.label}
              </dt>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
