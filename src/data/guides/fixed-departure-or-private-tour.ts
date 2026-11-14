import type { Guide } from "./types";

export const fixedDepartureOrPrivateTour: Guide = {
  slug: "fixed-departure-or-private-tour",
  title: "Fixed departure or private tour: how to choose",
  headline: "Group or private, which suits you?",
  eyebrow: "Planning your trip",
  description:
    "Fixed departures suit travellers who want set dates and a group. Private tours suit families, couples and anyone who wants their own pace. How to choose.",
  lede: "A fixed departure is a set itinerary with set dates and a group. A private tour is built around you. Here is how to choose between them.",
  image: "departureBoardRetro",
  imageAlt: "A vintage departure board showing destinations",
  published: "2026-11-16",
  updated: "2026-11-16",
  body: [
    {
      type: "p",
      text: "Both options get you to the same places. The difference is who decides the dates, the pace and the company you keep along the way.",
    },
    { type: "h2", text: "What each option means" },
    {
      type: "p",
      text: "A **fixed departure** runs on set dates with a planned itinerary and a limited number of seats. A **private tour** is planned around your dates, your pace and the people travelling, and is booked for your group alone.",
    },
    {
      type: "table",
      head: ["", "Fixed departure", "Private tour"],
      rows: [
        ["Dates", "Set by the operator", "Set by you"],
        ["Pace", "Shared, with a fixed schedule", "Your own pace and order"],
        ["Group", "Other travellers on the same trip", "Only your party"],
        ["Planning effort", "Lower, the itinerary is set", "Higher, we build it with you"],
        ["Price", "Often lower, shared costs", "Higher, but tailored"],
      ],
    },
    { type: "h2", text: "Choose a fixed departure if" },
    {
      type: "ul",
      items: [
        "Your dates are flexible and you want a trip that is already planned.",
        "You enjoy a group and do not mind a shared schedule.",
        "You want to compare what is included before you commit.",
      ],
    },
    { type: "h2", text: "Choose a private tour if" },
    {
      type: "ul",
      items: [
        "Your dates are fixed, for a wedding, an anniversary or school holidays.",
        "Your party has children, older travellers or anyone who needs a slower pace.",
        "You want a honeymoon, a family holiday or a trip with specific interests.",
      ],
    },
    { type: "h2", text: "Questions that decide it" },
    {
      type: "p",
      text: "Ask yourself how many nights you have, who is travelling, and how much you are willing to plan. If you would rather not plan, a fixed departure saves time. If the trip matters to a particular person or date, a private tour is the safer choice.",
    },
    {
      type: "note",
      text: "Whichever you choose, ask for the itinerary, the named hotels and the inclusions in writing before you pay.",
    },
  ],
  faqs: [
    {
      question: "Is a fixed departure always cheaper?",
      answer:
        "Often, because costs are shared across the group. But compare the inclusions, not only the price, since a cheaper package can leave out flights, transfers or sightseeing.",
    },
    {
      question: "Can I customise a fixed departure?",
      answer:
        "Usually only within limits set by the operator. If you want changes to the route or dates, a private tour gives you more control.",
    },
  ],
  disclaimer:
    "Operators set their own terms for each departure. Check the inclusions, dates and cancellation terms in writing before you book.",
  related: ["schengen-travel-insurance-rules", "how-many-countries-first-europe-trip"],
};
