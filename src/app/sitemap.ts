import type { MetadataRoute } from "next";
import { getDestinations } from "@/lib/content/destinations";
import { getActivePackages } from "@/lib/content/packages";
import { guides } from "@/data/guides";
import { site } from "@/data/site";

/** The newest valid date in the list, or undefined when none is known. */
function latest(dates: (string | undefined)[]): Date | undefined {
  const times = dates
    .map((date) => (date ? new Date(date).getTime() : Number.NaN))
    .filter((time) => !Number.isNaN(time));
  return times.length ? new Date(Math.max(...times)) : undefined;
}

/**
 * `lastModified` is only ever a real edit date. Where a page has no known
 * edit date it is left out rather than stamped with "now": a sitemap that
 * claims every page changed on every fetch teaches search engines to ignore
 * the field.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, packages] = await Promise.all([
    getDestinations(),
    getActivePackages(),
  ]);

  const destinationDates = destinations.map((d) => d.updatedAt);
  const packageDates = packages.map((p) => p.updatedAt);
  const guideDates = guides.map((g) => `${g.updated}T00:00:00Z`);

  const staticRoutes: { path: string; priority: number; lastModified?: Date }[] = [
    {
      path: "",
      priority: 1,
      lastModified: latest([...destinationDates, ...packageDates]),
    },
    { path: "/destinations", priority: 0.9, lastModified: latest(destinationDates) },
    { path: "/packages", priority: 0.9, lastModified: latest(packageDates) },
    { path: "/services", priority: 0.8 },
    { path: "/guides", priority: 0.7, lastModified: latest(guideDates) },
    { path: "/b2b-partners", priority: 0.6 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified: route.lastModified,
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    ...destinations.map((destination) => ({
      url: `${site.url}/destinations/${destination.slug}`,
      lastModified: latest([destination.updatedAt]),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...guides.map((guide) => ({
      url: `${site.url}/guides/${guide.slug}`,
      lastModified: latest([`${guide.updated}T00:00:00Z`]),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...packages.map((pkg) => ({
      url: `${site.url}/packages/${pkg.slug}`,
      lastModified: latest([pkg.updatedAt]),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
