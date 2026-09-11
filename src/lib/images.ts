/**
 * Photography helper.
 *
 * Every photo below was originally a real, hand-checked Unsplash frame of the
 * destination it is attached to — no generic stock, no random placeholder
 * seeds — then downloaded into public/images/catalogue/ so the site has no
 * runtime dependency on Unsplash's CDN. Each file is named after its
 * catalogue key (e.g. dubaiSkyline.jpg) and the comment beside each entry
 * still records what is actually in frame.
 *
 * The comment on a given entry is the only surviving record of its Unsplash
 * source — worth keeping if the same photo ever needs re-fetching at a
 * different size.
 *
 * photo() still resolves an admin-entered full URL or bare Unsplash photo ID
 * (e.g. from AdminImageField) straight through — this local catalogue covers
 * the site's own named photos, not every image source the admin can type in.
 */

const UNSPLASH = "https://images.unsplash.com/photo-";
/** Bare CDN host, for keys (Unsplash photo IDs) that already include their own "photo-" prefix. */
const UNSPLASH_HOST = "https://images.unsplash.com/";

/** Named photo catalogue: key → Unsplash photo id + what is actually in frame. */
export const photos = {
  // ── Dubai ──
  dubaiSkyline: "/images/catalogue/dubaiSkyline.jpg", // Burj Khalifa & Sheikh Zayed Rd at sunset
  dubaiBurjAlArabAerial: "/images/catalogue/dubaiBurjAlArabAerial.jpg", // Burj Al Arab + Palm from the air
  dubaiBurjAlArabBeach: "/images/catalogue/dubaiBurjAlArabBeach.jpg", // Burj Al Arab from Jumeirah beach
  dubaiMarinaCamels: "/images/catalogue/dubaiMarinaCamels.jpg", // camels on JBR beach, Marina towers behind
  dubaiSheikhZayedDusk: "/images/catalogue/dubaiSheikhZayedDusk.jpg", // Sheikh Zayed Road light trails at dusk

  // ── Switzerland ──
  swissLauterbrunnen: "/images/catalogue/swissLauterbrunnen.jpg", // Lauterbrunnen valley & Staubbach falls
  swissAlpineLake: "/images/catalogue/swissAlpineLake.jpg", // Melchsee-Frutt, alpine lake & chalets
  swissPeaksAboveCloud: "/images/catalogue/swissPeaksAboveCloud.jpg", // Valais peaks above a sea of cloud

  // ── Paris ──
  parisEiffelSeine: "/images/catalogue/parisEiffelSeine.jpg", // Eiffel Tower over the Seine at dusk
  parisPontAlexandre: "/images/catalogue/parisPontAlexandre.jpg", // Pont Alexandre III lamps at blue hour
  parisEiffelTrocadero: "/images/catalogue/parisEiffelTrocadero.jpg", // Eiffel from Trocadéro, clear day
  parisRooftops: "/images/catalogue/parisRooftops.jpg", // Haussmann rooftops toward the Eiffel
  parisStreet: "/images/catalogue/parisStreet.jpg", // quiet Haussmann boulevard, morning light

  // ── United Kingdom ──
  londonAerial: "/images/catalogue/londonAerial.jpg", // Thames & Tower Bridge from above
  londonTowerBridge: "/images/catalogue/londonTowerBridge.jpg", // Tower Bridge with the City behind
  londonBigBen: "/images/catalogue/londonBigBen.jpg", // Palace of Westminster & Big Ben
  londonBusDusk: "/images/catalogue/londonBusDusk.jpg", // Routemaster passing Big Ben at dusk
  skyeQuiraing: "/images/catalogue/skyeQuiraing.jpg", // the Quiraing, Isle of Skye

  // ── Western Europe (France, UK, Netherlands, Belgium) ──
  amsterdamCanal: "/images/catalogue/amsterdamCanal.jpg", // Amsterdam canal, houseboats
  brugesLake: "/images/catalogue/brugesLake.jpg", // Minnewater Lake, Bruges, Belgium

  // ── Central Europe (Switzerland, Austria, Germany, Czech Republic) ──
  europeOldTown: "/images/catalogue/europeOldTown.jpg", // Rothenburg (Germany) old town at golden hour
  pragueRooftops: "/images/catalogue/pragueRooftops.jpg", // Prague (Czech Republic) spires and terracotta roofs
  hallstattAustria: "/images/catalogue/hallstattAustria.jpg", // Hallstatt, Austria — lakeside village below the Alps

  // ── Eastern Europe (Poland, Hungary, Croatia, Romania) ──
  warsawOldTown: "/images/catalogue/warsawOldTown.jpg", // Warsaw Old Town Market Square at golden hour
  budapestParliament: "/images/catalogue/budapestParliament.jpg", // Hungarian Parliament & Chain Bridge at sunset
  dubrovnikWalls: "/images/catalogue/dubrovnikWalls.jpg", // Dubrovnik's old-town walls above the Adriatic
  branCastle: "/images/catalogue/branCastle.jpg", // Bran Castle, Transylvania, Romania

  // ── Scandinavia (Norway, Sweden, Denmark, Finland, Iceland) ──
  norwayFjord: "/images/catalogue/norwayFjord.jpg", // a Norwegian fjord at golden hour
  stockholmGamlaStan: "/images/catalogue/stockholmGamlaStan.jpg", // Gamla Stan, Stockholm
  copenhagenNyhavn: "/images/catalogue/copenhagenNyhavn.jpg", // Nyhavn's colourful harbourfront, Copenhagen
  helsinkiHarbour: "/images/catalogue/helsinkiHarbour.jpg", // Helsinki's cathedral seen across the harbour
  icelandWaterfall: "/images/catalogue/icelandWaterfall.jpg", // Goðafoss waterfall, Iceland

  // ── Bali, Indonesia ──
  baliRiceTerraces: "/images/catalogue/baliRiceTerraces.jpg", // Tegallalang rice terraces, Bali
  baliUluwatuSunset: "/images/catalogue/baliUluwatuSunset.jpg", // Uluwatu clifftop temple pagodas silhouetted against dusk clouds, Bali

  // ── Vietnam ──
  hoiAnLanterns: "/images/catalogue/hoiAnLanterns.jpg", // lantern-lit river festival, Hoi An, Vietnam
  vietnamHaLongBayKarst: "/images/catalogue/vietnamHaLongBayKarst.jpg", // solitary limestone karst rising from turquoise water, Ha Long Bay
  vietnamHaLongBayJunks: "/images/catalogue/vietnamHaLongBayJunks.jpg", // limestone karsts and cruise/junk boats at sunset, Ha Long Bay

  // ── Malaysia ──
  kualaLumpurPetronas: "/images/catalogue/kualaLumpurPetronas.jpg", // Petronas Twin Towers at night, Kuala Lumpur
  malaysiaPenangBicycleMural: "/images/catalogue/malaysiaPenangBicycleMural.jpg", // "Children on a Bicycle" street-art mural, George Town, Penang
  malaysiaPenangButterflyMural: "/images/catalogue/malaysiaPenangButterflyMural.jpg", // butterfly street-art mural on a Georgetown wall, Penang

  // ── Singapore ──
  singaporeGardens: "/images/catalogue/singaporeGardens.jpg", // Supertrees at Gardens by the Bay, Singapore
  singaporeMarinaBaySandsPool: "/images/catalogue/singaporeMarinaBaySandsPool.jpg", // Marina Bay Sands rooftop infinity pool overlooking the skyline
  singaporeMarinaBaySandsRooftop: "/images/catalogue/singaporeMarinaBaySandsRooftop.jpg", // Marina Bay Sands towers with rooftop pool deck, viewed from the bay

  // ── Maldives ──
  maldivesOverwater: "/images/catalogue/maldivesOverwater.jpg", // overwater villas from above, Maldives
  maldivesOverwaterClose: "/images/catalogue/maldivesOverwaterClose.jpg", // row of overwater villas at water level, turquoise lagoon, Maldives

  // ── Sri Lanka ──
  sriLankaNineArches: "/images/catalogue/sriLankaNineArches.jpg", // Nine Arches Bridge, Ella, Sri Lanka
  sriLankaSigiriyaSunset: "/images/catalogue/sriLankaSigiriyaSunset.jpg", // Sigiriya rock fortress silhouetted at sunset
  sriLankaSigiriyaAerial: "/images/catalogue/sriLankaSigiriyaAerial.jpg", // aerial view of Sigiriya rock fortress summit ruins

  // ── Nepal ──
  nepalPrayerFlags: "/images/catalogue/nepalPrayerFlags.jpg", // prayer flags in the Everest region, Nepal
  nepalKathmanduDurbarSquare: "/images/catalogue/nepalKathmanduDurbarSquare.jpg", // tiered pagoda roofs of Kathmandu Durbar Square, pigeons in flight
  nepalKathmanduDurbarSquareGate: "/images/catalogue/nepalKathmanduDurbarSquareGate.jpg", // temple gateway with guardian lion statues, Kathmandu Durbar Square

  // ── Japan ──
  japanFushimiInari: "/images/catalogue/japanFushimiInari.jpg", // torii gate pathway, Fushimi Inari Shrine, Kyoto
  japanBambooGrove: "/images/catalogue/japanBambooGrove.jpg", // Arashiyama bamboo forest canopy, Kyoto
  japanOsakaStreetFood: "/images/catalogue/japanOsakaStreetFood.jpg", // Osaka street food stall
  japanTokyoNeon: "/images/catalogue/japanTokyoNeon.jpg", // wet neon-lit street at night, Tokyo
  japanKyotoTemple: "/images/catalogue/japanKyotoTemple.jpg", // red temple near water, Kyoto

  // ── Saudi Arabia ──
  saudiHegraTomb: "/images/catalogue/saudiHegraTomb.jpg", // Nabataean tomb carved into sandstone, Hegra, AlUla
  saudiAlulaOasis: "/images/catalogue/saudiAlulaOasis.jpg", // palm oasis below sandstone mountains, AlUla
  saudiRiyadhSkyline: "/images/catalogue/saudiRiyadhSkyline.jpg", // Riyadh skyline at night, Kingdom Tower lit up
  saudiAseerMountains: "/images/catalogue/saudiAseerMountains.jpg", // green highland mountains, Abha, Aseer region
  saudiJeddahMosque: "/images/catalogue/saudiJeddahMosque.jpg", // Al-Rahma floating mosque on Jeddah's Corniche
  saudiTabukDesert: "/images/catalogue/saudiTabukDesert.jpg", // Hisma Desert sandstone mesas at sunset, Tabuk province

  // ── Kazakhstan ──
  kazakhstanAlmatySkyline: "/images/catalogue/kazakhstanAlmatySkyline.jpg", // Almaty city below the snow-capped Tian Shan range
  kazakhstanMountainLake: "/images/catalogue/kazakhstanMountainLake.jpg", // alpine lake ringed by mountains near Almaty
  kazakhstanCharynCanyon: "/images/catalogue/kazakhstanCharynCanyon.jpg", // Charyn Canyon's red rock formations
  kazakhstanBayterekTower: "/images/catalogue/kazakhstanBayterekTower.jpg", // Bayterek Tower, Astana
  kazakhstanSteppeYurt: "/images/catalogue/kazakhstanSteppeYurt.jpg", // yurt on the green steppe below the mountains

  // ── Editorial / brand ──
  aircraftWing: "/images/catalogue/aircraftWing.jpg", // wing above cloud at sunrise
  planningFlatlay: "/images/other/planning-flatlay.jpg", // AI-generated map, notebook and camera flat-lay
  officeInterior: "/images/catalogue/officeInterior.jpg", // calm glass-partitioned studio

  // ── /demo/airport-hero (cinematic scroll concept) ──
  airportTerminalDusk: "/images/catalogue/airportTerminalDusk.jpg", // illuminated terminal ceiling, dramatic wide architecture
  travelerCorridorAerial: "/images/catalogue/travelerCorridorAerial.jpg", // elevated shot, traveller pulling a case through an airport corridor
  departureBoardRetro: "/images/catalogue/departureBoardRetro.jpg", // TWA Hotel JFK — real split-flap departures board
} as const;

/**
 * Not restricted to `keyof typeof photos`: every image field on `Destination`
 * and friends is a plain string once it round-trips through Supabase and the
 * admin's free-text form fields, so the type only ever pretended to be a
 * closed union. A local path ("/images/...") or an Unsplash catalogue key are
 * both valid values.
 */
export type PhotoKey = string;

/** A flat, neutral placeholder used behind local images, which have no cheap low-res variant the way an Unsplash URL does. */
const LOCAL_BLUR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='%23d9d2c7'/%3E%3C/svg%3E";

/**
 * Build an image URL. A value starting with "/" is a local file under
 * `public/images/` and is returned as-is — Next's optimizer handles those
 * automatically. A value starting with "http" is returned as-is (full URL).
 * A bare Unsplash photo ID (e.g. "photo-1234567890abc") is converted to
 * an Unsplash URL. Otherwise it's treated as a catalogue key and resolved.
 */
export function photo(key: PhotoKey, width = 1600): string {
  if (key?.startsWith("/")) return key;
  if (key?.startsWith("http")) return key;
  // Unsplash photo ID: already includes the "photo-" prefix, so it goes
  // straight onto the bare CDN host — UNSPLASH itself already ends in
  // "photo-" for the catalogue-id case below, and concatenating the two
  // would double up to ".../photo-photo-xxxxx" (a 404).
  if (key?.startsWith("photo-") && /^photo-[a-z0-9-]+$/.test(key)) {
    return `${UNSPLASH_HOST}${key}?auto=format&fit=crop&w=${width}&q=72`;
  }
  const id = photos[key as keyof typeof photos];
  if (id?.startsWith("/")) return id;
  if (id?.startsWith("http")) return id;
  if (!id) return "";
  return `${UNSPLASH}${id}?auto=format&fit=crop&w=${width}&q=72`;
}

/**
 * A 12px-wide blurred version of the same frame, used as `blurDataURL` so
 * cards fade up from the photo's own colours instead of flashing grey.
 * Cheap enough (~1KB) to inline on every image. Local images and external
 * URLs get a flat neutral placeholder instead, since there's no low-res variant.
 */
export function photoBlur(key: PhotoKey): string {
  // Always a non-empty data URI: Next's Image component throws a hard
  // render error if `placeholder="blur"` is set with an empty blurDataURL,
  // and every caller in this codebase sets placeholder="blur" unconditionally.
  // A full URL (admin-entered external image) or an unresolved key has no
  // cheap low-res variant to generate, so both fall back to the flat
  // placeholder rather than risk crashing the page.
  if (key?.startsWith("/")) return LOCAL_BLUR;
  if (key?.startsWith("http")) return LOCAL_BLUR;
  // Unsplash photo ID: generate a blur variant (see photo() for why this
  // uses UNSPLASH_HOST rather than UNSPLASH — the key already has "photo-").
  if (key?.startsWith("photo-") && /^photo-[a-z0-9-]+$/.test(key)) {
    return `${UNSPLASH_HOST}${key}?auto=format&fit=crop&w=16&q=20&blur=200`;
  }
  const id = photos[key as keyof typeof photos];
  if (id?.startsWith("/")) return LOCAL_BLUR;
  if (id?.startsWith("http")) return LOCAL_BLUR;
  if (!id) return LOCAL_BLUR;
  return `${UNSPLASH}${id}?auto=format&fit=crop&w=16&q=20&blur=200`;
}
