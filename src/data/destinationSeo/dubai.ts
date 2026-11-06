import type { DestinationSeo } from "./types";

/**
 * Keyword targets (Ubersuggest, India, English, Nov 2026):
 *   "dubai tour packages from mumbai"  ~3.6K/mo, difficulty 24
 *   "dubai tours and packages"         ~22.2K/mo, difficulty 29
 *   "dubai visit packages"             ~22.2K/mo, difficulty 12
 *
 * There is no fixed-departure Dubai package page yet, so this entry describes
 * how a Dubai trip is built rather than pointing at a package. Facts come from
 * the Dubai destination page. No prices are stated.
 */
export const dubai: DestinationSeo = {
  title: "Dubai Tour Packages from Mumbai & India",
  description:
    "Dubai tour packages from Mumbai: direct flights of about 3 hours 15 minutes, 4 to 7 night trips for families and couples, with visa guidance.",
  h1: "Dubai tour packages from Mumbai",
  answerLead:
    "Looking for a Dubai tour package from Mumbai? Dubai is a direct flight of about three hours fifteen minutes, so it works for a long weekend or a week. We build Dubai trips to order for families, couples and first-time international travellers, with a named consultant handling flights, hotels, experiences and visa guidance.",
  plan: {
    eyebrow: "Dubai from Mumbai",
    title: "How a Dubai trip is put together",
    lede: "A Dubai trip is planned around your dates, the ages in your group and what you actually want to do, then itemised so you can compare it.",
    items: [
      {
        label: "Flying from Mumbai",
        text: "About 3 hours 15 minutes, direct. Dubai is 1 hour 30 minutes behind Indian Standard Time, so there is no jet lag to plan around.",
      },
      {
        label: "How long to stay",
        text: "Four to seven nights suits most trips. Four covers the main sights over a long weekend, and seven leaves room for slower days.",
      },
      {
        label: "Who Dubai suits",
        text: "Multi-generational family trips, first international trips, honeymoons and long weekends are what Dubai suits best.",
      },
      {
        label: "Visa",
        text: "UAE entry requirements can vary, so we confirm the current rules for your passport and dates before anything is booked.",
      },
    ],
    closing:
      "Send us your dates and who is travelling, and a consultant replies within one working day with an itemised Dubai proposal.",
    links: [
      { href: "/services", label: "Visa, flights and on-ground arrangements" },
      { href: "/destinations", label: "Browse every destination" },
    ],
    cta: "Plan Dubai from Mumbai",
  },
  cost: {
    eyebrow: "Dubai tour package cost",
    title: "What moves the price of a Dubai trip",
    lede: "Most of the difference between one Dubai quote and another comes from a few choices. These are the ones to settle first.",
    items: [
      {
        label: "When you travel",
        text: "Dubai's cooler months are the busiest and usually cost more than the hot summer months. School holidays and long weekends push prices up further.",
      },
      {
        label: "Hotel area and category",
        text: "A beachfront resort, a downtown tower and a quieter family hotel are priced very differently, and each suits a different kind of trip.",
      },
      {
        label: "Experiences",
        text: "Theme parks, desert experiences and observation decks are priced separately. We list which are included and which are optional.",
      },
      {
        label: "How long you stay",
        text: "Each extra night adds hotel cost, but flights and transfers do not repeat, so a longer stay lowers the cost per night.",
      },
      {
        label: "Who is travelling",
        text: "Family rooms, children's fares and larger groups change the per-person figure.",
      },
    ],
    closing:
      "We do not publish a single Dubai price. Tell us your dates and who is travelling, and the itemised proposal comes back within one working day.",
    links: [],
    cta: "Get a Dubai proposal",
  },
  extraFaqs: [
    {
      question: "How much does a Dubai tour package from Mumbai cost?",
      answer:
        "It depends on your dates, hotel area and category, the experiences you choose, how many nights you stay and who is travelling, so we do not publish one fixed price. Every enquiry gets an itemised proposal, so you can see what is included before you commit.",
    },
    {
      question: "How long is the flight from Mumbai to Dubai?",
      answer:
        "About 3 hours 15 minutes, direct. Dubai is 1 hour 30 minutes behind Indian Standard Time.",
    },
    {
      question: "How many nights should I spend in Dubai?",
      answer:
        "Four to seven nights suits most trips. Four covers the main sights over a long weekend, and seven leaves room for slower days.",
    },
    {
      question: "Can you plan Dubai for a family or a multi-generational group?",
      answer:
        "Yes. Multi-generational family trips are among the journeys Dubai suits best. Tell us the ages and any mobility needs, and we plan the days, the hotel and the transfers around them.",
    },
  ],
};
