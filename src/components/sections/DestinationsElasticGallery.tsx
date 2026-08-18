import { ElasticGallery, type ElasticGalleryItem } from "@/components/ui/ElasticGallery";
import { photo, photoBlur } from "@/lib/images";
import type { Destination } from "@/data/destinations";

/**
 * Maps the "Easy & Affordable" destinations onto the elastic hover/tap
 * gallery — the tier-two showcase on /destinations. A thin adapter over the
 * generic <ElasticGallery>: it resolves each destination's photo through
 * the site's own catalogue (photo()/photoBlur()) rather than the gallery
 * component knowing anything about how photography is stored.
 */
export function DestinationsElasticGallery({
  destinations,
}: {
  destinations: Destination[];
}) {
  const items: ElasticGalleryItem[] = destinations.map((d) => ({
    id: d.slug,
    title: d.name,
    // Redundant when the region is just the country's own name (Thailand /
    // Thailand) — only worth showing when it adds information, e.g. Dubai /
    // United Arab Emirates.
    category: d.region === d.name ? "Easy & Affordable" : d.region,
    href: `/destinations/${d.slug}`,
    src: photo(d.cardImage ?? d.heroImage, 1000),
    blurSrc: photoBlur(d.cardImage ?? d.heroImage),
    alt: `${d.name} — ${d.tagline}`,
    ctaLabel: `Explore ${d.name}`,
  }));

  const featured = destinations.find((d) => d.featured)?.slug;

  return <ElasticGallery items={items} defaultActiveId={featured} />;
}
