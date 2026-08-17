/**
 * Photography helper.
 *
 * Every photo below is a real, hand-checked Unsplash frame of the destination
 * it is attached to — no generic stock, no random placeholder seeds. The IDs
 * are pinned so a given card always shows the same image across reloads and
 * deploys.
 *
 * The client's own photography lives under `public/images/` and is referenced
 * directly by path (e.g. "/images/destinations/dubai-hero.jpg") rather than
 * through this catalogue — `photo()` passes any value starting with "/"
 * straight through, untouched, alongside the existing Unsplash keys.
 */

const UNSPLASH = "https://images.unsplash.com/photo-";

/** Named photo catalogue: key → Unsplash photo id + what is actually in frame. */
export const photos = {
  // ── Dubai ──
  dubaiSkyline: "1512453979798-5ea266f8880c", // Burj Khalifa & Sheikh Zayed Rd at sunset
  dubaiBurjAlArabAerial: "1518684079-3c830dcef090", // Burj Al Arab + Palm from the air
  dubaiBurjAlArabBeach: "1546412414-e1885259563a", // Burj Al Arab from Jumeirah beach
  dubaiMarinaCamels: "1528702748617-c64d49f918af", // camels on JBR beach, Marina towers behind
  dubaiSheikhZayedDusk: "1526495124232-a04e1849168c", // Sheikh Zayed Road light trails at dusk

  // ── Switzerland ──
  swissLauterbrunnen: "1530122037265-a5f1f91d3b99", // Lauterbrunnen valley & Staubbach falls
  swissAlpineLake: "1527668752968-14dc70a27c95", // Melchsee-Frutt, alpine lake & chalets
  swissPeaksAboveCloud: "1506905925346-21bda4d32df4", // Valais peaks above a sea of cloud

  // ── Paris ──
  parisEiffelSeine: "1502602898657-3e91760cbb34", // Eiffel Tower over the Seine at dusk
  parisPontAlexandre: "1499856871958-5b9627545d1a", // Pont Alexandre III lamps at blue hour
  parisEiffelTrocadero: "1431274172761-fca41d930114", // Eiffel from Trocadéro, clear day
  parisRooftops: "1503917988258-f87a78e3c995", // Haussmann rooftops toward the Eiffel
  parisStreet: "1531210483974-4f8c1f33fd35", // quiet Haussmann boulevard, morning light

  // ── United Kingdom ──
  londonAerial: "1513635269975-59663e0ac1ad", // Thames & Tower Bridge from above
  londonTowerBridge: "1533929736458-ca588d08c8be", // Tower Bridge with the City behind
  londonBigBen: "1486299267070-83823f5448dd", // Palace of Westminster & Big Ben
  londonBusDusk: "1520986606214-8b456906c813", // Routemaster passing Big Ben at dusk
  skyeQuiraing: "1451337516015-6b6e9a44a8a3", // the Quiraing, Isle of Skye

  // ── Western Europe (France, UK, Netherlands, Belgium) ──
  amsterdamCanal: "1534351590666-13e3e96b5017", // Amsterdam canal, houseboats
  brugesLake: "1742420999707-e2afe589a07c", // Minnewater Lake, Bruges, Belgium

  // ── Central Europe (Switzerland, Austria, Germany, Czech Republic) ──
  europeOldTown: "1467269204594-9661b134dd2b", // Rothenburg (Germany) old town at golden hour
  pragueRooftops: "1570077188670-e3a8d69ac5ff", // Prague (Czech Republic) spires and terracotta roofs
  hallstattAustria: "1661758079684-4fc647524b08", // Hallstatt, Austria — lakeside village below the Alps

  // ── Eastern Europe (Poland, Hungary, Croatia, Romania) ──
  warsawOldTown: "1553422734-fd8dd260a116", // Warsaw Old Town Market Square at golden hour
  budapestParliament: "1756413664903-159797c47477", // Hungarian Parliament & Chain Bridge at sunset
  dubrovnikWalls: "1565784623522-7fdf499a94a4", // Dubrovnik's old-town walls above the Adriatic
  branCastle: "1612118231574-3dad97d26ecf", // Bran Castle, Transylvania, Romania

  // ── Scandinavia (Norway, Sweden, Denmark, Finland, Iceland) ──
  norwayFjord: "1669575673050-916db4e5035f", // a Norwegian fjord at golden hour
  stockholmGamlaStan: "1650221919357-3d9854442555", // Gamla Stan, Stockholm
  copenhagenNyhavn: "1565200784220-787f89f26003", // Nyhavn's colourful harbourfront, Copenhagen
  helsinkiHarbour: "1742639008098-52228af96081", // Helsinki's cathedral seen across the harbour
  icelandWaterfall: "1543339738-49acafd7c407", // Goðafoss waterfall, Iceland

  // ── Bali, Indonesia ──
  baliRiceTerraces: "1557093793-d149a38a1be8", // Tegallalang rice terraces, Bali
  baliUluwatuSunset: "1742175257067-414cbe9033ff", // Uluwatu clifftop temple pagodas silhouetted against dusk clouds, Bali

  // ── Vietnam ──
  hoiAnLanterns: "1741274236412-b6760ff6c01b", // lantern-lit river festival, Hoi An, Vietnam
  vietnamHaLongBayKarst: "1761127138372-cad230082b19", // solitary limestone karst rising from turquoise water, Ha Long Bay
  vietnamHaLongBayJunks: "1668000018482-a02acf02b22a", // limestone karsts and cruise/junk boats at sunset, Ha Long Bay

  // ── Malaysia ──
  kualaLumpurPetronas: "1755434959823-153add7d1bd9", // Petronas Twin Towers at night, Kuala Lumpur
  malaysiaPenangBicycleMural: "1574674826492-cbcd09c5db3c", // "Children on a Bicycle" street-art mural, George Town, Penang
  malaysiaPenangButterflyMural: "1760256996005-09724ea2dc06", // butterfly street-art mural on a Georgetown wall, Penang

  // ── Singapore ──
  singaporeGardens: "1551777075-eba58b57ed15", // Supertrees at Gardens by the Bay, Singapore
  singaporeMarinaBaySandsPool: "1533377437229-5ca96ecbcd78", // Marina Bay Sands rooftop infinity pool overlooking the skyline
  singaporeMarinaBaySandsRooftop: "1561115210-2b43f96ac25b", // Marina Bay Sands towers with rooftop pool deck, viewed from the bay

  // ── Maldives ──
  maldivesOverwater: "1753939223042-872934ffda15", // overwater villas from above, Maldives
  maldivesOverwaterClose: "1753190550747-c56d10ff6d35", // row of overwater villas at water level, turquoise lagoon, Maldives

  // ── Sri Lanka ──
  sriLankaNineArches: "1706766957895-65376015bbee", // Nine Arches Bridge, Ella, Sri Lanka
  sriLankaSigiriyaSunset: "1751247026229-518bfec9b5e6", // Sigiriya rock fortress silhouetted at sunset
  sriLankaSigiriyaAerial: "1711797750174-c3750dd9d7c9", // aerial view of Sigiriya rock fortress summit ruins

  // ── Nepal ──
  nepalPrayerFlags: "1574007768454-75b5d20f6454", // prayer flags in the Everest region, Nepal
  nepalKathmanduDurbarSquare: "1736457093305-5c54384fc49e", // tiered pagoda roofs of Kathmandu Durbar Square, pigeons in flight
  nepalKathmanduDurbarSquareGate: "1662379273654-242d1abe1a96", // temple gateway with guardian lion statues, Kathmandu Durbar Square

  // ── Editorial / brand ──
  aircraftWing: "1436491865332-7a61a109cc05", // wing above cloud at sunrise
  planningFlatlay: "1488646953014-85cb44e25828", // map, notebook and camera flat-lay
  officeInterior: "1497366754035-f200968a6e72", // calm glass-partitioned studio

  // ── /demo/airport-hero (cinematic scroll concept) ──
  airportTerminalDusk: "1762801156780-dec274643407", // illuminated terminal ceiling, dramatic wide architecture
  travelerCorridorAerial: "1706967930742-9d6c5238e7e4", // elevated shot, traveller pulling a case through an airport corridor
  departureBoardRetro: "1746125047145-d6698eef563a", // TWA Hotel JFK — real split-flap departures board
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
 * automatically. Otherwise it's treated as an Unsplash catalogue key and
 * resolved to a URL, with the optimizer's resizing and format negotiation
 * (AVIF/WebP) driven by the requested width.
 */
export function photo(key: PhotoKey, width = 1600): string {
  if (key.startsWith("/")) return key;
  const id = photos[key as keyof typeof photos];
  return `${UNSPLASH}${id}?auto=format&fit=crop&w=${width}&q=72`;
}

/**
 * A 12px-wide blurred version of the same frame, used as `blurDataURL` so
 * cards fade up from the photo's own colours instead of flashing grey.
 * Cheap enough (~1KB) to inline on every image. Local images get a flat
 * neutral placeholder instead, since there's no low-res variant to fetch.
 */
export function photoBlur(key: PhotoKey): string {
  if (key.startsWith("/")) return LOCAL_BLUR;
  const id = photos[key as keyof typeof photos];
  return `${UNSPLASH}${id}?auto=format&fit=crop&w=16&q=20&blur=200`;
}
