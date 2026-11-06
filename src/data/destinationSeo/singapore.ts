import type { DestinationSeo } from "./types";

/**
 * Keyword targets (Ubersuggest, India, English, Nov 2026):
 *   "singapore tour packages from mumbai"  ~1.6K/mo, difficulty 16
 *   "singapore tour packages"              ~22.2K/mo, difficulty 39
 *   "singapore and malaysia tour packages" ~6.6K/mo, difficulty 16
 *
 * There is no Singapore package page yet. Facts come from the Singapore
 * destination page. No prices are stated. The Malaysia and Bali links are
 * existing destination pages, so the combination is answered here without
 * creating a new page.
 */
export const singapore: DestinationSeo = {
  title: "Singapore Tour Packages from Mumbai & India",
  description:
    "Singapore tour packages from Mumbai: direct flights of about 5.5 hours, 4 to 6 night trips, or paired with Malaysia or Bali. We file the e-Visa for you.",
  h1: "Singapore tour packages from Mumbai",
  answerLead:
    "Looking for a Singapore tour package from Mumbai? Singapore is a direct flight of about five and a half hours, compact enough to see properly in four to six nights, or to pair with Malaysia or Bali for ten to twelve. We plan Singapore holidays for families, couples and first-time Asia travellers, and we file the e-Visa.",
  plan: {
    eyebrow: "Singapore from Mumbai",
    title: "Singapore on its own, or paired with Malaysia or Bali",
    lede: "Singapore is compact, which makes it an easy first Asian holiday and a good start to a longer one.",
    items: [
      {
        label: "On its own",
        text: "Four to six nights is enough to see Singapore properly without rushing, whether the trip is a short break or a family holiday.",
      },
      {
        label: "With Malaysia or Bali",
        text: "For ten to twelve nights, Singapore pairs naturally with Malaysia or Bali, which gives a city, a different culture and a beach in one trip.",
      },
      {
        label: "Flying from Mumbai",
        text: "About 5.5 hours, direct.",
      },
      {
        label: "Visa",
        text: "Singapore uses an e-Visa for Indian travellers, and we file it as part of the booking.",
      },
    ],
    closing:
      "Tell us your dates and who is travelling, and a consultant replies within one working day with an itemised Singapore proposal. A trip that adds Malaysia or Bali is planned as a single itinerary.",
    links: [
      { href: "/destinations/malaysia", label: "Malaysia tour packages" },
      { href: "/destinations/bali", label: "Bali tour packages" },
      { href: "/services", label: "Visa, flights and on-ground arrangements" },
    ],
    cta: "Plan Singapore from Mumbai",
  },
  cost: {
    eyebrow: "Singapore tour package cost",
    title: "What moves the price of a Singapore trip",
    lede: "Singapore is a compact city, so the cost comes down to a few decisions. These are the ones that change the number most.",
    items: [
      {
        label: "When you travel",
        text: "School holidays, long weekends and major events raise flight and hotel prices, and quieter weeks cost less.",
      },
      {
        label: "Hotel location and category",
        text: "A central hotel near the main sights and a quieter one further out are priced differently, and each suits a different kind of trip.",
      },
      {
        label: "Pairing it with another country",
        text: "Adding Malaysia or Bali adds a flight, a hotel change and more nights, but it also spreads the long-haul cost over a longer holiday.",
      },
      {
        label: "Attractions",
        text: "Gardens, theme parks and night attractions are priced separately. We list which are included and which are optional.",
      },
      {
        label: "Who is travelling",
        text: "Family rooms, children's fares and group size change the per-person figure.",
      },
    ],
    closing:
      "We do not publish a single Singapore price. Tell us your dates and who is travelling, and the itemised proposal comes back within one working day.",
    links: [],
    cta: "Get a Singapore proposal",
  },
  extraFaqs: [
    {
      question: "What affects the cost of a Singapore tour package from Mumbai?",
      answer:
        "Your dates, hotel location and category, whether you add Malaysia or Bali, the attractions you choose and who is travelling. We do not publish one fixed price, and every proposal is itemised so you can see what is included.",
    },
    {
      question: "How long is the flight from Mumbai to Singapore?",
      answer: "About 5.5 hours, direct.",
    },
    {
      question: "Can Singapore be combined with Malaysia or Bali?",
      answer:
        "Yes. Singapore pairs well with Malaysia or Bali, and a combined trip usually runs ten to twelve nights. We plan it as one itinerary, with the flights between countries quoted in the proposal.",
    },
    {
      question: "Do you file the Singapore visa for Indian travellers?",
      answer:
        "Yes. Singapore uses an e-Visa for Indian travellers, and we file it as part of your booking.",
    },
  ],
};
