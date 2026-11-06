import type { DestinationSeo } from "./types";

/**
 * Keyword targets come from Ubersuggest (India, English, Nov 2026):
 *   "tour packages for europe from mumbai"  ~1.9K/mo, difficulty 23
 *   "europe tour packages from mumbai"      ~1.6K/mo, difficulty 34
 *   "europe tour cost from india"           ~1.6K/mo, difficulty 45
 *   "europe tour package price from india"  ~110/mo,  difficulty 16
 */
export const europe: DestinationSeo = {
  title: "Europe Tour Packages from Mumbai & India",
  description:
    "Europe tour packages from Mumbai: private itineraries, Schengen visa filing, flights and a named consultant. Itemised proposal within one working day.",
  answerLead:
    "Looking for Europe tour packages from Mumbai? We design private Europe itineraries around two or three countries, with flights from Mumbai, Schengen visa filing, hotels, transfers and one named consultant from the first call to the flight home.",
  cost: {
    eyebrow: "Europe tour cost from India",
    title: "What a Europe tour costs, and what moves the price",
    lede: "There is no single Europe package price, because the same two weeks can cost very different amounts depending on how it is built. These are the five things that move the number most.",
    items: [
      {
        label: "When you travel",
        text: "Flights and hotels from Mumbai cost noticeably more in the northern summer and around Christmas than in the shoulder months either side.",
      },
      {
        label: "How many countries",
        text: "Every extra country adds a train or flight, a hotel change and a day of transit. Two or three countries over two weeks costs less, and feels better, than six.",
      },
      {
        label: "Hotel category",
        text: "Central hotels in older cities cost more than modern ones near the station. We tell you what the difference buys before you choose.",
      },
      {
        label: "Who is travelling",
        text: "Family rooms, children's fares and group size all change the per-person figure, in both directions.",
      },
      {
        label: "What you want us to handle",
        text: "Visa filing, Schengen-compliant insurance, forex, rail passes and guided days can each be included or left out of the proposal.",
      },
    ],
    closing:
      "Send us your rough dates and who is travelling, and you get an itemised proposal within one working day, with what is included and what is not stated plainly.",
    links: [
      {
        href: "/guides/schengen-visa-from-india-guide",
        label: "Schengen visa guide for Indian travellers",
      },
      {
        href: "/guides/how-many-countries-first-europe-trip",
        label: "How many countries a first Europe trip should cover",
      },
    ],
  },
  extraFaqs: [
    {
      question: "How much does a Europe tour package from Mumbai cost?",
      answer:
        "It depends on your dates, the number of countries, hotel category, group size and how much you want us to handle, so we do not publish one fixed price. Every enquiry gets an itemised proposal within one working day, so you can see exactly where the money goes before you commit.",
    },
    {
      question: "How many days do I need for a Europe trip from India?",
      answer:
        "Ten to fifteen days works well for two or three countries. We plan fewer stops with longer stays rather than a different city every night, because that is the version of Europe people remember. Our guide to how many countries a first Europe trip should cover goes through it in detail.",
    },
    {
      question: "Do you arrange the Schengen visa as part of a Europe package?",
      answer:
        "Yes. We prepare and file the Schengen application and plan the itinerary around your appointment dates. The United Kingdom is not in the Schengen area, so a UK stop needs its own visa on its own timeline, and we file that too.",
    },
    {
      question: "Are flights from Mumbai included in your Europe tour packages?",
      answer:
        "Flights from Mumbai are quoted as part of the itinerary, including open-jaw routings where you fly into one city and out of another. If you prefer to book flights yourself, we plan the land arrangements around them.",
    },
    {
      question: "Which Europe tour is best for a first-time traveller from India?",
      answer:
        "For a first trip we usually suggest two or three countries that connect easily, such as France with Switzerland, or Italy with Switzerland, rather than a rushed multi-country circuit. Tell us your dates and who is travelling and we will recommend a route.",
    },
  ],
};
