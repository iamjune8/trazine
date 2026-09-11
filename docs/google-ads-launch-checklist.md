# Google Ads Launch Checklist — Before Activating Campaigns

Everything required before turning on paid spend, in the order it actually
blocks you. ✅ = built and verified in this session. ⏳ = needs an action in
an external account (Google Ads, GA4, Search Console) — none of these are
blocked on further engineering work, they're yours to do.

---

## 1. Landing pages — built and verified

- ✅ Six dedicated pages live at `/lp/dubai`, `/lp/thailand`, `/lp/bali`,
  `/lp/japan`, `/lp/europe`, `/lp/vietnam` — confirmed all return HTTP 200
  in the production build; a 7th slug (`/lp/malaysia`) correctly 404s,
  confirming the page doesn't silently accept destinations outside this
  launch's scope
- ✅ Each page: one destination, no site navigation (no header nav links,
  no mobile menu, no footer link columns — just wordmark, phone, and a
  legally-necessary address/Privacy/Terms footer)
- ✅ One primary CTA above the fold (`Get a Free {Destination} Itinerary`),
  repeated in the sticky bar
- ✅ Short enquiry form — 4 fields (name, phone, email, optional travel
  month) instead of the main site's 10-field form — confirmed it posts to
  the same `/api/inquiries` endpoint and lands in the same admin `Leads`
  inbox as every other enquiry source
- ✅ WhatsApp and Call both present twice — inline in the hero, and in the
  sticky bar shown at every screen size on these pages
- ✅ Trust indicators are the same genuine, already-published business
  figures used elsewhere on the site (5+ years, 1,000+ customers, 96%
  first-time visa approval, one named consultant) — no invented stats, no
  testimonials (none of the six destinations has enough genuine,
  attributable review data — see `docs/deployment-checklist.md`)
- ✅ Load weight measured against the organic destination page it's built
  from, in the production build: **54KB rendered HTML / 12 JS chunks**
  for `/lp/dubai` vs **219KB / 17 chunks** for `/destinations/dubai` — the
  animation library, enquiry modal, and full header/footer/nav JS never
  load on `/lp/*` at all (separate root layout, see
  `src/app/lp/layout.tsx`). This is the structural basis for the "loads
  fast" goal; an actual field measurement (Lighthouse/PageSpeed on the
  live domain, item 6 below) is still the real test.
- ✅ Canonical tag on each `/lp/{slug}` page points at the matching
  `/destinations/{slug}` organic page, so the two don't compete as
  duplicate content in search — confirmed in rendered HTML
  (`<link rel="canonical" href="https://travzine.in/destinations/dubai"/>`)
- ✅ FAQ schema (`FAQPage` JSON-LD) present and valid on each page, built
  from the same genuine per-destination FAQ content as the main site —
  confirmed in rendered HTML

## 2. Tracking — verified firing from the landing pages specifically

Not re-derived from the main site's tracking fix — checked directly on
`/lp/thailand` in a real browser:

- ✅ GA4's `gtag.js` loads and configures correctly on `/lp/*` pages
  (confirmed `window.gtag` exists, `dataLayer` shows the `config` call
  with the real measurement ID) — the separate root layout for `/lp/*`
  loads its own copy of the GA4/GTM scripts, so this wasn't something to
  assume from the main site working
- ✅ Clicking the WhatsApp button on `/lp/thailand` pushed
  `gtag('event', 'whatsapp_click', {source: 'lp-thailand', destination:
  'Thailand'})` into `dataLayer` — confirmed by reading `dataLayer`
  directly after the click, not just reading the code
- ✅ The `source: 'lp-<slug>'` tag on every event from these pages is
  distinct from the main site's `destination-<slug>` sources — so once
  reporting is live, paid-landing-page leads/clicks are separable from
  organic-site ones in GA4 and in the admin Leads table
- ✅ `trackConversion()` calls are present in the same code path (hero
  Call/WhatsApp, sticky bar, and the short form's `generate_lead`) —
  currently no-ops because the four `NEXT_PUBLIC_GOOGLE_ADS_*` env vars
  aren't set yet (same "inert until configured" pattern as everywhere
  else), not because anything is missing from the landing pages
  specifically
- ⏳ **Once the env vars are set** (item 4 below), repeat this same
  DebugView check on a live `/lp/{slug}` page — this checklist verified
  the event fires; it did not verify the Ads conversion because there is
  nothing to fire yet in a fresh account

## 3. Campaign build — reference

- ✅ Full account structure, keyword sets, negative keywords, ad copy,
  sitelinks, callouts, structured snippets and budget starting point:
  see [google-ads-implementation-guide.md](google-ads-implementation-guide.md)
- ✅ Every ad group's Final URL updated to point at `/lp/{slug}`, not the
  organic destination page
- ⏳ **Build the actual campaigns in the Google Ads UI/Editor** from that
  guide — this checklist and the guide give you the structure and content,
  they don't create the campaigns for you

## 4. Conversion tracking activation (external account work)

- ⏳ Link Google Ads ↔ GA4 (GA4 Admin → Product links)
- ⏳ Create 3 Google Ads conversion actions: lead form submit (primary),
  phone click (secondary), WhatsApp click (secondary) — one conversion ID,
  three labels
- ⏳ Set `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` and the three
  `NEXT_PUBLIC_GOOGLE_ADS_LABEL_*` vars in production `.env`, redeploy
- ⏳ Turn on **Enhanced conversions for leads** (Conversions → Settings) —
  the code already passes email/phone via `gtag('set', 'user_data', ...)`,
  this is a toggle, not a code change
- ⏳ Confirm `NEXT_PUBLIC_GA_MEASUREMENT_ID` in production is the GA4
  property you actually want this campaign's traffic attributed to

## 5. Google Ads account & policy

- ⏳ Verify the phone number that will appear in call extensions actually
  receives sales calls during the hours you want ad-driven calls answered
- ⏳ Submit the account for standard Google Ads policy review if this is a
  new account (travel agencies sometimes get an additional identity/
  business verification request — respond promptly, it pauses serving
  until resolved)
- ⏳ Confirm billing is set up and a realistic starting budget (see the
  implementation guide, Section 5) is entered before enabling campaigns

## 6. Real-world verification (do this on the live production domain, not localhost)

- ⏳ Run Lighthouse/PageSpeed Insights against a live `/lp/{slug}` URL —
  the 2.5s target is a real-network measurement, not something local dev
  timing can confirm
- ⏳ Load each of the 6 `/lp/{slug}` pages on an actual phone; tap Call,
  WhatsApp, and submit one real test enquiry end to end
- ⏳ Confirm the test enquiry lands in `/admin/leads` with
  `source: "lp-<slug>"`, and that GA4 DebugView shows the matching events
  in real time
- ⏳ Once conversion actions are live (item 4), send one real test
  conversion through and confirm it appears in Google Ads within the
  normal reporting delay (up to a few hours) before trusting the number
  for optimization decisions

## 7. Rollout order

Same order as the implementation guide's Section 8 — Brand campaign alone
for 24–48 hours to prove tracking end to end on real spend, then Easy &
Affordable, then Premium Luxury a day apart, then a 7-day hands-off period
before touching bidding, budgets or match types.

---

**Bottom line**: everything in Sections 1–3 is done and verified in code —
there is no landing-page or tracking engineering work standing between here
and campaign launch. Sections 4–7 are Google Ads account setup and
real-world verification, all of it outside this codebase, all of it yours
to do next.
