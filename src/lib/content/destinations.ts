import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { PhotoKey } from "@/lib/images";
import type {
  Destination,
  Place,
  Experience,
  Fact,
  Tier,
  MonthClimate,
  ThingToDo,
  ItineraryDay,
  DestinationFaq,
} from "@/data/destinations";

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
  departure_code?: string;
  route_city?: string;
  currency: string;
  language: string;
  things_to_do: unknown;
  food_and_dining: string[];
  shopping: string[];
  family_friendly: string;
  honeymoon_suitable: string;
  adventure_activities: string[];
  suggested_itinerary: unknown;
  travel_tips: string[];
  faqs: unknown;
  places: unknown;
  experiences: unknown;
  facts: unknown;
  seasons: unknown;
  monthly_climate: unknown;
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
    departureCode: row.departure_code,
    routeCity: row.route_city,
    places: row.places as Place[],
    experiences: row.experiences as Experience[],
    facts: row.facts as Fact[],
    seasons: row.seasons as { window: string; note: string }[],
    monthlyClimate: row.monthly_climate as MonthClimate[],
    idealFor: row.ideal_for,
    featured: row.featured,
    currency: row.currency,
    language: row.language,
    thingsToDo: row.things_to_do as ThingToDo[],
    foodAndDining: row.food_and_dining,
    shopping: row.shopping,
    familyFriendly: row.family_friendly,
    honeymoonSuitable: row.honeymoon_suitable,
    adventureActivities: row.adventure_activities,
    suggestedItinerary: row.suggested_itinerary as ItineraryDay[],
    travelTips: row.travel_tips,
    faqs: row.faqs as DestinationFaq[],
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
