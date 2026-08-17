# Claude Code Command — Travel Magazine Website

Copy everything in the code block below and paste it as your prompt in Claude Code (run `claude` in your project folder first).

```
Build a modern, visually striking website for my travel company, "Travel Magazine."

BRAND
- Name: Travel Magazine
- Slogan: "Travel World, Page by Page" — feature this prominently in the hero section
- Design direction: an editorial, magazine-style aesthetic (bold typography, full-bleed destination photography, page/spread-like section transitions) fused with a modern travel-brand feel. Warm, premium, wanderlust-inducing. Not generic or template-looking.

BUSINESS CONTEXT
Travel Magazine serves both B2B (travel agents, corporate/MICE clients) and B2C (individual travelers) customers. Core offerings:
1. Leisure travel packages — curated international holiday packages
2. Ticketing support — flight booking assistance for both domestic and Gulf-sector (Middle East) international routes
3. Domestic India packages — curated travel packages within India

FEATURED DESTINATIONS (international)
Thailand, Bali, Maldives, Kenya, Japan, South Korea — each needs its own destination card/section with a hero image, 2-3 line description, and a "View Packages" / "Enquire Now" CTA.

REQUIRED PAGES / SECTIONS
- Home: hero with slogan + tagline, brand intro, featured destinations grid, services overview, testimonials/trust section, CTA banner
- Destinations: gallery/grid of all destinations (Thailand, Bali, Maldives, Kenya, Japan, South Korea) plus a "Domestic India" category; each destination opens a detail view with highlights, best time to visit, and an enquiry CTA
- Services: three clear service pillars — Leisure Travel Packages, Ticketing Support (Domestic & Gulf Sector), Domestic India Packages
- B2B / Travel Partners: short section or page explaining B2B offerings for travel agents and corporate clients
- About Us: company story, why choose us, mission
- Contact / Inquiry: a prominent inquiry form (see below) plus contact details, office location, WhatsApp/phone/email
- Footer: quick links, destinations, social icons, contact info, newsletter signup

INQUIRY FORM (critical feature)
A working inquiry form accessible from the header (sticky "Enquire Now" button) and the Contact page, with fields:
- Full Name
- Email
- Phone Number
- Client Type (B2B / B2C — dropdown or toggle)
- Interested In (dropdown: Leisure Package / Ticketing Support / Domestic India Package / Corporate & Group Travel)
- Destination (dropdown, populated from the destinations list, optional "Other")
- Travel Dates (optional date range)
- Number of Travelers
- Message / Requirements (textarea)
- Submit button with success confirmation (store submissions locally for now — e.g., write to a JSON file or simple backend endpoint — and show a friendly "Thank you, our team will contact you shortly" confirmation state)

DESIGN & TECH REQUIREMENTS
- Fully responsive (mobile-first), fast-loading, accessible (semantic HTML, alt text, good color contrast)
- Smooth scroll animations and subtle hover/transition effects (avoid anything gimmicky or slow)
- Sticky navigation with logo, menu (Home / Destinations / Services / B2B / About / Contact), and a highlighted "Enquire Now" button
- Use a cohesive color palette inspired by travel/sunset/ocean tones (e.g., deep teal, warm terracotta/gold, cream/off-white background) — you choose exact hex values that feel premium and cohesive
- Use a distinctive editorial font pairing (serif for headings to reinforce the "magazine" feel, clean sans-serif for body text)
- Use high-quality placeholder images (royalty-free image URLs or generated placeholders) for each destination until real photography is supplied
- Build as a modern static/React site (your choice of stack — plain HTML/CSS/JS or Next.js/React with Tailwind CSS is fine) that I can easily host or hand off to a developer
- Include basic SEO meta tags (title, description, Open Graph tags) per page

DELIVERABLE
A complete, working, ready-to-preview website with all pages/sections above, the inquiry form functioning end-to-end, and clean, well-organized project structure with comments where helpful.
```

**Tip:** Run this from inside your empty project folder (e.g. `TRAVEL MAGAZINE`) so Claude Code scaffolds the site there directly.
