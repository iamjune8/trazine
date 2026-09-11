# Google Ads Implementation Guide — Travzine

This guide covers campaign structure, keyword sets, ad copy, budgets and
conversion goals for the six destination landing pages built for this
launch: Dubai, Thailand, Bali, Vietnam (Easy & Affordable tier) and Japan,
Europe (Premium Luxury tier).

**A note on numbers**: keyword search-volume and CPC figures are not
included here as specific values — this account has no live Google Ads
history and I have no access to real-time Keyword Planner data for this
audit, so any number I typed would be a guess dressed up as data. Every
budget below is instead given as a **starting allocation with a rule for
adjusting it**, exactly as you'd set it on day one before the account has
its own performance history. Pull actual volume/CPC from Keyword Planner
once the account is linked, and use that to refine the split in week 2.

---

## 1. Account structure

```
Travzine (account)
├── Campaign: Easy & Affordable — Search
│   ├── Ad group: Dubai
│   ├── Ad group: Thailand
│   ├── Ad group: Bali
│   └── Ad group: Vietnam
├── Campaign: Premium Luxury — Search
│   ├── Ad group: Japan
│   └── Ad group: Europe
├── Campaign: Brand — Search
│   └── Ad group: Travzine / Travel Magazine
└── Campaign: Retargeting — Display/YouTube (Phase 2, after Search has conversion data)
```

**Why split Easy & Affordable from Premium Luxury into separate campaigns**
rather than one campaign with six ad groups: budget and bidding both need to
behave differently per tier. A ₹40,000 Dubai package and a ₹2,50,000 Europe
circuit have entirely different target CPAs, and Smart Bidding (once enabled)
learns much faster when a campaign's conversions are all the same rough deal
size. Keeping the tiers apart also lets you turn off Premium spend in a slow
month without touching Easy & Affordable, and vice versa.

**Why a separate Brand campaign**: someone searching "travzine" or "travel
magazine mumbai" already knows who you are — that click should be cheap and
isolated from destination budgets, and its Quality Score will be near-perfect
regardless of how the destination campaigns are performing.

Each ad group maps to exactly one landing page (`/destinations/dubai`,
`/destinations/thailand`, etc.) — never send an ad group's traffic to the
generic `/destinations` index. A dedicated landing page whose H1, imagery and
FAQ match the ad's promise is the single biggest lever on Quality Score's
"landing page experience" component, and it is also what these six pages
were specifically rebuilt to do.

---

## 2. Keyword sets

### 2.1 Ad group: Dubai (Easy & Affordable)

**Exact/Phrase match, high intent:**
- "dubai tour packages"
- "dubai tour packages from india"
- "dubai tour packages from mumbai"
- "dubai holiday packages"
- "dubai honeymoon package"
- "dubai family package"
- "dubai trip cost from india"
- "book dubai tour"

**Broad match (modifier-style, Smart Bidding will expand these safely):**
- dubai travel agent
- dubai tour operator india

### 2.2 Ad group: Thailand (Easy & Affordable)

- "thailand tour packages"
- "thailand tour packages from india"
- "thailand tour packages from mumbai"
- "phuket krabi package"
- "bangkok pattaya package"
- "thailand honeymoon package"
- "thailand package cost"
- "thailand family holiday package"

### 2.3 Ad group: Bali (Easy & Affordable)

- "bali tour packages"
- "bali tour packages from india"
- "bali honeymoon package"
- "bali package cost from india"
- "bali holiday package"
- "bali trip planner"

### 2.4 Ad group: Vietnam (Easy & Affordable)

- "vietnam tour packages"
- "vietnam tour packages from india"
- "vietnam holiday package"
- "vietnam package cost"
- "hanoi ho chi minh tour package"

### 2.5 Ad group: Japan (Premium Luxury)

- "japan tour packages"
- "japan tour packages from india"
- "japan tour package cost"
- "japan cherry blossom tour"
- "tokyo kyoto tour package"
- "japan luxury tour"
- "japan honeymoon package"

### 2.6 Ad group: Europe (Premium Luxury)

- "europe tour packages"
- "europe tour packages from india"
- "europe honeymoon package"
- "switzerland tour package"
- "europe multi country tour"
- "schengen tour package"
- "europe luxury tour package"
- "europe family tour package"

### 2.7 Brand

- "travzine"
- "travel magazine mumbai"
- "travzine.in"

---

## 3. Negative keywords

Apply these as **shared negative keyword lists** at the account level (or
campaign level for the destination/job-related ones) so every ad group
inherits them without re-entering per campaign.

**Free/DIY intent — filters out non-buyers:**
- free, "do it yourself", diy, "without agent", "self planned", "budget backpacking", hostel, "solo backpacking"

**Information-only, not ready to book:**
- "how to reach", "how to go", "distance from", "weather in", "best time to visit" (this one is a judgment call — see note below), wikipedia, "history of"

**Wrong audience:**
- job, jobs, visa sponsorship, "work visa", "study visa", immigration, "permanent residency", "citizenship by investment", "real estate", property, "buy apartment", rent, "student visa"

**Wrong product:**
- cruise only (if you don't sell standalone cruises), "flight only", "hotel only", "one way ticket"

**Competitor/other-agency brand terms** — add once you've identified which
competitor names are drawing impressions in the Search Terms report; don't
guess these in advance.

> Note on "best time to visit [destination]": this phrase pulls in a lot of
> pure-research traffic, but it's also how some genuinely high-intent
> travellers phrase an early search. Recommend leaving it **out** of the
> negative list initially and reviewing the Search Terms report after two
> weeks — add it as a negative only if it's actually converting at a much
> lower rate than the rest of the ad group, rather than negating it on
> assumption.

---

## 4. Ad copy

Three Responsive Search Ads per ad group is the Google-recommended minimum
for the system to have enough creative variety to test. Below is one
starting RSA per destination — duplicate the pattern with the destination
name swapped for the other Easy & Affordable / Premium ad groups, and write
2 more variants per ad group before launch so each group has 3.

Headlines and descriptions are written to be literally true against the
current site content — the itemised-proposal promise, the named-consultant
claim, and the visa-approval figure all match what's already on the pages
and in `src/data/services.ts`. Do not add a headline claiming something the
landing page doesn't actually say.

### Dubai (Easy & Affordable)

**Headlines** (pick 8–10 for the RSA; a few extra beyond the ones below give
Google more combinations to test):
1. Dubai Tour Packages From India
2. Dubai Trip, Itemised & Costed
3. Family, Honeymoon & Solo Dubai Trips
4. Talk to a Named Consultant
5. Dubai Visa Filed For You
6. No Guesswork — Proposal in 1 Working Day
7. Direct Flights From Mumbai
8. 1,000+ Trips Planned

**Descriptions:**
1. Tell us your dates and group size. You'll have a costed, itemised Dubai proposal within one working day — hotels named, inclusions listed.
2. UAE e-visa filed by us, typically approved in 3–5 working days. One named consultant handles your trip start to finish.

**Final URL:** `https://travzine.in/destinations/dubai`

**Path fields:** `/dubai-packages` (path1), `/from-india` (path2) — Ads
constructs the display path as `travzine.in/dubai-packages/from-india`; this
is cosmetic only and doesn't need to be a real route.

### Europe (Premium Luxury — tone shifts from "affordable/fast" to "considered/curated")

**Headlines:**
1. Europe Tour Packages From India
2. A Circuit Built Around Your Dates
3. Switzerland, Paris & Beyond
4. Schengen Visa Handled For You
5. One Consultant, One Itinerary
6. 96% Visa Approval, First Attempt
7. Multi-Country Circuits, Properly Paced
8. Talk to a Europe Specialist

**Descriptions:**
1. Not a fixed package — an itinerary built around which countries and how many nights you actually want, with the reasoning explained.
2. Schengen visa filed and tracked by us. Ask about our honeymoon and multi-generational family circuits.

**Final URL:** `https://travzine.in/destinations/europe`

### Sitelink extensions (apply account-wide, all campaigns)

| Sitelink text | URL | Description line |
|---|---|---|
| WhatsApp Us | `/contact` | Usually answered within the hour |
| All Destinations | `/destinations` | Easy & Affordable and Premium Luxury journeys |
| Our Packages | `/packages` | Ready-built itineraries with fixed departures |
| About Travzine | `/about` | 5+ years, 1,000+ happy customers |

### Callout extensions

- Itemised proposals, no guessing
- Visa assistance included
- Named consultant per trip
- Replies within 1 working day

### Structured snippet (type: Destinations)

Dubai, Thailand, Bali, Vietnam, Japan, Europe

---

## 5. Recommended daily budgets (starting allocation)

Treat this as a **week-1 split**, not a permanent one — reallocate toward
whichever campaign shows the lower cost-per-lead once each has ~15–20
conversions to judge by (roughly 1–2 weeks at these levels for most
accounts; could be faster or slower depending on your actual CPCs).

| Campaign | Starting daily budget | Rationale |
|---|---|---|
| Brand | ₹300–₹500 | Cheap clicks, should almost never be budget-capped |
| Easy & Affordable (4 ad groups combined) | ₹2,000–₹3,000 | Higher search volume, lower CPC per click than Premium |
| Premium Luxury (2 ad groups combined) | ₹1,500–₹2,500 | Lower volume, higher CPC, but a much higher deal value per lead |
| **Total** | **₹3,800–₹6,000/day** | Adjust the whole account up only after CPA is known to be sustainable |

Within the Easy & Affordable campaign, let all four ad groups share the
budget rather than pre-splitting it evenly across Dubai/Thailand/Bali/
Vietnam — Google's budget optimiser will naturally favour whichever
destination is converting best, and manually forcing an even split fights
that.

**Bidding strategy**: start on **Maximize Conversions** (not Target CPA) for
the first 2–3 weeks on every campaign — Target CPA needs conversion history
to calibrate against, and setting a CPA target on day one with zero data is
effectively a guess. Once each campaign has 30+ conversions, switch to
Target CPA using the actual observed cost-per-lead as the starting target.

---

## 6. Conversion goals

The site's tracking (see [src/lib/analytics.ts](../src/lib/analytics.ts))
already fires these events with `send_to` pointed at Google Ads conversion
labels, gated behind environment variables that are currently unset:

| Conversion action | Env var | Fires from |
|---|---|---|
| Lead form submit | `NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD` | Enquiry form, package enquiry modal |
| Phone click | `NEXT_PUBLIC_GOOGLE_ADS_LABEL_CALL` | Every "Call" link site-wide |
| WhatsApp click | `NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP` | Every WhatsApp button/link site-wide |

**To activate, in Google Ads:**

1. Create a Google Ads conversion action for each of the three above
   (Tools & Settings → Conversions → New conversion action → Website).
2. Use the **same conversion ID** (`AW-XXXXXXXXXX`) for all three — it's one
   Ads account — and a distinct **label** per action.
3. Set `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` to that ID and the three
   `NEXT_PUBLIC_GOOGLE_ADS_LABEL_*` vars to their respective labels in
   `.env.local` (see `.env.example`), then redeploy.
4. Mark **lead form submit** as the **primary** conversion goal for
   Smart Bidding to optimise toward. Mark phone and WhatsApp clicks as
   **secondary** — they're valuable signals but a click isn't the same
   confirmed intent as a completed form, and letting Smart Bidding treat
   them identically to a lead will pull it toward cheap clicks instead of
   real enquiries.
5. **Enhanced Conversions for Leads**: already wired — the lead form passes
   email/phone via `gtag('set', 'user_data', ...)` before the conversion
   fires (see `trackConversion()` in `analytics.ts`). In Google Ads,
   Conversions → Enhanced conversions → turn on "Enhanced conversions for
   leads" and select "Google tag" as the method — no further code change
   needed once that toggle is on.
6. Import GA4 conversions as a supplementary check once GA4 has 2+ weeks of
   data — comparing GA4's and Ads' own lead counts is a good sanity check
   that Enhanced Conversions matching is working correctly, not a
   replacement for the Ads-native conversion above.

**GTM**: not required for any of this — the conversions above fire via
gtag.js directly, whether or not `NEXT_PUBLIC_GTM_CONTAINER_ID` is ever set.
Add a GTM container later only if you need tag types beyond GA4/Ads (e.g. a
CRM pixel), not as a prerequisite for what's described here.

---

## 7. Quality Score checklist (why the landing pages were built this way)

- ✅ Ad group ↔ landing page ↔ keyword theme all match (Dubai ad → Dubai
  page → Dubai keywords, never a generic destinations index)
- ✅ Landing page loads fast — LCP image uses `preload`, `sizes`, and a blur
  placeholder; no render-blocking scripts before first paint
- ✅ Mobile-first — sticky Call/WhatsApp/Enquire bar exists specifically
  because a large share of Ads traffic on travel queries is mobile, and a
  reader who has to scroll back up to find a contact method is a reader who
  bounces instead
- ✅ Clear, single primary CTA above the fold (the enquiry rail), with the
  same CTA repeated at the foot of the page (CTABand)
- ✅ Transparent policy content — a real Privacy Policy and Terms page exist
  and are linked from the footer, which Google's ad review checks for
- ⏳ **Not yet true, needs your input before launch**: a phone number
  visible in the ad itself (call extension) requires verifying the number
  receives sales calls during the hours you actually want ad-driven calls
  — confirm before adding the call extension

---

## 8. Rollout order

1. Link Google Ads to GA4 (Admin → Product links) before creating any
   conversion actions — this lets Ads inherit GA4's own event definitions
   later if you want to consolidate.
2. Create the three conversion actions (Section 6), fill in the four env
   vars, redeploy, and verify with Ads' own Tag Assistant / "Test your tag"
   tool that a real test form submission fires the lead conversion.
3. Launch Brand campaign alone for 24–48 hours to confirm tracking end to
   end on real traffic before spending on destination campaigns.
4. Launch Easy & Affordable, then Premium Luxury, each a day apart so any
   tracking issue is caught while only one campaign's budget is exposed.
5. Do not touch bidding strategy, budgets, or keyword match types for the
   first 7 days — Google's learning phase needs stable inputs, and daily
   tinkering resets it.
