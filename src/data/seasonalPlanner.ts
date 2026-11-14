/**
 * Month-by-month guide for the next six months. Each pick is general seasonal
 * advice (weather patterns that repeat most years), not a forecast. Destination
 * slugs must match an existing /destinations/[slug] page. Image paths point at
 * files in /public.
 */
export type SeasonalPick = {
  slug: string;
  name: string;
  why: string;
  image: string;
  imageAlt: string;
};

export type SeasonalMonth = {
  month: string;
  /** One line on what the month is good for. */
  theme: string;
  picks: SeasonalPick[];
};

export const seasonalPlanner: SeasonalMonth[] = [
  {
    month: "November",
    theme: "Mild weather and autumn colour",
    picks: [
      {
        slug: "dubai",
        name: "Dubai",
        why: "Warm days and cooler evenings, before the peak season.",
        image: "/images/destinations/dubai-1.jpg",
        imageAlt: "Dubai skyline at dusk",
      },
      {
        slug: "japan",
        name: "Japan",
        why: "Autumn colour in the temples and gardens.",
        image: "/images/catalogue/japanFushimiInari.jpg",
        imageAlt: "The red torii gates of Fushimi Inari in Kyoto",
      },
    ],
  },
  {
    month: "December",
    theme: "Christmas markets and dry-season beaches",
    picks: [
      {
        slug: "europe",
        name: "Europe",
        why: "Christmas markets and winter city breaks.",
        image: "/images/destinations/paris-hero.jpg",
        imageAlt: "Paris at dusk",
      },
      {
        slug: "maldives",
        name: "Maldives",
        why: "Dry season begins, with calm seas and clear water.",
        image: "/images/destinations/maldives-1.jpg",
        imageAlt: "Turquoise water over a Maldives lagoon",
      },
    ],
  },
  {
    month: "January",
    theme: "Dry season across Southeast Asia",
    picks: [
      {
        slug: "thailand",
        name: "Thailand",
        why: "Cooler, drier weather across most of the country.",
        image: "/images/destinations/thailand-1.jpg",
        imageAlt: "A temple in Thailand",
      },
      {
        slug: "vietnam",
        name: "Vietnam",
        why: "Dry in the south, and quieter than the summer peak.",
        image: "/images/catalogue/vietnamHaLongBayKarst.jpg",
        imageAlt: "Limestone karsts rising from Ha Long Bay",
      },
    ],
  },
  {
    month: "February",
    theme: "Snow in the north, sun in the south",
    picks: [
      {
        slug: "japan",
        name: "Japan",
        why: "Snow in the north, with ski towns and winter hot springs.",
        image: "/images/catalogue/japanHeroFuji.jpg",
        imageAlt: "Mount Fuji above the clouds",
      },
      {
        slug: "singapore",
        name: "Singapore",
        why: "Good any time of year, with indoor attractions for rainy spells.",
        image: "/images/catalogue/singaporeMarinaBaySandsRooftop.jpg",
        imageAlt: "The Marina Bay Sands rooftop in Singapore",
      },
    ],
  },
  {
    month: "March",
    theme: "Spring begins",
    picks: [
      {
        slug: "malaysia",
        name: "Malaysia",
        why: "Warm and easy to combine with Singapore.",
        image: "/images/catalogue/kualaLumpurPetronas.jpg",
        imageAlt: "The Petronas Towers in Kuala Lumpur",
      },
      {
        slug: "kenya",
        name: "Kenya",
        why: "Dry season for wildlife viewing on safari.",
        image: "/images/destinations/kenya-1.jpg",
        imageAlt: "Wildlife on the Kenyan plains",
      },
    ],
  },
  {
    month: "April",
    theme: "Spring blossom and long days",
    picks: [
      {
        slug: "europe",
        name: "Europe",
        why: "Spring blossom, long evenings and quieter cities before summer.",
        image: "/images/destinations/venice-1.jpg",
        imageAlt: "A canal in Venice",
      },
      {
        slug: "sri-lanka",
        name: "Sri Lanka",
        why: "Pleasant weather on the west and south coasts.",
        image: "/images/destinations/sri-lanka-1.jpg",
        imageAlt: "A coastline in Sri Lanka",
      },
    ],
  },
];
