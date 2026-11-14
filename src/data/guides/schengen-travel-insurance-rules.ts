import type { Guide } from "./types";

export const schengenTravelInsuranceRules: Guide = {
  slug: "schengen-travel-insurance-rules",
  title: "Schengen travel insurance: the €30,000 rule explained",
  headline: "Schengen insurance, explained",
  eyebrow: "Visa and insurance",
  description:
    "Schengen visas require travel medical cover of at least €30,000. What the rule covers, how long the policy must last, and what to check before you buy.",
  lede: "A Schengen visa needs travel medical insurance of at least €30,000. Here is what that covers, what does not count toward it, and what to check before you buy.",
  image: "swissPeaksAboveCloud",
  imageAlt: "Alpine peaks rising above a sea of cloud",
  published: "2026-11-16",
  updated: "2026-11-16",
  body: [
    {
      type: "p",
      text: "Travel insurance is one of the few parts of a Schengen application that the consulate checks line by line. A policy that looks fine on the brochure can still be refused if it misses one of the required features.",
    },
    { type: "h2", text: "What the €30,000 minimum covers" },
    {
      type: "p",
      text: "The EU Visa Code requires medical insurance that covers emergency medical care, hospital treatment and repatriation, with a minimum cover of €30,000. The rule is set in Article 15 of Regulation (EC) No 810/2009, which you can read on EUR-Lex.",
    },
    {
      type: "table",
      head: ["What the policy must cover", "Why it matters"],
      rows: [
        ["Emergency medical care", "Treatment if you fall ill or are injured during the trip"],
        ["Hospital treatment", "Admission and care if you need to stay in hospital"],
        ["Repatriation", "Transport home if medical care requires it"],
      ],
    },
    { type: "h2", text: "Conditions the policy must meet" },
    {
      type: "ul",
      items: [
        "It must be valid in all Schengen countries, not only the one you enter first.",
        "It must cover the whole stay, from the first day to the last, including any days in transit.",
        "It must be issued for the dates on your application, so buy it after your dates are fixed.",
      ],
    },
    { type: "h2", text: "What does not count toward the minimum" },
    {
      type: "p",
      text: "Cover for trip cancellation, lost baggage and flight delays is useful, but it does not count toward the €30,000 medical minimum. A policy that offers only these benefits, or a small medical limit with a large cancellation limit, will not meet the rule.",
    },
    { type: "h2", text: "Check with the consulate you apply through" },
    {
      type: "p",
      text: "Some consulates read the rule more strictly. For example, they may expect €30,000 for each of medical treatment, evacuation and repatriation, not just a single total. The text of the rule is the same everywhere, but the requirements each consulate applies can differ, so confirm the wording with the consulate or the visa centre before you pay for a policy.",
    },
    { type: "h2", text: "What we check before we file" },
    {
      type: "p",
      text: "Before a visa file goes in, check the policy against the consulate's checklist: the medical limit, the countries covered and the dates. Fixing a shortfall before you apply is far easier than after a refusal.",
    },
    {
      type: "note",
      text: "Rules and consulate practice can change. Treat this guide as a planning summary and confirm the current requirements with the official source before you buy a policy.",
    },
  ],
  faqs: [
    {
      question: "Can I use my existing travel insurance for a Schengen visa?",
      answer:
        "Only if it meets the €30,000 medical minimum, covers every Schengen country, and covers your full stay. Many domestic or single-trip policies with lower medical limits do not qualify.",
    },
    {
      question: "When should I buy the policy?",
      answer:
        "After your travel dates are fixed, and before you apply. The policy must cover the dates on your application.",
    },
    {
      question: "Does a higher cancellation limit make up for a lower medical limit?",
      answer:
        "No. Cancellation cover does not count toward the medical minimum, so the medical limit itself has to reach €30,000.",
    },
  ],
  sources: [
    {
      label: "Regulation (EC) No 810/2009 (EU Visa Code), on EUR-Lex",
      href: "https://eur-lex.europa.eu/eli/reg/2009/810/oj",
    },
  ],
  disclaimer:
    "This is a planning summary, not legal advice. Requirements are set by the consulate you apply through and can change.",
  related: ["schengen-visa-from-india-guide", "how-many-countries-first-europe-trip"],
};
