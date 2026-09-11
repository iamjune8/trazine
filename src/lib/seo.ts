import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Truncates to a whole-word boundary near maxLength, for descriptions built
 * by concatenating CMS fields (tagline + intro, etc.) that can run long —
 * cutting mid-word looks broken in a search snippet or social card.
 */
export function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

/**
 * Every static/listing page was relying on the root layout's generic
 * openGraph/twitter block (same title, description and — since it has no
 * `images` — no image at all, for every page). Next.js only replaces
 * openGraph/twitter wholesale when a page defines its own, it doesn't merge
 * field-by-field, so "give every page its own" is the only fix; this helper
 * exists so each of the ~10 call sites doesn't hand-roll the same
 * openGraph/twitter shape and drift out of sync with each other.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  socialTitle,
}: {
  title: string;
  description: string;
  path: string;
  /** Local path under /public, or an already-resolved photo() URL. */
  image?: string;
  /** Override for openGraph/twitter title, when the page <title> (often
      tuned for search, e.g. "X Tour Packages from India") reads worse as a
      social card headline than a tagline-style alternative would. */
  socialTitle?: string;
}): Metadata {
  const images = image ? [{ url: image }] : undefined;
  const shareTitle = socialTitle ?? title;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images,
    },
  };
}

/** BreadcrumbList JSON-LD — every crumb needs an absolute URL, not a path. */
export function breadcrumbJsonLd(crumbs: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: `${site.url}${crumb.href}`,
    })),
  };
}
