import type { PhotoKey } from "@/lib/images";

/**
 * Guide bodies are structured blocks rather than Markdown, so the site needs
 * no parser dependency. Inline formatting inside any text field is limited to
 * **bold**, *italic* and [label](href) — see components/guides/Inline.tsx.
 */
export type GuideBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "note"; text: string };

export type GuideFaq = { question: string; answer: string };
export type GuideSource = { label: string; href: string };

export type Guide = {
  slug: string;
  /** Full search title, also the Article headline. */
  title: string;
  /** Shorter display title for the masthead (the masthead wraps at ~14 characters). */
  headline: string;
  eyebrow: string;
  /** Meta description and card summary. Keep under ~160 characters. */
  description: string;
  /** Masthead lede. */
  lede: string;
  image: PhotoKey;
  imageAlt: string;
  /** ISO dates (yyyy-mm-dd). */
  published: string;
  updated: string;
  body: GuideBlock[];
  faqs?: GuideFaq[];
  sources?: GuideSource[];
  /** Small-print line shown under the article. */
  disclaimer: string;
  /** Slugs of guides to offer at the end. */
  related: string[];
};
