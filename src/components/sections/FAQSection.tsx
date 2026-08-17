import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { Reveal } from "@/components/motion/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { getFaqs } from "@/lib/content/faqs";

/**
 * Frequently asked questions — progressive disclosure, plus FAQPage structured
 * data so the answers can surface directly in search results.
 */
export async function FAQSection({ tone = "paper" }: { tone?: "paper" | "paper-2" }) {
  const faqs = await getFaqs();

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
    <Section tone={tone} id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Before you ask"
              title="The questions we get most"
              lede="If yours isn't here, call us — we would rather answer it properly than have you guess."
            />
          </div>
          <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
