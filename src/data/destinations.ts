import { type PhotoKey } from "@/lib/images";

export type Fact = { label: string; value: string };

/**
 * One calendar month's typical conditions — not a live forecast, a climate
 * norm. Always exactly 12 entries, index 0 = January, so "this month" and
 * "next month" can be looked up by `new Date().getMonth()` without any
 * month-name matching.
 */
export type MonthClimate = {
  month: string;
  /** e.g. "19–25°C" */
  tempRange: string;
  /** Short label, e.g. "Warm days, cool evenings — the season" */
  condition: string;
};

export type Experience = {
  title: string;
  description: string;
};

/** A country or city covered within a destination's circuit. */
export type Place = {
  name: string;
  blurb: string;
  highlights: string[];
  image: PhotoKey;
};

/**
 * The two ways we sell travel: broad, multi-country European circuits at the
 * top of the market, and shorter-haul, easier-to-plan getaways across Asia
 * and the Gulf. Every destination below belongs to exactly one.
 */
export type Tier = "premium" | "easy";

export type Destination = {
  slug: string;
  /** Short name for cards and nav — a region or a country, whichever this is. */
  name: string;
  tier: Tier;
  /** Country/place list shown as a subtitle, e.g. "France · UK · Netherlands · Belgium". */
  region: string;
  /** One line, sensory, never a price. */
  tagline: string;
  /** Two or three sentences of editorial lead-in. */
  intro: string;
  /** Long-form body copy, one string per paragraph. */
  body: string[];
  heroImage: PhotoKey;
  /** Frame used on grid cards, if it should differ from heroImage. */
  cardImage?: PhotoKey;
  /** Portrait-friendly frames for the detail-page gallery. */
  gallery: PhotoKey[];
  /** The countries/cities within this circuit, each with its own highlights. */
  places: Place[];
  /** Signature experiences that span the whole circuit. */
  experiences: Experience[];
  /** Practical facts an Indian traveller asks before enquiring. */
  facts: Fact[];
  /** Seasonal guidance written for departures out of India. */
  seasons: { window: string; note: string }[];
  /** Exactly 12 entries, January through December. */
  monthlyClimate: MonthClimate[];
  idealFor: string[];
  /** Featured on the homepage showcase. */
  featured: boolean;
};

export const destinations: Destination[] = [
  // ─────────────────────────────────────────────────────────────────────
  // PREMIUM LUXURY — the whole of Europe, one circuit
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "europe",
    name: "Europe",
    tier: "premium",
    region: "Western, Central & Eastern Europe · Scandinavia",
    tagline: "Paris to the fjords, planned as one long journey rather than four short ones",
    intro:
      "Seventeen countries, one circuit, one conversation. We used to sell Europe as four separate regions — Western, Central, Eastern, Scandinavia — but the trip itself never respected that line, so neither do we anymore. Wherever you start, we route the whole continent as a single itinerary and help you choose the two or three countries that belong in this particular trip.",
    body: [
      "Western Europe is where most first trips begin — Paris and London joined by a two-hour Eurostar, with Amsterdam's canals and Bruges' medieval lanes an easy detour either side. Central Europe is the Alpine core: Switzerland's high passes, Austria's lakeside villages, Bavaria's fairy-tale castles and Prague's unbroken skyline, four countries and one Schengen visa.",
      "Eastern Europe is where the trip turns toward discovery and value — Budapest's Parliament lit over the Danube, Dubrovnik's walls above the Adriatic, Kraków's old town, Bran Castle in the Carpathians. Scandinavia sits furthest north and asks for the most restraint: Norway's fjords, Iceland's waterfalls, Copenhagen and Stockholm's walkable centres, never more than two or three of the five in one trip.",
      "The one detail we still state plainly wherever it applies: the United Kingdom is not in the Schengen area, so a UK stop needs its own separate visa on its own timeline. Everything else on this page — sixteen countries in all — sits under a single Schengen application. We file whichever combination your route needs, and we plan the itinerary, and the visa appointments, around it from the first conversation.",
    ],
    heroImage: "parisEiffelSeine",
    cardImage: "swissLauterbrunnen",
    gallery: ["parisPontAlexandre", "hallstattAustria", "budapestParliament", "norwayFjord"],
    places: [
      {
        name: "Paris, France",
        blurb:
          "Museums, grand boulevards and a river that looks best at the hour the tower starts to sparkle.",
        highlights: [
          "The Louvre and Musée d'Orsay, on timed entry",
          "The Eiffel Tower at blue hour, from Trocadéro or a Seine cruise",
          "Montmartre and the Marais on foot",
          "Versailles as a full morning",
        ],
        image: "parisEiffelTrocadero",
      },
      {
        name: "London, United Kingdom",
        blurb:
          "A walking city interrupted by the Underground, with a matinée and a market for every mood.",
        highlights: [
          "Tower of London and the Crown Jewels at opening",
          "A West End show, seats checked for sightlines",
          "Borough Market on a Saturday morning",
          "Warner Bros. Studio Tour — The Making of Harry Potter",
        ],
        image: "londonBigBen",
      },
      {
        name: "Amsterdam, Netherlands",
        blurb: "Canals, bicycles and world-class museums in a city built to be walked.",
        highlights: [
          "The canal ring by boat, ideally at golden hour",
          "The Rijksmuseum and the Van Gogh Museum",
          "Jordaan's quiet, café-lined streets",
          "Tulip fields at Keukenhof, in season",
        ],
        image: "amsterdamCanal",
      },
      {
        name: "Bruges, Belgium",
        blurb: "A medieval city so intact it is easy to forget which century you are standing in.",
        highlights: [
          "The Markt and Belfry tower",
          "A quiet canal walk past Minnewater Lake",
          "Chocolate and waffles, done properly",
          "A half-day trip from Brussels or Amsterdam",
        ],
        image: "brugesLake",
      },
      {
        name: "Switzerland",
        blurb: "Valleys that quiet you, and trains that run to the second.",
        highlights: [
          "Jungfraujoch — Top of Europe, on a clear-weather morning",
          "The Matterhorn from Gornergrat, above car-free Zermatt",
          "Lake Lucerne by steamer, and the covered bridge",
          "The Glacier or Bernina Express, reserved panoramic seats",
        ],
        image: "swissLauterbrunnen",
      },
      {
        name: "Austria",
        blurb: "Imperial Vienna and a lakeside village too pretty to be real.",
        highlights: [
          "Hallstatt's lake, church spire and mountain backdrop",
          "Vienna's palaces and coffeehouse culture",
          "Salzburg's old town and Sound of Music countryside",
          "The Salzkammergut lake district by car or rail",
        ],
        image: "hallstattAustria",
      },
      {
        name: "Germany (Bavaria)",
        blurb: "Turreted castles, walled old towns and the Rhine's vineyard terraces.",
        highlights: [
          "Neuschwanstein Castle, the original fairy-tale silhouette",
          "Rothenburg ob der Tauber's walled old town",
          "Munich's old town and beer-hall culture",
          "A Rhine valley rail day, castles on both banks",
        ],
        image: "europeOldTown",
      },
      {
        name: "Czech Republic",
        blurb: "Prague's spires, at a fraction of the region's other price tags.",
        highlights: [
          "Charles Bridge at dawn, before the crowds",
          "Prague Castle and the Old Town Square astronomical clock",
          "A Vltava river cruise at blue hour",
          "Český Krumlov as a full-day trip",
        ],
        image: "pragueRooftops",
      },
      {
        name: "Hungary",
        blurb: "Budapest's Danube grandeur, and a thermal bathing culture worth building an evening around.",
        highlights: [
          "Parliament and the Chain Bridge, lit at night",
          "Széchenyi thermal baths",
          "A Danube dinner cruise",
          "Buda Castle and the Fisherman's Bastion",
        ],
        image: "budapestParliament",
      },
      {
        name: "Poland",
        blurb: "Warsaw's rebuilt old town and Kraków's untouched one, a short flight apart.",
        highlights: [
          "Warsaw's Old Town Market Square at golden hour",
          "Kraków's Rynek Główny and the Cloth Hall",
          "Wieliczka Salt Mine, just outside Kraków",
          "Auschwitz-Birkenau, for those who want it included",
        ],
        image: "warsawOldTown",
      },
      {
        name: "Croatia",
        blurb: "Dubrovnik's walls above a coastline that has quietly joined the Schengen area.",
        highlights: [
          "The full city-wall walk, early morning",
          "Old town streets below Fort Lovrijenac",
          "A boat trip to the Elaphiti Islands",
          "Plitvice Lakes National Park, inland",
        ],
        image: "dubrovnikWalls",
      },
      {
        name: "Romania",
        blurb: "Bran Castle and Carpathian villages, for travellers who want the road less taken.",
        highlights: [
          "Bran Castle's turrets above the forest",
          "Braşov's Saxon old town and Council Square",
          "A self-drive day through Carpathian villages",
          "Peleș Castle, near Sinaia",
        ],
        image: "branCastle",
      },
      {
        name: "Norway",
        blurb: "Fjords, cliffs and a railway that descends through cloud into a valley floor.",
        highlights: [
          "A fjord cruise — Geirangerfjord or Nærøyfjord",
          "The Flåm Railway, one of the steepest in the world",
          "Bergen's old wharf, Bryggen",
          "The Northern Lights, in the winter window",
        ],
        image: "norwayFjord",
      },
      {
        name: "Denmark",
        blurb: "Copenhagen, built for cycling, with a harbourfront made for evenings.",
        highlights: [
          "Nyhavn's colourful houses and canal boats",
          "Tivoli Gardens, especially after dark",
          "The Little Mermaid and the palace quarter",
          "A bike-led day through the city's neighbourhoods",
        ],
        image: "copenhagenNyhavn",
      },
      {
        name: "Sweden",
        blurb: "Stockholm's old town spread across fourteen islands.",
        highlights: [
          "Gamla Stan's cobbled lanes and cathedral spire",
          "The Vasa Museum, a 17th-century warship raised whole",
          "An archipelago boat trip",
          "Södermalm's design and food scene",
        ],
        image: "stockholmGamlaStan",
      },
      {
        name: "Finland",
        blurb: "Helsinki's harbour and design district, or Lapland's snow in winter.",
        highlights: [
          "The harbourfront market square and cathedral",
          "Design District Helsinki",
          "A sauna, done the way Finns actually do it",
          "Lapland — huskies and the Northern Lights, in season",
        ],
        image: "helsinkiHarbour",
      },
      {
        name: "Iceland",
        blurb: "Waterfalls, glacier lagoons and the Golden Circle, worth its own dedicated nights.",
        highlights: [
          "Þingvellir, Geysir and Gullfoss — the Golden Circle",
          "Goðafoss and Skógafoss waterfalls",
          "The Blue Lagoon",
          "A glacier lagoon day, further afield",
        ],
        image: "icelandWaterfall",
      },
    ],
    experiences: [
      {
        title: "Eurostar, city to city",
        description:
          "Paris to London (or the reverse) in two hours fifteen minutes, no airport, no baggage drop — the join between the two capitals becomes part of the holiday rather than a travel day.",
      },
      {
        title: "Jungfraujoch — Top of Europe",
        description:
          "The railway to 3,454 m, timed to a clear-weather morning where possible, so the fare buys a view and not a wall of cloud.",
      },
      {
        title: "Budapest by night",
        description:
          "The Chain Bridge and Parliament lit against the Danube — a dinner cruise or simply the walk along the embankment at blue hour.",
      },
      {
        title: "Dubrovnik's walls, at sunrise",
        description:
          "The full 2 km circuit, walked before the cruise-ship crowds arrive mid-morning — the single best hour to see the old town.",
      },
      {
        title: "A fjord, done properly",
        description:
          "Norway's fjords, planned as the trip's centrepiece rather than a day excursion — a cruise and a fjord-view stay, not a coach-window glimpse.",
      },
      {
        title: "One region at a time, never the whole map",
        description:
          "Every one of these seventeen countries sits under (mostly) a single Schengen visa — but the trip that actually works is two or three of them, chosen deliberately, not a tour of the continent.",
      },
    ],
    facts: [
      { label: "Typical shape", value: "Open-jaw: into one country, home from another — routing built around your choices" },
      {
        label: "Visa",
        value: "One Schengen visa covers sixteen countries here; the UK needs its own — we file both",
      },
      { label: "Currencies", value: "Euro across most of the circuit; also CHF, GBP and the Nordic currencies" },
      { label: "Between cities", value: "High-speed rail and short flights link every region" },
      { label: "Suggested duration", value: "10 to 16 nights, two or three countries per trip" },
      { label: "Pace", value: "You pick the region and the count — we build the routing" },
    ],
    seasons: [
      {
        window: "April – June",
        note: "Gardens and terraces at their best in the west, alpine meadows in flower centrally, long evenings everywhere. Our most recommended window across the whole circuit.",
      },
      {
        window: "July – September",
        note: "Warmest and clearest, the only realistic window for the Nordic midnight sun and high-altitude excursions — also the busiest, so we book Indian school-holiday dates months ahead.",
      },
      {
        window: "November – December",
        note: "Cold, often grey, and every city at its most civilised indoors — plus Christmas markets from mid-November across the west and centre. Hotel rates fall sharply.",
      },
    ],
    idealFor: [
      "First trip to Europe",
      "Honeymoons",
      "Art, history and architecture",
      "Rail journeys",
      "Northern Lights chasers",
      "Value-conscious luxury",
    ],
    monthlyClimate: [],
    featured: true,
  },

  // ─────────────────────────────────────────────────────────────────────
  // EASY & AFFORDABLE — short-haul Asia and the Gulf
  // ─────────────────────────────────────────────────────────────────────
  {
    slug: "dubai",
    name: "Dubai",
    tier: "easy",
    region: "United Arab Emirates",
    tagline: "Desert light, glass towers and a three-hour flight",
    intro:
      "The shortest long-haul you will ever take. Dubai sits close enough to Mumbai for a long weekend and grand enough to hold a fortnight — a city that folds gold souks and dune silence into the same afternoon as the world's tallest building.",
    body: [
      "Most first visits chase the skyline, and they should: the observation deck at the top of Burj Khalifa, the fountains below it, the improbable curve of Burj Al Arab against the Gulf. But the Dubai we build itineraries around usually reveals itself somewhere quieter — the abra crossing at Dubai Creek for a single dirham, the spice lanes of Deira, an evening in the desert when the dunes go the colour of brass and the city noise finally drops away.",
      "It is also the easiest international destination to travel with family. Flights leave Mumbai through the day, the visa is quick, most of India's dietary preferences are effortlessly catered for, and the distances between the things you came to see are short. Grandparents, toddlers and teenagers can all be given a good day here without anyone compromising.",
      "We plan Dubai for the pace you want. A compressed three-night city break built around evenings. A slower week that folds in Abu Dhabi's Sheikh Zayed Grand Mosque and Louvre Abu Dhabi. Or a beach-led stay on Jumeirah where the itinerary is deliberately thin and the point is the sea.",
    ],
    heroImage: "dubaiSkyline",
    cardImage: "dubaiSheikhZayedDusk",
    gallery: [
      "dubaiBurjAlArabAerial",
      "dubaiMarinaCamels",
      "dubaiSheikhZayedDusk",
      "dubaiBurjAlArabBeach",
    ],
    places: [
      {
        name: "Dubai",
        blurb: "Towers, souks and desert, inside one emirate.",
        highlights: [
          "Burj Khalifa's observation deck at sunset",
          "Old Dubai — Al Fahidi, the gold and spice souks, an abra crossing",
          "A desert evening — dunes, falconry, dinner under the stars",
          "Jumeirah and Palm beaches",
        ],
        image: "dubaiSkyline",
      },
      {
        name: "Abu Dhabi",
        blurb: "A full day trip that turns a city break into something more rounded.",
        highlights: [
          "Sheikh Zayed Grand Mosque, in the morning light",
          "Louvre Abu Dhabi, under Nouvel's rain-of-light dome",
          "The Corniche waterfront",
          "Qasr Al Watan, the presidential palace",
        ],
        image: "dubaiBurjAlArabAerial",
      },
    ],
    experiences: [
      {
        title: "Burj Khalifa, at the right hour",
        description:
          "We book the deck for the sunset slot — the one that sells out first — so you watch the desert and the city change colour together rather than queueing in flat afternoon light.",
      },
      {
        title: "A desert evening, not a desert circus",
        description:
          "Private 4x4 into the conservation reserve, falconry at golden hour, dinner under the dunes. The small-group version, not the coach convoy version.",
      },
      {
        title: "Old Dubai on foot",
        description:
          "Al Fahidi's wind towers, the gold and spice souks, and the creek crossing by abra — guided by someone who can tell you what you are actually looking at.",
      },
      {
        title: "Abu Dhabi as a full day",
        description:
          "Sheikh Zayed Grand Mosque in the morning light, Louvre Abu Dhabi under Nouvel's rain-of-light dome, and back by evening.",
      },
      {
        title: "Sea days",
        description:
          "Jumeirah and Palm resorts chosen for the things brochures leave out — which pool gets afternoon shade, which beach is calm enough for young children.",
      },
    ],
    facts: [
      { label: "Flying time from Mumbai", value: "Approx. 3 hrs 15 mins, direct" },
      { label: "Visa", value: "UAE e-visa — we file it; typically 3–5 working days" },
      { label: "Currency", value: "UAE Dirham (AED)" },
      { label: "Languages", value: "Arabic and English; Hindi widely spoken" },
      { label: "Time difference", value: "1 hr 30 mins behind IST" },
      { label: "Suggested duration", value: "4 to 7 nights" },
    ],
    seasons: [
      {
        window: "November – March",
        note: "The season. Warm days, cool evenings, everything outdoors is pleasant. Book early — this is when Mumbai travels.",
      },
      {
        window: "April & October",
        note: "Shoulder months. Hotter, noticeably better value, still very manageable if you plan mornings and evenings outdoors.",
      },
      {
        window: "June – August",
        note: "Genuinely hot. Worth it only for an indoors-and-resort trip, and priced accordingly. We will tell you honestly if it suits your group.",
      },
    ],
    idealFor: [
      "Multi-generational family trips",
      "Long weekends",
      "First international trip",
      "Honeymoons",
      "Corporate incentives",
    ],
    monthlyClimate: [],
    featured: true,
  },

  {
    slug: "bali",
    name: "Bali",
    tier: "easy",
    region: "Indonesia",
    tagline: "Rice terraces, cliff temples and a coastline built for golden hour",
    intro:
      "Indonesia's easiest island for a first visit — warm year-round, and compact enough that temple, terrace and beach club all fit inside the same week without feeling rushed.",
    body: [
      "Ubud is the quieter, greener half of the island — Tegallalang's cascading rice terraces, a wellness culture that runs from a single spa afternoon to a full retreat, and mornings that reward getting up early before the day-trip buses arrive.",
      "Uluwatu, Seminyak and Canggu are the coast — a cliff-top temple with a sunset kecak fire dance unlike anything else on this site, and beach clubs chosen for the right pool rather than just the view on Instagram.",
      "Bali pairs naturally with Singapore for travellers who want a fortnight rather than a week — temple and terrace, then skyline and street food, without a second flight home. Either way, the e-visa is one of the simplest in the region, and we file it as part of the same conversation where we plan the rest of the trip.",
    ],
    heroImage: "baliRiceTerraces",
    cardImage: "baliUluwatuSunset",
    gallery: ["baliRiceTerraces", "baliUluwatuSunset"],
    places: [
      {
        name: "Ubud",
        blurb: "Rice terraces and a wellness culture that runs from a spa afternoon to a full retreat.",
        highlights: [
          "Tegallalang's cascading rice terraces",
          "Ubud's yoga, spa and wellness retreats",
        ],
        image: "baliRiceTerraces",
      },
      {
        name: "Uluwatu & the South Coast",
        blurb: "A cliff temple and beach clubs, for the half of the island built around the coast.",
        highlights: [
          "Uluwatu's cliff temple and sunset kecak dance",
          "Seminyak and Canggu's beach clubs",
        ],
        image: "baliUluwatuSunset",
      },
    ],
    experiences: [
      {
        title: "Tegallalang's rice terraces, at first light",
        description:
          "The cascading terraces walked before the day-trip buses arrive — Ubud's calmest, greenest hour.",
      },
      {
        title: "Uluwatu at sunset",
        description:
          "The cliff-top temple and a kecak fire dance, timed for the exact hour the light turns over the ocean.",
      },
      {
        title: "A beach club day, Seminyak or Canggu",
        description:
          "Chosen for which pool gets the afternoon shade and which stretch of sand actually suits your group, not just the feed.",
      },
      {
        title: "Ubud's wellness week",
        description:
          "Yoga, spa and a genuinely quiet few days for travellers who want stillness built into the itinerary, not squeezed between excursions.",
      },
      {
        title: "Paired with Singapore",
        description:
          "Temple and terrace, then skyline and street food — two very different countries that combine into one balanced, easy-paced fortnight.",
      },
    ],
    facts: [
      { label: "Flying time from Mumbai", value: "Approx. 8–9 hrs, typically via one connection" },
      { label: "Visa", value: "Indonesian e-Visa — among the simplest in the region; we file it" },
      { label: "Currency", value: "Indonesian Rupiah (IDR)" },
      { label: "Language", value: "Indonesian; English widely spoken in tourist areas" },
      { label: "Suggested duration", value: "5 to 8 nights, or paired with Singapore for 10–12" },
      { label: "Pace", value: "Two halves — Ubud inland, the coast for the rest" },
    ],
    seasons: [
      {
        window: "April – October",
        note: "Dry season, and the most reliable window for beach days and terrace walks without rain interruptions.",
      },
      {
        window: "November – March",
        note: "Wetter, warm, short tropical downpours most afternoons — still workable, and noticeably better value.",
      },
      {
        window: "July – August",
        note: "Peak season and the busiest month on the island — book Uluwatu and beach clubs well ahead.",
      },
    ],
    idealFor: [
      "First-time Asia travellers",
      "Honeymoons",
      "Wellness and yoga retreats",
      "Value-conscious family trips",
      "Photography-led trips",
    ],
    monthlyClimate: [],
    featured: true,
  },

  {
    slug: "vietnam",
    name: "Vietnam",
    tier: "easy",
    region: "Vietnam",
    tagline: "Limestone bays, lantern-lit old towns and some of Asia's best street food",
    intro:
      "The Southeast Asia trip for travellers who want more texture and less polish — Hanoi's tangled old quarter, an overnight cruise through Ha Long Bay's limestone karsts, Hoi An's lanterns lit at dusk, and a food scene that rewards wandering rather than a fixed itinerary.",
    body: [
      "Ha Long Bay is the reason most itineraries start in the north — a cabin cruise through the limestone karsts, rather than a rushed day trip out and back from Hanoi, whose old quarter and street-food trail deserve two or three unhurried days either side.",
      "Hoi An's ancient town is where the pace slows further — lantern-lit at night, best walked once the day-trippers have thinned out — while Ho Chi Minh City in the south adds markets and war-history sites for travellers who want the fuller length of the country.",
      "Vietnam combines well with Malaysia or a longer Southeast Asia loop, less naturally with a short Bali-only trip. The e-visa is straightforward for Indian passport holders, and we file it as part of the same conversation where we plan the rest of the trip.",
    ],
    heroImage: "hoiAnLanterns",
    cardImage: "vietnamHaLongBayJunks",
    gallery: ["hoiAnLanterns", "vietnamHaLongBayKarst", "vietnamHaLongBayJunks"],
    places: [
      {
        name: "Hanoi & Ha Long Bay",
        blurb: "The north — an overnight cruise through limestone karsts, and a street-food capital either side.",
        highlights: [
          "An overnight cruise through Ha Long Bay",
          "Hanoi's old quarter and street-food trail",
        ],
        image: "vietnamHaLongBayJunks",
      },
      {
        name: "Hoi An & Ho Chi Minh City",
        blurb: "The centre and south — a lantern-lit old town, and markets and history further down the coast.",
        highlights: [
          "Hoi An's ancient town, lantern-lit at night",
          "Ho Chi Minh City's markets and war-history sites",
        ],
        image: "hoiAnLanterns",
      },
    ],
    experiences: [
      {
        title: "Ha Long Bay, overnight",
        description:
          "A cabin cruise through the limestone karsts, rather than a rushed day trip out and back from Hanoi.",
      },
      {
        title: "Hanoi's old quarter, on foot",
        description:
          "A street-food trail walked with someone who knows which stall is actually worth the queue.",
      },
      {
        title: "Hoi An by lantern light",
        description:
          "The ancient town's evening hours, when the lanterns come on and the day-trippers thin out.",
      },
      {
        title: "Ho Chi Minh City's markets and history",
        description:
          "For travellers who want the south folded in — markets, war-history sites, and a very different pace from the north.",
      },
      {
        title: "Paired with Malaysia",
        description:
          "A short flight joins the two for a longer, two-country trip that reads far better than four countries in one.",
      },
    ],
    facts: [
      { label: "Flying time from Mumbai", value: "Approx. 6–7 hrs, typically via one connection" },
      { label: "Visa", value: "Vietnam e-Visa — straightforward for Indian passport holders; we file it" },
      { label: "Currency", value: "Vietnamese Dong (VND)" },
      { label: "Language", value: "Vietnamese; English spoken in tourist areas, less so outside them" },
      { label: "Suggested duration", value: "7 to 10 nights, Hanoi/Ha Long Bay north to Ho Chi Minh City south" },
      { label: "Pace", value: "North and centre for a first trip; the full length only with 10+ nights" },
    ],
    seasons: [
      {
        window: "October – April",
        note: "The dry, cooler window for the north (Hanoi, Ha Long Bay) — the season we recommend most.",
      },
      {
        window: "February – August",
        note: "Best for central and southern Vietnam (Hoi An, Ho Chi Minh City), opposite the north's calendar.",
      },
      {
        window: "May – September",
        note: "Wetter in the north with short, heavy afternoon showers — still workable, and noticeably quieter and better value.",
      },
    ],
    idealFor: [
      "First-time Asia travellers",
      "Food-led travel",
      "Photography-led trips",
      "Honeymoons",
      "Slower, off-the-polish trips",
    ],
    monthlyClimate: [],
    featured: true,
  },

  {
    slug: "malaysia",
    name: "Malaysia",
    tier: "easy",
    region: "Malaysia",
    tagline: "Petronas Towers by night, and hill-country and island escapes close behind",
    intro:
      "Kuala Lumpur's skyline as the anchor, with Penang's street art and hawker food, the Cameron Highlands' cool tea-country air and Langkawi's beaches all within easy reach — a country that folds city, hill and coast into one easy week.",
    body: [
      "Kuala Lumpur itself rewards two or three nights — the Petronas Twin Towers lit up after dark, and a compact, walkable city centre. From there the country opens up in almost any direction you want.",
      "Penang's George Town adds street art and some of the region's best hawker food a short flight or a scenic drive away; the Cameron Highlands' tea plantations and cool hill air are a genuine change of pace from the coast, reached by road.",
      "Langkawi closes the loop for travellers who want a beach finish, and Malaysia pairs just as easily with Singapore — a short flight or a cross-border coach joins the two, letting you add Penang or the Highlands without a second flight home.",
    ],
    heroImage: "kualaLumpurPetronas",
    cardImage: "malaysiaPenangBicycleMural",
    gallery: ["kualaLumpurPetronas", "malaysiaPenangBicycleMural", "malaysiaPenangButterflyMural"],
    places: [
      {
        name: "Kuala Lumpur",
        blurb: "The skyline anchor — the Petronas Towers, and a compact, walkable city centre.",
        highlights: ["Petronas Twin Towers, lit up after dark"],
        image: "kualaLumpurPetronas",
      },
      {
        name: "Penang & the Highlands",
        blurb: "George Town's murals and hawker food, and cool tea country a short drive away.",
        highlights: [
          "Penang's street art and hawker food",
          "The Cameron Highlands' tea plantations",
          "Langkawi's beaches and cable car",
        ],
        image: "malaysiaPenangButterflyMural",
      },
    ],
    experiences: [
      {
        title: "Petronas Twin Towers, after dark",
        description:
          "The skybridge and observation deck, timed for the hour the towers light up over the city.",
      },
      {
        title: "Penang's street art and hawker food",
        description:
          "George Town's laneways, walked with an eye for both — murals by day, hawker stalls once the heat breaks.",
      },
      {
        title: "The Cameron Highlands, by road",
        description:
          "Tea plantations and cool hill air, a genuine change of pace from the coast and the towers.",
      },
      {
        title: "Langkawi's beaches and cable car",
        description:
          "An island close enough to add without a second flight, chosen for the reef and the view.",
      },
      {
        title: "Paired with Singapore",
        description:
          "A short flight or a cross-border coach joins the two into one balanced, easy-paced trip.",
      },
    ],
    facts: [
      { label: "Flying time from Mumbai", value: "Approx. 5.5–6 hrs, direct to Kuala Lumpur" },
      { label: "Visa", value: "Malaysia e-Visa / visa-on-arrival — straightforward for Indian passport holders; we file it" },
      { label: "Currency", value: "Malaysian Ringgit (MYR)" },
      { label: "Language", value: "Malay; English widely spoken" },
      { label: "Suggested duration", value: "6 to 9 nights, or paired with Singapore for 10–12" },
      { label: "Pace", value: "KL as the anchor, one hill or island add-on" },
    ],
    seasons: [
      {
        window: "Year-round",
        note: "Warm and humid throughout with no sharp off-season — a reliable fallback whenever timing elsewhere in the region is awkward.",
      },
      {
        window: "May – September",
        note: "The driest window on the west coast and in the Cameron Highlands — the best months for outdoor days.",
      },
      {
        window: "November – February",
        note: "Wetter on the east coast (Langkawi's east side, Perhentian) — we route around it.",
      },
    ],
    idealFor: [
      "First-time Asia travellers",
      "Value-conscious family trips",
      "Food-led travel",
      "Honeymoons",
      "Short city-and-hill breaks",
    ],
    monthlyClimate: [],
    featured: true,
  },

  {
    slug: "singapore",
    name: "Singapore",
    tier: "easy",
    region: "Singapore",
    tagline: "Gardens, hawker centres and a skyline, all within one compact, spotless city",
    intro:
      "The easiest possible introduction to Southeast Asia — a direct flight, English everywhere, and a city small enough to see properly in four or five days without ever feeling rushed.",
    body: [
      "Gardens by the Bay and Marina Bay Sands anchor most first visits — the Supertrees' evening light show, and the infinity-edge deck timed for blue hour, both essentials rather than optional extras.",
      "A hawker-centre trail is where the city actually reveals itself — walked with someone who knows which stall is worth the queue — and Sentosa Island with Universal Studios rounds out a full family day when children are travelling too.",
      "Singapore pairs naturally with Bali or Malaysia for travellers who want a fortnight rather than a long weekend — a short flight extends the trip without adding a second visa conversation, since Singapore's own entry is quick and straightforward.",
    ],
    heroImage: "singaporeGardens",
    cardImage: "singaporeMarinaBaySandsPool",
    gallery: ["singaporeGardens", "singaporeMarinaBaySandsPool", "singaporeMarinaBaySandsRooftop"],
    places: [
      {
        name: "Singapore",
        blurb: "Gardens, hawker centres and a skyline, all within one compact, spotless city.",
        highlights: [
          "Gardens by the Bay's Supertrees, by night",
          "Marina Bay Sands and the infinity-view deck",
          "A hawker-centre food trail",
          "Sentosa Island and Universal Studios",
        ],
        image: "singaporeGardens",
      },
    ],
    experiences: [
      {
        title: "Gardens by the Bay, by night",
        description:
          "The Supertrees' light show, timed for the evening slot rather than a rushed daytime walk-through.",
      },
      {
        title: "Marina Bay Sands, the view from the top",
        description:
          "The infinity-edge deck at blue hour, when the skyline and the harbour both catch the light.",
      },
      {
        title: "A hawker-centre trail",
        description:
          "Walked with someone who knows which stall is actually worth the queue, across two or three centres.",
      },
      {
        title: "Sentosa and Universal Studios",
        description:
          "A full family day, planned around ride wait times rather than left to chance.",
      },
      {
        title: "Paired with Bali or Malaysia",
        description:
          "A short flight extends the trip into a fuller two-country fortnight without a second flight home.",
      },
    ],
    facts: [
      { label: "Flying time from Mumbai", value: "Approx. 5.5 hrs, direct" },
      { label: "Visa", value: "Singapore e-Visa — quick and straightforward; we file it" },
      { label: "Currency", value: "Singapore Dollar (SGD)" },
      { label: "Language", value: "English, Mandarin, Malay, Tamil — English is the working language throughout" },
      { label: "Suggested duration", value: "4 to 6 nights, or paired with Bali/Malaysia for 10–12" },
      { label: "Pace", value: "Compact enough to see properly without rushing, even on a short trip" },
    ],
    seasons: [
      {
        window: "Year-round",
        note: "Warm and humid throughout, with no real off-season — plan around your dates rather than the weather.",
      },
      {
        window: "November – January",
        note: "The wettest stretch, with short, heavy showers most days — still very manageable.",
      },
      {
        window: "June – September",
        note: "Marginally drier, and one of the more comfortable windows for full outdoor days.",
      },
    ],
    idealFor: [
      "First-time Asia travellers",
      "Family trips with children",
      "Short breaks and stopovers",
      "Food-led travel",
      "Honeymoons",
    ],
    monthlyClimate: [],
    featured: true,
  },

  {
    slug: "maldives",
    name: "Maldives",
    tier: "easy",
    region: "Maldives",
    tagline: "Overwater villas and a house reef, with almost nothing else on the itinerary by design",
    intro:
      "The most straightforward good decision most travellers make all year — a direct flight under five hours, then a speedboat or seaplane to a private island where the only real choice is which reef to snorkel first.",
    body: [
      "It suits honeymoons and short resets equally well, and the value at the mid-tier resorts is genuinely strong against European beach alternatives — the trip is decided the moment you choose the island, not built up from a long list of excursions.",
      "House-reef snorkelling is often the best of the trip without ever boarding a boat, a sunset dolphin cruise makes for a quiet evening on the water, and the seaplane transfer itself becomes part of the holiday rather than just a connection.",
      "Sri Lanka is the natural pairing for travellers who want more — hill country and coastline, then an island reset to close the trip. Entry for Indian passport holders is free on arrival, with no paperwork to file in advance.",
    ],
    heroImage: "maldivesOverwater",
    cardImage: "maldivesOverwaterClose",
    gallery: ["maldivesOverwater", "maldivesOverwaterClose"],
    places: [
      {
        name: "Maldives",
        blurb: "Overwater villas and a house reef, with almost nothing else on the itinerary by design.",
        highlights: [
          "An overwater villa stay, with house-reef snorkelling",
          "A sunset dolphin cruise",
          "Seaplane transfers as part of the arrival itself",
          "Spa days built around doing very little",
        ],
        image: "maldivesOverwater",
      },
    ],
    experiences: [
      {
        title: "An overwater stay, decided before you land",
        description:
          "A villa over the reef, and a schedule with almost nothing on it — the whole point of the trip settled at booking.",
      },
      {
        title: "House-reef snorkelling",
        description:
          "The resort's own reef, often the best snorkelling of the trip without ever boarding a boat.",
      },
      {
        title: "A sunset dolphin cruise",
        description:
          "A quiet evening on the water, timed for the light rather than whenever a slot is free.",
      },
      {
        title: "Seaplane transfers as part of the arrival",
        description:
          "The flight in becomes part of the holiday itself, not just a connection to get through.",
      },
      {
        title: "Paired with Sri Lanka",
        description:
          "Hill country and coastline, then an island reset to close the trip.",
      },
    ],
    facts: [
      { label: "Flying time from Mumbai", value: "Approx. 4–4.5 hrs, direct" },
      { label: "Visa", value: "Free on arrival for Indian passport holders — no paperwork to file in advance" },
      { label: "Currency", value: "Maldivian Rufiyaa (MVR); US Dollars widely accepted at resorts" },
      { label: "Language", value: "Dhivehi; English spoken throughout the resort industry" },
      { label: "Suggested duration", value: "4 to 7 nights, or paired with Sri Lanka for 10–12" },
      { label: "Pace", value: "One island, almost nothing on the schedule by design" },
    ],
    seasons: [
      {
        window: "November – April",
        note: "The dry, sunny season — the window most Indian travellers choose, and the most in demand.",
      },
      {
        window: "May – October",
        note: "The wetter south-west monsoon — still warm, short showers, and noticeably better resort rates.",
      },
      {
        window: "December – January",
        note: "Peak season and the most expensive fortnight of the year — worth booking early if these are your dates.",
      },
    ],
    idealFor: [
      "Honeymoons",
      "Short resets and long weekends",
      "Beach-only trips",
      "Anniversary trips",
      "Diving and snorkelling",
    ],
    monthlyClimate: [],
    featured: true,
  },

  {
    slug: "sri-lanka",
    name: "Sri Lanka",
    tier: "easy",
    region: "Sri Lanka",
    tagline: "Rock fortresses, tea country and beaches, all within a few hours' drive of each other",
    intro:
      "More packed into one country than almost anywhere else on this site — Sigiriya's rock fortress, Ella's tea-country train ride, a safari at Yala, Galle's Dutch-colonial fort, and beaches on both coasts, with the distances between them short enough that ten days rarely feels rushed.",
    body: [
      "Sigiriya's rock fortress and frescoes are best climbed at opening, before the heat and the coach groups build; Ella's tea country follows naturally, with one of the great short rail journeys in Asia crossing the Nine Arches Bridge along the way.",
      "Yala National Park adds a genuine safari — leopard, elephant and sloth bear country — easily folded into a beach-and-culture trip, while Galle Fort's Dutch-colonial ramparts and lanes are best walked in the late afternoon light.",
      "Sri Lanka pairs naturally with the Maldives for travellers who want more — hill country and coastline, then an island reset to close the trip. The ETA is straightforward for Indian passport holders, and we file it as part of the same conversation.",
    ],
    heroImage: "sriLankaNineArches",
    cardImage: "sriLankaSigiriyaSunset",
    gallery: ["sriLankaNineArches", "sriLankaSigiriyaSunset", "sriLankaSigiriyaAerial"],
    places: [
      {
        name: "Sigiriya & the Cultural Triangle",
        blurb: "A rock fortress and frescoes, climbed before the heat and the coach groups build.",
        highlights: ["Sigiriya's rock fortress and frescoes"],
        image: "sriLankaSigiriyaSunset",
      },
      {
        name: "Ella, Yala & Galle",
        blurb: "Tea country, a safari and a Dutch-colonial fort, all within a few hours' drive of each other.",
        highlights: [
          "Ella's tea country and the Nine Arches Bridge",
          "A safari at Yala National Park",
          "Galle Fort's Dutch-colonial old town",
        ],
        image: "sriLankaNineArches",
      },
    ],
    experiences: [
      {
        title: "Sigiriya, at opening",
        description:
          "The rock fortress and its frescoes, climbed before the heat and the crowds build.",
      },
      {
        title: "Ella's hill-country train",
        description:
          "One of the great short rail journeys in Asia, through tea plantations and over the Nine Arches Bridge.",
      },
      {
        title: "Safari at Yala",
        description:
          "Leopard, elephant and sloth bear country, and one of the easiest safaris to fold into a beach-and-culture trip.",
      },
      {
        title: "Galle Fort, on foot",
        description:
          "The Dutch-colonial old town's ramparts and lanes, best walked in the late afternoon.",
      },
      {
        title: "Paired with the Maldives",
        description:
          "Hill country and coastline, then an island reset to close the trip.",
      },
    ],
    facts: [
      { label: "Flying time from Mumbai", value: "Approx. 2.5–3 hrs, direct to Colombo" },
      { label: "Visa", value: "Sri Lanka ETA — straightforward for Indian passport holders; we file it" },
      { label: "Currency", value: "Sri Lankan Rupee (LKR)" },
      { label: "Language", value: "Sinhala and Tamil; English widely spoken in tourist areas" },
      { label: "Suggested duration", value: "7 to 10 nights, or paired with the Maldives for 10–12" },
      { label: "Pace", value: "Hill country, safari and coast — short drives, a lot packed in" },
    ],
    seasons: [
      {
        window: "November – April",
        note: "The dry, sunny window for the west and south coasts and the cultural triangle — the season most Indian travellers choose.",
      },
      {
        window: "May – September",
        note: "Sri Lanka's east coast (Trincomalee, Arugam Bay) has its own dry season here, opposite the west and south.",
      },
      {
        window: "April & September – October",
        note: "The shoulder months either side of both monsoons — good value, workable weather across most of the island.",
      },
    ],
    idealFor: [
      "Honeymoons",
      "Wildlife and safari",
      "Photography-led trips",
      "Beach and hill-country combined",
      "First-time Asia travellers",
    ],
    monthlyClimate: [],
    featured: true,
  },

  {
    slug: "nepal",
    name: "Nepal",
    tier: "easy",
    region: "Nepal",
    tagline: "Mountain air, temple squares and a scenic flight that passes within sight of Everest",
    intro:
      "The outlier on this site — mountains rather than beaches, and the destination we recommend to travellers who want the Himalayas without committing to a multi-week trek. Kathmandu's temple squares, Pokhara's lakeside calm and a mountain flight give a real taste of the Himalayas in five or six days.",
    body: [
      "Kathmandu's Durbar Square and temple complexes reward a guided day or two — old-city lanes and living heritage that are best explained rather than simply photographed.",
      "Pokhara's lakeside is where the pace slows — boats on Phewa Lake at dawn, below the Annapurna range — and a scenic mountain flight from Kathmandu passes within sight of Everest itself, the world's highest peak visible from your window.",
      "For those who want it, a short, guided trek adds a genuine taste of the trails without committing to the full multi-week route. Entry for Indian passport holders is, in practice, visa-free, which makes Nepal one of the simplest international trips to arrange on short notice.",
    ],
    heroImage: "nepalPrayerFlags",
    cardImage: "nepalKathmanduDurbarSquare",
    gallery: ["nepalPrayerFlags", "nepalKathmanduDurbarSquare", "nepalKathmanduDurbarSquareGate"],
    places: [
      {
        name: "Kathmandu",
        blurb: "Durbar Square's tiered pagoda roofs and old-city lanes, best walked with a guide.",
        highlights: ["Kathmandu's Durbar Square and temple complexes"],
        image: "nepalKathmanduDurbarSquare",
      },
      {
        name: "Pokhara & the Mountains",
        blurb: "Lakeside calm below the Annapurna range, and a mountain flight past Everest.",
        highlights: [
          "Pokhara's lakeside, below the Annapurna range",
          "A scenic mountain flight, Everest visible from the window",
          "A short, guided trek for those who want one",
        ],
        image: "nepalPrayerFlags",
      },
    ],
    experiences: [
      {
        title: "Kathmandu's Durbar Square",
        description:
          "Temple complexes and old-city lanes, best walked with a guide who can explain what you're actually looking at.",
      },
      {
        title: "Pokhara's lakeside",
        description:
          "A slower few days below the Annapurna range, with boats on Phewa Lake at dawn.",
      },
      {
        title: "A mountain flight past Everest",
        description:
          "An hour in the air from Kathmandu, with the world's highest peak visible from your window.",
      },
      {
        title: "A short, guided trek",
        description:
          "For those who want a genuine taste of the trails without committing to the full multi-week route.",
      },
      {
        title: "The Himalayas, without the expedition",
        description:
          "Five or six days is enough for a real sense of the mountains — not a rushed layover, not a multi-week commitment.",
      },
    ],
    facts: [
      { label: "Flying time from Mumbai", value: "Approx. 2.5–3 hrs, direct to Kathmandu" },
      { label: "Visa", value: "Visa-on-arrival for Indian passport holders — in practice, no visa is required at all" },
      { label: "Currency", value: "Nepalese Rupee (NPR); Indian Rupees widely accepted" },
      { label: "Language", value: "Nepali; English spoken in tourist areas" },
      { label: "Suggested duration", value: "5 to 8 nights" },
      { label: "Pace", value: "Kathmandu and Pokhara as the two bases, a trek or mountain flight added" },
    ],
    seasons: [
      {
        window: "March – May & September – November",
        note: "Nepal's clearest mountain views, either side of the summer monsoon — the best months for a mountain flight or trek.",
      },
      {
        window: "December – February",
        note: "Cold and clear in the valleys, snow at altitude — workable for Kathmandu and Pokhara, less so for high treks.",
      },
      {
        window: "June – August",
        note: "The summer monsoon — clouds obscure the high peaks most days, so we steer travellers away from this window.",
      },
    ],
    idealFor: [
      "First taste of the Himalayas",
      "Short treks",
      "Honeymoons",
      "Photography-led trips",
      "Slower, culture-led trips",
    ],
    monthlyClimate: [],
    featured: true,
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export const featuredDestinations = destinations.filter((d) => d.featured);
export const premiumDestinations = destinations.filter((d) => d.tier === "premium");
export const easyDestinations = destinations.filter((d) => d.tier === "easy");
