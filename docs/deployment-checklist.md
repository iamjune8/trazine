# Deployment Checklist — SEO, Tracking & Ads Readiness

Status snapshot as of this launch batch. Items marked ✅ are verified done
in code; ⏳ items need a decision or an external account action from you
before they're actually live — none of them are blocked on further
engineering work.

## SEO

- ✅ Canonical URLs, OG/Twitter metadata generated per-page via
  `pageMetadata()` (`src/lib/seo.ts`)
- ✅ Breadcrumb (`BreadcrumbList`) schema on every destination, package and
  the contact page, matching the visible breadcrumb trail
- ✅ `Product`/`Offer` schema on package pages, with real base price and
  currency (no fabricated `AggregateRating`/`Review` schema — none of the
  packages/destinations has enough genuine review data to support it
  honestly)
- ✅ `TravelAgency` and `WebSite` schema in the root layout, `FAQPage`
  schema on pages with real FAQ content
- ✅ `/sitemap.xml`, `/robots.txt`, `/llms.txt` all generated dynamically
  from live destination/package/service data, so they can't drift stale
  the way a hand-written version would
- ✅ All 14 destinations and 3 packages have unique, non-templated intro
  copy, facts, and (where genuinely applicable) itinerary/FAQ content
- ✅ Alt text audited — decorative images correctly use `alt=""`,
  informational images have real descriptive alt text
- ⏳ **Google Search Console**: verify the property (if not already done)
  and submit the sitemap — this is an external-account step, not a code
  change
- ⏳ **Backlinks/off-page**: entirely outside this codebase's scope; not
  addressed here

## Analytics & tracking

- ✅ GA4 wired via `<GoogleAnalytics>`, inert until
  `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- ✅ GTM wired via `<GoogleTagManager>`, inert until
  `NEXT_PUBLIC_GTM_CONTAINER_ID` is set — **not required** for anything in
  this launch; only add a container if you later need tag types beyond
  GA4/Ads
- ✅ **Fixed this batch**: `trackEvent()` now calls `window.gtag()`
  directly. Previously, every click/lead event only pushed a GTM-format
  object to `dataLayer`, which a bare GA4 setup (no GTM container) never
  reads — meaning no click or lead event had actually reached GA4 before
  this fix, regardless of how long GA4 had been "installed"
- ✅ `trackConversion()` added — fires Google Ads conversions via
  `send_to: 'AW-ID/LABEL'`, wired into every call/WhatsApp click and every
  lead-form submission site-wide
- ✅ Enhanced Conversions for leads — email/phone passed via
  `gtag('set', 'user_data', ...)` before the lead conversion fires
- ⏳ **Confirm `NEXT_PUBLIC_GA_MEASUREMENT_ID` is your intended GA4
  property** — it's set in `.env.local` already, but verify it's the
  property you want traffic attributed to before ad spend begins
- ⏳ **Set the four `NEXT_PUBLIC_GOOGLE_ADS_*` env vars** (conversion ID +
  3 labels) once the Ads conversion actions exist — see the Ads guide,
  Section 6
- ⏳ **Verify in a real browser** after env vars are set: submit a real
  test enquiry, click a real Call link and a real WhatsApp link, and
  confirm all three show up in GA4 DebugView and in Google Ads' conversion
  test tool before turning on paid spend

## Landing pages (Dubai, Thailand, Bali, Vietnam, Japan, Europe)

- ✅ Each has its own `/destinations/{slug}` page — dedicated, not a shared
  generic page — with destination-specific hero, copy, facts, FAQ and
  itinerary content
- ✅ Sticky mobile Call/WhatsApp/Enquire bar (new this batch,
  `StickyMobileBar.tsx`) on every destination page, visible only below the
  `lg` breakpoint where the desktop sticky enquiry rail isn't shown
- ✅ Trust-badge stats band (real business figures — 5+ years, 1,000+
  customers, 96% first-time visa approval, one named consultant per
  journey) added to every destination page
- ✅ Clear, repeated CTA — the sticky enquiry rail near the top, and a
  full-width `CTABand` at the foot of the page
- ⏳ **Testimonials intentionally omitted from all six landing pages** —
  see below
- ✅ FAQ section renders per-destination where real FAQ content exists in
  the CMS

## ⚠ Flagged, not fixed as part of this batch — needs your decision

- **Four of the five rows in the live `testimonials` table are fabricated
  placeholder content**, not real customer reviews. They're commented in
  `src/data/testimonials.ts` as "PLACEHOLDER TESTIMONIALS... never publish
  invented reviews as genuine ones," but the exact same names/quotes are
  live on the homepage and About page right now via the CMS. Only the
  "Diggy Chaudhary" row (added later, informal phrasing) reads as a real
  submitted testimonial. You asked to leave this as-is for now rather than
  remove the placeholders — flagging it here so it isn't lost track of.
  Because of this, none of the six new destination landing pages includes
  a testimonials section; there isn't enough genuine, attributable review
  data per destination to add one honestly.

## Performance / Core Web Vitals

- ✅ LCP image on every page type (homepage hero, destination masthead)
  uses `preload` + explicit `sizes` + blur placeholder — audited this
  batch, homepage hero slideshow's first slide brought in line with the
  same convention (was using the now-deprecated `priority` prop)
- ✅ Every `fill`-mode `<Image>` site-wide has an explicit `sizes` prop
  (audited this batch — no missing ones found)
- ✅ Fonts self-hosted via `next/font` with `display: swap` — no external
  font request, no layout shift from a late font swap
- ✅ Framer Motion's drag/layout-projection modules excluded from the
  public bundle (only admin uses them)
- ⏳ **Run a real Lighthouse/PageSpeed Insights pass on the live domain**
  once deployed — static code review catches the structural issues above,
  but real network conditions and third-party script weight (GA4/Ads tags,
  once enabled) should be measured on the actual deployed site, not
  estimated from source

## Pre-launch smoke test (do this on the live deploy, not just locally)

1. Load each of the 6 destination pages on a real phone — confirm the
   sticky bar doesn't visually collide with anything, and Call/WhatsApp/
   Enquire all work
2. Submit one real test enquiry end-to-end (form → Supabase → email
   notification, if configured) and confirm it also shows as a GA4 event
   and (once Ads conversions are live) a test Ads conversion
3. Click a real phone link and a real WhatsApp link on a destination page
   and confirm both register in GA4 DebugView
4. Check `/sitemap.xml` and `/robots.txt` resolve correctly on the
   production domain (not just localhost)
5. Confirm the Google Maps embed on `/contact` renders (it deliberately
   returns 404 to a direct `curl`/browser navigation — that's the Embed
   API refusing non-iframe access, not a broken map; only real in-page
   rendering is a valid test)
