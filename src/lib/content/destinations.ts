import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { PhotoKey } from "@/lib/images";
import type { Destination, Place, Experience, Fact, Tier } from "@/data/destinations";

/**
 * Live content layer — reads what the admin panel writes. Supabase is now
 * the source of truth; src/data/destinations.ts keeps its type exports (used
 * throughout the component tree) and its static array only as a pre-migration
 * reference/backup, no longer imported by any page.
 *
 * `cache()` de-dupes repeated calls within one render pass — a page and its
 * layout can both ask for the same data without two round trips.
 */

type DestinationRow = {
  slug: string;
  name: string;
  tier: string;
  region: string;
  tagline: string;
  intro: string;
  body: string[];
  hero_image: string;
  card_image: string | null;
  gallery: string[];
  places: unknown;
  experiences: unknown;
  facts: unknown;
  seasons: unknown;
  ideal_for: string[];
  featured: boolean;
};

function mapRow(row: DestinationRow): Destination {
  return {
    slug: row.slug,
    name: row.name,
    tier: row.tier as Tier,
    region: row.region,
    tagline: row.tagline,
    intro: row.intro,
    body: row.body,
    heroImage: row.hero_image as PhotoKey,
    cardImage: (row.card_image ?? undefined) as PhotoKey | undefined,
    gallery: row.gallery as PhotoKey[],
    places: row.places as Place[],
    experiences: row.experiences as Experience[],
    facts: row.facts as Fact[],
    seasons: row.seasons as { window: string; note: string }[],
    idealFor: row.ideal_for,
    featured: row.featured,
  };
}

export const getDestinations = cache(async (): Promise<Destination[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[content] failed to load destinations", error);
    return [];
  }

  return (data ?? []).map(mapRow);
});

export const getDestination = cache(
  async (slug: string): Promise<Destination | undefined> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return undefined;
    return mapRow(data);
  },
);

export async function getFeaturedDestinations(): Promise<Destination[]> {
  return (await getDestinations()).filter((d) => d.featured);
}

export async function getPremiumDestinations(): Promise<Destination[]> {
  return (await getDestinations()).filter((d) => d.tier === "premium");
}

export async function getEasyDestinations(): Promise<Destination[]> {
  return (await getDestinations()).filter((d) => d.tier === "easy");
}
