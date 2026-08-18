/**
 * What the company does beyond drawing up an itinerary. These are the
 * practical services that decide whether a Mumbai-originating trip actually
 * happens — visas above all.
 */

export type Service = {
  slug: string;
  title: string;
  summary: string;
  detail: string;
  points: string[];
  /** Lucide-style icon key, rendered from src/components/ui/Icon.tsx */
  icon: "compass" | "stamp" | "plane" | "shield" | "wallet" | "headset";
  /** Present only on services with their own banner treatment (see CorporateAndLeisureBanners.tsx) — everything else renders in the plain icon grid. */
  image: string | null;
};

export const services: Service[] = [
  {
    slug: "itinerary-design",
    title: "Itinerary design",
    summary:
      "A journey built around your dates, pace and the people travelling — not a package with your name typed into it.",
    detail:
      "We start with a conversation, not a brochure. How many nights you genuinely have, who is travelling and how they walk, what you would regret missing, and what budget the whole thing has to sit inside. What comes back is a day-by-day plan with the reasoning attached — why this order, why this many nights here, what we deliberately left out.",
    points: [
      "Route and pacing designed around your actual dates",
      "Hotels chosen for location first, star rating second",
      "Timed-entry tickets sequenced so days hold together",
      "Two revisions included as standard, and usually more",
    ],
    icon: "compass",
    image: null,
  },
  {
    slug: "visa-assistance",
    title: "Visa assistance",
    summary:
      "Schengen, UK, UAE and the full range of Southeast Asian and Indian Ocean e-visas — prepared, checked and filed for whichever countries your itinerary needs.",
    detail:
      "Refusals are almost never about the traveller; they are about paperwork. For our Premium Luxury circuits we prepare the full Schengen document set, confirm which member state your application belongs to, and book the VFS biometrics appointment. For UK we file separately, since it sits outside Schengen. For our Easy & Affordable destinations — UAE, Southeast Asia, the Maldives, Sri Lanka, Nepal, Thailand and Kenya — we handle whichever e-visa, eTA or visa-free entry formality each country currently requires, as one part of the same conversation.",
    points: [
      "Schengen — one filing covers most of a European circuit",
      "UK Standard Visitor visa, filed separately",
      "UAE e-visa, filed in-house",
      "E-visas and eTAs across Southeast Asia, the Maldives, Sri Lanka, Nepal, Thailand and Kenya",
      "Honest timelines — we will tell you if your dates are too tight",
    ],
    icon: "stamp",
    image: null,
  },
  {
    slug: "flights-ticketing",
    title: "Flights & ticketing",
    summary:
      "IATA-accredited ticketing out of Mumbai, including the open-jaw and multi-city routings that consolidator sites quietly hide.",
    detail:
      "Booking into Paris and home out of Zürich costs less than most travellers expect and saves an entire day of backtracking — but it is exactly the fare online engines are worst at showing. We hold seats through the visa process where the airline allows it, so an approval that arrives late does not cost you the fare you were quoted.",
    points: [
      "Open-jaw and multi-city fares",
      "Seats held through visa processing where permitted",
      "Group and corporate fares",
      "Rebooking support when schedules change mid-trip",
    ],
    icon: "plane",
    image: null,
  },
  {
    slug: "travel-insurance",
    title: "Travel insurance & forex",
    summary:
      "Schengen-compliant cover, currency and forex cards arranged before you leave Mumbai.",
    detail:
      "Schengen requires medical cover of at least €30,000 and the policy has to be in the file at application time. We arrange compliant cover, flag the pre-existing-condition declarations that people routinely miss, and organise foreign currency and a multi-currency forex card for collection before departure.",
    points: [
      "Schengen-compliant medical cover",
      "Senior-citizen and pre-existing-condition policies",
      "Multi-currency forex cards and cash",
      "Claims support while you are still travelling",
    ],
    icon: "shield",
    image: null,
  },
  {
    slug: "on-ground",
    title: "On-ground arrangements",
    summary:
      "Transfers, rail passes, guides and the tickets that sell out three months ahead.",
    detail:
      "The unglamorous half of a good trip. Airport transfers that are actually waiting for you, rail passes costed against your real route, licensed English- or Hindi-speaking guides, and early bookings for the handful of attractions — Jungfraujoch, the Warner Bros. studio tour, Burj Khalifa at sunset — that are gone months in advance.",
    points: [
      "Private airport and inter-city transfers",
      "Swiss Travel Pass, Eurail and point-to-point rail",
      "English- and Hindi-speaking licensed guides",
      "Advance booking for high-demand attractions",
      "Jain, vegetarian and Halal dining arranged in advance",
    ],
    icon: "wallet",
    image: null,
  },
  {
    slug: "support",
    title: "Support while you travel",
    summary:
      "One named consultant, reachable on Indian time and local time, for the whole journey.",
    detail:
      "You are not passed to a call centre once the invoice clears. The consultant who planned your trip stays with it — reachable on WhatsApp through the journey, holding your confirmations, and able to rearrange things when a train is cancelled or the weather closes a mountain railway for the day.",
    points: [
      "One named consultant from first call to return",
      "WhatsApp support across both time zones",
      "All confirmations in a single travel wallet",
      "Live rebooking when plans change on the ground",
    ],
    icon: "headset",
    image: null,
  },
];

/** The three-step promise shown on the homepage. */
export const approach = [
  {
    step: "01",
    title: "We listen first",
    body: "A call, not a form response. Your dates, who is travelling, the pace that suits them, and what the trip has to cost in total. No itinerary is drawn until we understand that.",
  },
  {
    step: "02",
    title: "We design and cost it openly",
    body: "A day-by-day plan with hotels named, inclusions listed and exclusions stated plainly. You see what each part costs and what it would cost to change it.",
  },
  {
    step: "03",
    title: "We handle the difficult parts",
    body: "Visas, insurance, ticketing, transfers and the attractions that sell out early — filed, booked and confirmed while you get on with your work.",
  },
] as const;

export const stats = [
  { value: "6", suffix: "+", label: "Years planning journeys across India" },
  { value: "1,000", suffix: "+", label: "Happy customers" },
  { value: "96", suffix: "%", label: "Visa applications approved first time" },
  { value: "1", suffix: "", label: "Named consultant per journey" },
] as const;
