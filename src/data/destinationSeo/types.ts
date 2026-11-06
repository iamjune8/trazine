import type { Faq } from "@/data/faqs";

/** One labelled point inside a section: a fact, an option or a cost driver. */
export type SeoItem = { readonly label: string; readonly text: string };

/** An internal link to the page that answers the reader's next question. */
export type SeoLink = { readonly href: string; readonly label: string };

/** A titled content block rendered between the editorial copy and the gallery. */
export type SeoSection = {
  readonly eyebrow: string;
  readonly title: string;
  readonly lede: string;
  readonly items: readonly SeoItem[];
  readonly closing: string;
  readonly links: readonly SeoLink[];
  /** Label for the enquiry button. Falls back to a generic one. */
  readonly cta?: string;
};

/**
 * Search-intent layer for a destination page.
 *
 * Destination copy itself lives in the database (edited from the admin panel),
 * so the wording that targets what people type into Google is kept in code,
 * where it is versioned and reviewed. A destination without an entry renders
 * exactly as it did before.
 *
 * Every fact written here must already be stated on the live page or on the
 * matching package page. No prices are given: the site deliberately lists
 * none on destination pages, and inventing them would mislead.
 */
export type DestinationSeo = {
  /** `<title>` without the site suffix, which the layout appends. */
  readonly title: string;
  readonly description: string;
  /** Visible H1. Optional: omitted, the page keeps the plain place name. */
  readonly h1?: string;
  /** One plain-language paragraph near the top saying what is on offer. */
  readonly answerLead: string;
  /** How the trip is put together, and the matching package where one exists. */
  readonly plan?: SeoSection;
  /** What moves the price. States no figures. */
  readonly cost: SeoSection;
  readonly extraFaqs: readonly Faq[];
};
