import { jsonLdScript } from "@/lib/utils";
import type { DestinationFaq } from "@/data/destinations";

/**
 * Native `<details>/<summary>` accordion — zero JavaScript, unlike the main
 * site's FAQ section (which uses a client component for its expand
 * animation). A landing page built to load fast doesn't need an animated
 * accordion to ask the same question a plain HTML disclosure widget
 * answers for free. Renders nothing if the destination has no real FAQ
 * content — never a placeholder question invented to fill the section.
 */
export function LpFaqAccordion({ faqs }: { faqs: DestinationFaq[] }) {
  if (faqs.length === 0) return null;

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
    <section className="border-t border-line bg-paper-2 py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }}
      />
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <p className="eyebrow">Before you ask</p>
        <h2 className="font-display mt-4 text-[length:var(--step-h2)] text-ink">
          Common questions
        </h2>

        <div className="mt-10 divide-y divide-line border-t border-line">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink marker:content-none">
                {faq.question}
                <span
                  className="shrink-0 text-xl text-brass transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink-2">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
