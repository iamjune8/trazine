import type { Guide } from "./types";

export const questionsBeforePayingTravelAgent: Guide = {
  slug: "questions-before-paying-travel-agent",
  title: "Eight questions to ask before you pay a travel agent",
  headline: "Eight questions before you pay",
  eyebrow: "Booking with confidence",
  description:
    "Eight questions to ask any travel agency before you pay: hotels, inclusions, cancellation, who holds your money, visa refusals and who to call on the trip.",
  lede: "A good travel agent can answer these eight questions in writing before you pay. If they cannot, that is your answer.",
  image: "planningFlatlay",
  imageAlt: "A map, notebook and camera laid out on a desk",
  published: "2026-11-16",
  updated: "2026-11-16",
  body: [
    {
      type: "p",
      text: "Most problems with a trip come from something that was never written down. These questions bring those details out before you pay, and they work for any agency, not only ours.",
    },
    { type: "h2", text: "The eight questions" },
    {
      type: "ol",
      items: [
        "**Which hotels, exactly?** You want names and star ratings, not 'a 4-star hotel in the city centre'.",
        "**What is included, and what is not?** Ask for flights, transfers, sightseeing, meals and tips, listed item by item.",
        "**What happens if I cancel?** Ask for the cancellation charges by date, and whether any part of the trip is non-refundable.",
        "**Who holds my money?** Ask which company receives the payment, and what invoice or receipt you will get.",
        "**What if my visa is refused?** Ask what is charged, what is refunded and what you would still owe.",
        "**Who do I call during the trip?** Get a named contact and a number that works where you will be.",
        "**What changes can you make after I book?** Ask about date changes, room upgrades and extra nights, and what each costs.",
        "**Can I have all of this in writing?** A quote, itinerary and terms in one document is a basic expectation.",
      ],
    },
    { type: "h2", text: "What to do if the answers are vague" },
    {
      type: "p",
      text: "Vague answers before you pay usually mean vague answers after. Ask for the details again in writing, and compare the replies from two or three agencies before you choose.",
    },
    {
      type: "note",
      text: "Ask us the same eight questions, and compare the written answers before you decide.",
    },
  ],
  faqs: [
    {
      question: "Should I pay the full amount upfront?",
      answer:
        "Ask the agency for its payment schedule and what each instalment covers. Make sure the schedule matches the cancellation terms you were given.",
    },
    {
      question: "Is it safe to pay by bank transfer?",
      answer:
        "Pay only to a company bank account in the agency's registered name, and ask for a receipt or invoice for every payment.",
    },
  ],
  disclaimer:
    "This is general guidance, not legal advice. Terms differ between agencies, airlines and hotels.",
  related: ["fixed-departure-or-private-tour", "schengen-travel-insurance-rules"],
};
