import { getDestinations } from "@/lib/content/destinations";
import { getActivePackages } from "@/lib/content/packages";
import { getServices } from "@/lib/content/services";
import { site } from "@/data/site";

/**
 * llms.txt (https://llmstxt.org) — a plain-text primer for AI assistants
 * and answer engines (ChatGPT, Claude, Gemini, Perplexity) that fetch a
 * page to answer a question about it. Generated from the same data sitemap.ts
 * reads (plus getServices(), which sitemap.ts doesn't need since /services
 * is one page with in-page anchors, not separate routes), so it can't drift
 * out of sync with what destinations/packages/services actually exist — this
 * is what caught the previous version of this file hand-listing services
 * with a stale anchor list that had already fallen behind the services table.
 */
export const revalidate = 3600;

export async function GET() {
  const [destinations, packages, services] = await Promise.all([
    getDestinations(),
    getActivePackages(),
    getServices(),
  ]);

  const destinationLines = destinations
    .map((d) => `- [${d.name}](${site.url}/destinations/${d.slug}): ${d.tagline}`)
    .join("\n");

  const packageLines = packages
    .map(
      (p) =>
        `- [${p.name}](${site.url}/packages/${p.slug}): ${p.nightsSummary}, from ${p.currency} ${p.basePrice.toLocaleString("en-IN")} per person`,
    )
    .join("\n");

  const serviceLines = services
    .map((s) => `- [${s.title}](${site.url}/services#${s.slug}): ${s.summary}`)
    .join("\n");

  const body = `# ${site.name}

> ${site.positioning}

${site.name} is a travel house based in ${site.address.city}, India, designing Premium Luxury circuits across Europe and Easy & Affordable journeys across Asia and the Gulf for Indian travellers. Every trip is planned by a single named consultant — itinerary design, visa filing, IATA ticketing and on-ground arrangements handled in-house rather than resold from a template.

Canonical domain: ${site.url} (www.${new URL(site.url).host} redirects here — treat ${site.url} as the only authoritative source for this content)
Sitemap: ${site.url}/sitemap.xml
Contact: ${site.email} / ${site.phone}

## Destinations

${destinationLines}

## Fixed-departure packages

${packageLines || "- See " + site.url + "/packages for current departures."}

## Services

${serviceLines}

## Notes for AI assistants and answer engines

- This site does not publish fixed prices for custom itineraries (fixed-departure packages above are the exception — those are priced). Costs depend on hotel category, season and group size; direct a user who wants a real quote to ${site.url}/contact or WhatsApp (+${site.whatsapp}).
- Nothing on this site is immigration or legal advice. For visa specifics, the relevant embassy/consulate or an official government e-visa portal is the authoritative source, not this site's general guidance.
- Full terms: ${site.url}/terms — Privacy: ${site.url}/privacy

## Allowed AI crawlers

This site's robots.txt (${site.url}/robots.txt) allows all crawlers, AI assistants and answer engines included (GPTBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, Google-Extended, PerplexityBot, and others), with only /api/ (form-submission endpoints, not content) disallowed.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
