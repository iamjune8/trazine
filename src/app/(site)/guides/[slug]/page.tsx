import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { photo } from "@/lib/images";
import { jsonLdScript } from "@/lib/utils";
import { site } from "@/data/site";
import {
  formatGuideDate,
  getGuide,
  getRelatedGuides,
  guides,
  headingId,
  readingMinutes,
  type Guide,
} from "@/data/guides";
import { MediaHeader } from "@/components/sections/MediaHeader";
import { CTABand } from "@/components/sections/CTABand";
import { GuideBlocks } from "@/components/guides/GuideBlocks";
import { GuideCard } from "@/components/guides/GuideCard";
import { Accordion } from "@/components/ui/Accordion";
import { Container, Section } from "@/components/ui/Layout";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide not found" };

  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    image: photo(guide.image, 1200),
  });
}

function articleJsonLd(guide: Guide) {
  const image = photo(guide.image, 1200);
  const organisation = { "@type": "Organization", name: site.name, url: site.url };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    image: image.startsWith("/") ? `${site.url}${image}` : image,
    datePublished: guide.published,
    dateModified: guide.updated,
    author: organisation,
    publisher: organisation,
    mainEntityOfPage: `${site.url}/guides/${guide.slug}`,
  };
}

function faqJsonLd(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (guide.faqs ?? []).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = getRelatedGuides(guide);
  const contents = guide.body.flatMap((block) =>
    block.type === "h2" ? [{ id: headingId(block.text), text: block.text }] : [],
  );

  const breadcrumbTrail = [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: guide.headline, href: `/guides/${guide.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd(guide)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(breadcrumbTrail)) }}
      />
      {guide.faqs?.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd(guide)) }}
        />
      ) : null}

      <MediaHeader
        image={guide.image}
        imageAlt={guide.imageAlt}
        eyebrow={guide.eyebrow}
        title={guide.headline}
        lede={guide.lede}
        breadcrumb={breadcrumbTrail.slice(0, 2)}
        breadcrumbLabel={guide.headline}
      />

      <Section className="!pb-16 sm:!pb-20 lg:!pb-24">
        <Container size="narrow">
          <p className="text-sm text-ink-3">
            Updated {formatGuideDate(guide.updated)} &middot; {readingMinutes(guide)} min read
          </p>

          {contents.length > 2 ? (
            <nav
              aria-label="In this guide"
              className="mt-8 border-y border-line py-6"
            >
              <p className="eyebrow">In this guide</p>
              <ol className="mt-4 space-y-2 text-ink-2">
                {contents.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="link-underline transition-colors duration-200 hover:text-ink"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <div className="mt-10">
            <GuideBlocks blocks={guide.body} />
          </div>

          {guide.faqs?.length ? (
            <div className="mt-16">
              <h2 className="font-display mb-8 scroll-mt-28 text-[length:var(--step-h3)] text-ink">
                Frequently asked questions
              </h2>
              <Accordion items={guide.faqs} />
            </div>
          ) : null}

          {guide.sources?.length ? (
            <div className="mt-16">
              <p className="eyebrow">Sources</p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed">
                {guide.sources.map((source) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brass-deep underline decoration-brass/40 underline-offset-4 transition-colors duration-200 hover:decoration-brass-deep"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="mt-12 border-t border-line pt-6 text-sm italic leading-relaxed text-ink-3">
            {guide.disclaimer}
          </p>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section tone="paper-2" className="!py-16 sm:!py-20">
          <Container>
            <p className="eyebrow">Keep reading</p>
            <div className="mt-8 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <GuideCard key={item.slug} guide={item} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <CTABand
        eyebrow="Start here"
        title="Tell us your dates."
        body="One conversation, and you'll know what's achievable. We plan the trip, file the visa and book the tickets, or just the part you need."
        source={`guide-${guide.slug}`}
      />
    </>
  );
}
