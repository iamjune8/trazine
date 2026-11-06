import type { DestinationSeo } from "./types";

/**
 * Keyword targets (Ubersuggest, India, English, Nov 2026):
 *   "vietnam tour package from mumbai"  ~2.4K/mo, difficulty 14
 *   "vietnam trip from mumbai"          ~260/mo,  difficulty 14
 *   "vietnam travel packages"           ~74K/mo,  difficulty 20
 *   "vietnam tour packages"             ~74K/mo,  difficulty 25
 *
 * Facts below come from the Vietnam destination page and the Vietnam Getaway
 * package page (/packages/vietnam-getaway). No prices are stated.
 */
export const vietnam: DestinationSeo = {
  title: "Vietnam Tour Packages from Mumbai & India",
  description:
    "Vietnam tour packages from Mumbai and across India: Hanoi, Da Nang and Ho Chi Minh City, as a fixed 7-night package or a trip built around your dates.",
  h1: "Vietnam tour packages from Mumbai",
  answerLead:
    "Looking for a Vietnam tour package from Mumbai? We plan Vietnam holidays for travellers from Mumbai and across India, either as a fixed 7-night package through Hanoi, Da Nang and Ho Chi Minh City or as a trip built around your dates, with a named consultant handling flights, hotels, sightseeing and visa guidance.",
  plan: {
    eyebrow: "Packages from Mumbai",
    title: "Two ways to do Vietnam from Mumbai",
    lede: "Vietnam is long and narrow, so the route matters more than the hotel. A first trip usually covers the north and centre, and doing the full length of the country comfortably takes ten nights or more.",
    items: [
      {
        label: "A fixed departure: Vietnam Getaway",
        text: "Seven nights from Mumbai: three in Hanoi, two in Da Nang and two in Ho Chi Minh City, with flights, hotels and sightseeing already arranged, including a Ha Long Bay day cruise and the Ba Na Hills cable car to the Golden Bridge.",
      },
      {
        label: "A trip built for you",
        text: "If the dates, route or length of the fixed package do not fit, we plan Vietnam from scratch. Seven to ten nights is the usual range, running from Hanoi and Ha Long Bay in the north to Ho Chi Minh City in the south.",
      },
      {
        label: "Flying from Mumbai",
        text: "About 6 to 7 hours, typically with one connection.",
      },
      {
        label: "Choosing your month",
        text: "There is no single perfect month for the whole country. Broadly, October to April is the more reliably dry window for Hanoi and Ho Chi Minh City, while Da Nang and Hoi An are most pleasant from February to May.",
      },
    ],
    closing:
      "The package page lists the exact hotels, flights and inclusions. For a different route or different dates, send us your plans and a consultant replies within one working day.",
    links: [
      { href: "/packages/vietnam-getaway", label: "Vietnam Getaway 7-night package" },
      { href: "/services", label: "Visa, flights and on-ground arrangements" },
    ],
    cta: "Ask about Vietnam from Mumbai",
  },
  cost: {
    eyebrow: "Vietnam tour package cost",
    title: "What decides the cost of a Vietnam trip",
    lede: "The cost of a Vietnam tour package from Mumbai depends on a handful of choices more than on Vietnam itself. These are the ones that move it most.",
    items: [
      {
        label: "The route",
        text: "North only costs less than Hanoi to Ho Chi Minh City, because every region you add means another internal flight and another hotel change.",
      },
      {
        label: "The number of nights",
        text: "Seven nights covers the classic circuit. Ten or more lets the full length of the country be done without rushing.",
      },
      {
        label: "Hotel category",
        text: "Old-quarter boutique hotels and beach resorts are priced very differently, and we say what the difference buys before you choose.",
      },
      {
        label: "When you travel",
        text: "Peak travel months and local holidays raise flight and hotel prices, and the weather differs across the regions.",
      },
      {
        label: "Who is travelling",
        text: "Family rooms, children's fares and group size change the per-person figure.",
      },
    ],
    closing:
      "We do not publish a single Vietnam price, because these choices change it. Tell us your dates and who is travelling, and the proposal comes back itemised within one working day, with inclusions and exclusions stated.",
    links: [{ href: "/packages/vietnam-getaway", label: "See what the fixed 7-night package includes" }],
    cta: "Get a Vietnam proposal",
  },
  extraFaqs: [
    {
      question: "How much does a Vietnam tour package from Mumbai cost?",
      answer:
        "It depends on the route, number of nights, hotel category, travel dates and who is travelling, so we do not publish one fixed price. A fixed 7-night package and a trip built from scratch are quoted differently, and every proposal is itemised so you can see what is included.",
    },
    {
      question: "Is there a fixed-departure Vietnam package from Mumbai?",
      answer:
        "Yes. The Vietnam Getaway is a 7-night package from Mumbai: three nights in Hanoi, two in Da Nang and two in Ho Chi Minh City, with flights, hotels and sightseeing arranged. Its page lists the exact hotels, flights and inclusions.",
    },
    {
      question: "How long is the flight from Mumbai to Vietnam?",
      answer: "About 6 to 7 hours, typically with one connection.",
    },
    {
      question: "How many nights do I need for Vietnam from India?",
      answer:
        "Seven to ten nights suits most trips. A first trip usually covers the north and centre, and doing the full length of the country from Hanoi and Ha Long Bay to Ho Chi Minh City comfortably takes ten nights or more.",
    },
  ],
};
