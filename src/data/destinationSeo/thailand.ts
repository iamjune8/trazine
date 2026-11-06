import type { DestinationSeo } from "./types";

/**
 * Keyword targets (Ubersuggest, India, English, Nov 2026):
 *   "thailand tour packages from mumbai"  ~2.4K/mo, difficulty 20
 *   "thailand tour packages"              ~12.1K/mo, difficulty 32
 *   "thailand tour package india"         ~5.4K/mo, difficulty 26
 *
 * Facts below come from the Thailand destination page and the Phuket + Krabi
 * Festival Special package page (/packages/thailand-phuket-krabi-festival).
 * No prices are stated.
 */
export const thailand: DestinationSeo = {
  title: "Thailand Tour Packages from Mumbai & India",
  description:
    "Thailand tour packages from Mumbai: Bangkok, Phuket and Krabi, direct flights of about 4 hours, a fixed Phuket + Krabi package or a custom trip.",
  h1: "Thailand tour packages from Mumbai",
  answerLead:
    "Looking for a Thailand tour package from Mumbai? Thailand is a direct flight of about four to four and a half hours. We plan Thailand holidays from Mumbai and across India, from Bangkok city breaks to Phuket and Krabi beach trips, including a fixed Phuket + Krabi package, with a named consultant handling flights, hotels, sightseeing and visa guidance.",
  plan: {
    eyebrow: "Packages from Mumbai",
    title: "Phuket and Krabi from Mumbai, or a Thailand trip built for you",
    lede: "Thailand suits two different kinds of trip: the city of Bangkok and the beaches of the south. You can take one, or combine them.",
    items: [
      {
        label: "A fixed departure: Phuket + Krabi Festival Special",
        text: "Five nights from Mumbai: three in Phuket and two in Krabi, with non-stop return flights on Akasa Air, 4-star hotels, and the Phi Phi Island and Krabi 4-Island tours with lunch.",
      },
      {
        label: "A trip built for you",
        text: "For Bangkok, Chiang Mai or a different mix of cities and beaches, we plan from scratch. Four to seven nights suits Bangkok on its own, and Phuket or Chiang Mai can be added to extend it.",
      },
      {
        label: "Flying from Mumbai",
        text: "About 4 to 4.5 hours, direct.",
      },
      {
        label: "Visa",
        text: "Indian passport holders can enter visa-free on most stays, and we confirm the current terms when we book.",
      },
      {
        label: "Choosing your month",
        text: "November to March is the coolest, driest window in southern Thailand, and the season the fixed package is timed around.",
      },
    ],
    closing:
      "The package page lists the exact hotels, flights and inclusions. For Bangkok or a different route, send us your dates and a consultant replies within one working day.",
    links: [
      {
        href: "/packages/thailand-phuket-krabi-festival",
        label: "Phuket + Krabi Festival Special package",
      },
      { href: "/services", label: "Visa, flights and on-ground arrangements" },
    ],
    cta: "Ask about Thailand from Mumbai",
  },
  cost: {
    eyebrow: "Thailand tour package cost",
    title: "What moves the price of a Thailand trip",
    lede: "Where you go in Thailand and when you go change the cost more than anything else. These are the choices that matter most.",
    items: [
      {
        label: "The season",
        text: "November to March is the most popular window for the south and usually costs more than the wetter months.",
      },
      {
        label: "Where you stay",
        text: "Bangkok, Phuket, Krabi and Chiang Mai are priced differently, and every extra base adds a transfer or a domestic flight.",
      },
      {
        label: "Hotel category",
        text: "A beach resort and a city boutique hotel are priced very differently, and we say what the difference buys before you choose.",
      },
      {
        label: "Tours and days out",
        text: "Island tours, shows and day trips are priced separately. A fixed package states which are included, and we do the same in every proposal.",
      },
      {
        label: "Who is travelling",
        text: "Family rooms, children's fares and group size change the per-person figure.",
      },
    ],
    closing:
      "We do not publish a single Thailand price, because these choices change it. Tell us your dates and who is travelling, and the itemised proposal comes back within one working day.",
    links: [
      {
        href: "/packages/thailand-phuket-krabi-festival",
        label: "See what the Phuket + Krabi package includes",
      },
    ],
    cta: "Get a Thailand proposal",
  },
  extraFaqs: [
    {
      question: "How much does a Thailand tour package from Mumbai cost?",
      answer:
        "It depends on the season, where you stay, hotel category, the tours you choose and who is travelling, so we do not publish one fixed price. A fixed package and a trip built from scratch are quoted differently, and every proposal is itemised.",
    },
    {
      question: "Is there a Thailand package from Mumbai with flights included?",
      answer:
        "Yes. The Phuket + Krabi Festival Special is a five-night package from Mumbai with non-stop return flights on Akasa Air, three nights in Phuket, two in Krabi, 4-star hotels and island tours with lunch. Its page lists the exact hotels and inclusions.",
    },
    {
      question: "How long is the flight from Mumbai to Thailand?",
      answer: "About 4 to 4.5 hours, direct.",
    },
    {
      question: "How many nights do I need for Thailand from India?",
      answer:
        "Four to seven nights suits most trips. That is enough for Bangkok on its own, and Phuket or Chiang Mai can be added to extend it.",
    },
  ],
};
