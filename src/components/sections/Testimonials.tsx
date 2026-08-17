import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { TestimonialCarousel } from "./TestimonialCarousel";
import { getTestimonials } from "@/lib/content/testimonials";

/**
 * Social proof, placed immediately before the closing call to action — the
 * order that converts best: read what happened for someone else, then decide.
 *
 * The card itself is a client island (TestimonialCarousel) for its motion;
 * the heading and data fetch stay server-side, same split as Hero/HeroSlideshow.
 */
export async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <Section tone="paper-2">
      <Container>
        <SectionHeading
          eyebrow="In their words"
          title="What people say once they're home"
        />

        <div className="mt-16">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </Container>
    </Section>
  );
}
