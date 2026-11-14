import type { PhotoKey } from "@/lib/images";

/**
 * Who the fixed-departure and private packages suit. Shown above the package
 * list so a visitor can see themselves in it before reading any itinerary.
 * Every claim here is already made elsewhere on the site.
 */
export type PackageAudience = {
  slug: string;
  title: string;
  /** Who this is for, in one line. */
  forWhom: string;
  /** What we arrange for them, in plain words. */
  body: string;
  /** Concrete points, shown as a short list. */
  points: string[];
  image: PhotoKey;
  imageAlt: string;
  /** Where to go next. */
  cta: { label: string; href: string };
};

export const packageAudiences: PackageAudience[] = [
  {
    slug: "families",
    title: "Families",
    forWhom: "Parents, children and grandparents travelling together.",
    body: "A slower pace and fewer hotel changes, so the youngest and the oldest in the party can keep up. We plan the days around nap times, long lunches and the one attraction everyone will remember.",
    points: [
      "Longer stays in fewer places",
      "Hotels chosen for location and space",
      "Pace set by the slowest walker",
    ],
    image: "dubaiMarinaCamels",
    imageAlt: "Camels on a beach with towers behind, a family-friendly Dubai day",
    cta: { label: "Plan a family trip", href: "/contact" },
  },
  {
    slug: "couples",
    title: "Couples and honeymoons",
    forWhom: "Honeymooners, anniversary trips and couples who want time to themselves.",
    body: "Private itineraries with unhurried days and stays chosen for the view and the setting, not the star rating. We keep the schedule loose enough for the unplanned evening.",
    points: [
      "Private itineraries for two",
      "Romantic stays chosen with care",
      "Room for days with nothing planned",
    ],
    image: "baliRiceTerraces",
    imageAlt: "Rice terraces in Bali at golden hour",
    cta: { label: "Plan a honeymoon", href: "/contact" },
  },
  {
    slug: "friends-and-groups",
    title: "Friends and groups",
    forWhom: "Friends, cousins, colleagues and clubs travelling together.",
    body: "A group departure keeps everyone on one itinerary, with shared days and the freedom to split up in the evenings. For a larger party, we can quote group fares and block hotel allocations on request.",
    points: [
      "One itinerary for the whole group",
      "Group fares and block hotel bookings on request",
      "Shared days, free evenings",
    ],
    image: "parisStreet",
    imageAlt: "A quiet Paris street in morning light",
    cta: { label: "Ask for a group quote", href: "/contact" },
  },
  {
    slug: "slow-pace-travellers",
    title: "Older travellers and slower trips",
    forWhom: "Travellers who want comfort, fewer early starts and a route with rest built in.",
    body: "A route with fewer changes, fewer early departures and rest days built in. The point is to arrive at each place with energy left, not to see the most in the least time.",
    points: [
      "Fewer changes of hotel and city",
      "Rest days built into the route",
      "No 5am coach transfers as standard",
    ],
    image: "swissLauterbrunnen",
    imageAlt: "The Lauterbrunnen valley and its waterfall",
    cta: { label: "Plan a slower trip", href: "/contact" },
  },
  {
    slug: "corporate-and-incentive",
    title: "Corporate and incentive travel",
    forWhom: "HR teams, offsites and employee rewards.",
    body: "Business trips, team offsites and incentive travel managed with the same care as a leisure holiday. You get one point of contact and invoice-ready bookings.",
    points: [
      "One named contact for the whole trip",
      "Group visas and coordinated bookings",
      "Invoice-ready for your accounts team",
    ],
    image: "londonBusDusk",
    imageAlt: "A red London bus at dusk",
    cta: { label: "Ask for a corporate quote", href: "/b2b-partners" },
  },
];
