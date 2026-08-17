# Travel Magazine

Marketing site for a Mumbai travel house selling private international
journeys to **Dubai, Switzerland, Paris and the United Kingdom**, plus a
multi-country "Europe in One Journey" package. Enquiry-led — every page drives
toward the enquiry form rather than displaying fixed prices.

Built with Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 +
Framer Motion. Design direction: luxury minimal (deep charcoal ink + brass
accent on warm paper, Playfair Display + Inter).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/                      Routes (App Router)
    page.tsx                Home
    destinations/           Destinations grid + /[slug] detail pages
    services/                Services (6 pillars: itinerary, visa, flights,
                             insurance, on-ground, support)
    about/                   About Us
    contact/                 Contact + inquiry form
    api/inquiries/route.ts   POST/GET endpoint for inquiry submissions
    layout.tsx, globals.css  Root layout, fonts, design tokens, entrance CSS
  components/
    site/                    Header, Footer, Logo
    sections/                Hero, MediaHeader, PageHeader, StatsBand,
                             DestinationsShowcase, Approach, ServicesSection,
                             Testimonials, FAQSection, CTABand
    enquiry/                 EnquiryContext, EnquiryModal, EnquiryForm,
                             EnquireButton — the site-wide enquiry system
    motion/                  Reveal/Stagger (scroll reveals), AnimatedHeading,
                             ParallaxImage, Counter
    ui/                      Button, Field, Accordion, Icon, Layout
    DestinationCard.tsx
  data/                      site.ts, destinations.ts, services.ts,
                             testimonials.ts, faqs.ts
  lib/                       images.ts, inquiry.ts, utils.ts, useReveal.ts
data/inquiries.json          Local JSON "database" of inquiry submissions
```

## Motion system

Above-the-fold entrances (hero, mastheads) are pure CSS keyframes defined in
`globals.css` and applied via server components — no client JS, no hydration
dependency, so the LCP content paints and animates even if the JS bundle is
slow or fails.

Below-the-fold scroll reveals (`<Reveal>`, `<Stagger>`) use a single shared
`IntersectionObserver` (`src/lib/useReveal.ts`) that sets `data-visible` on
scroll-into-view. The hidden state is gated behind an `html.js` class added by
a `beforeInteractive` script, so **with JavaScript disabled nothing is ever
hidden** — the page renders fully visible instead of blank. A safety sweep
after `load` reveals anything the observer missed.

`prefers-reduced-motion: reduce` strips all of this in one media query in
`globals.css` — reveals render at their end state with no transition.

## Inquiry form

Submissions from the header/footer/CTA "Enquire" modal, and the Contact page's
full form, both post to `POST /api/inquiries`, which validates the payload
(`src/lib/inquiry.ts`, shared between client and server) and appends it to
`data/inquiries.json`.

⚠ **This is a placeholder persistence layer.** It will not survive a redeploy
on most serverless hosts (Vercel, Netlify) because the filesystem is
read-only/ephemeral. Replace `persist()` in `src/app/api/inquiries/route.ts`
with a real database, CRM integration, or email/webhook notification before
go-live.

View current submissions during development at `/api/inquiries` (GET) — this
route is disabled in production for privacy.

## Images

Destination photography is real, hand-picked Unsplash photography (not
generic placeholders), catalogued with what's actually in frame in
`src/lib/images.ts`. Swap the `id` values there (or point `photo()` at a
different CDN) once the client's own photography is available — remember to
update `images.remotePatterns` in `next.config.ts` if you change host.

## Editing content

- **Destinations**: `src/data/destinations.ts`
- **Services**: `src/data/services.ts`
- **Testimonials**: `src/data/testimonials.ts` — ⚠ currently placeholder
  quotes; replace with real, attributable client testimonials before go-live
- **FAQs**: `src/data/faqs.ts`
- **Site config, nav, contact details, credentials**: `src/data/site.ts` — ⚠
  phone, email, address and trade credentials are placeholders
- **Colors / fonts / spacing**: `src/app/globals.css` (`@theme` block) and
  `src/app/layout.tsx` (font imports)

## Build

```bash
npm run build
npm run start
```

## Deploy

Any Next.js-compatible host works (Vercel is the simplest). Note the inquiry
API route needs a writable filesystem or a swapped-in database — see above.
# trazine
