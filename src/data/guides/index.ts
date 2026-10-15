import type { Guide, GuideBlock } from "./types";
import { schengenVisaFromIndia } from "./schengen-visa-from-india";
import { howManyCountriesFirstEuropeTrip } from "./how-many-countries-first-europe-trip";

export type { Guide, GuideBlock, GuideFaq, GuideSource } from "./types";

/** Newest first. Add a guide here and it appears in the index, sitemap and llms.txt. */
export const guides: readonly Guide[] = [
  howManyCountriesFirstEuropeTrip,
  schengenVisaFromIndia,
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getRelatedGuides(guide: Guide): Guide[] {
  return guide.related
    .map((slug) => getGuide(slug))
    .filter((related): related is Guide => related !== undefined);
}

function blockText(block: GuideBlock): string {
  switch (block.type) {
    case "ul":
    case "ol":
      return block.items.join(" ");
    case "table":
      return [...block.head, ...block.rows.flat()].join(" ");
    default:
      return block.text;
  }
}

/** Reading time at ~200 words a minute, never less than one. */
export function readingMinutes(guide: Guide): number {
  const text = guide.body.map(blockText).join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** "16 October 2026" — fixed to UTC so server and client never disagree. */
export function formatGuideDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Stable anchor id for a heading, e.g. "Step 1: Work out..." -> "step-1-work-out". */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
