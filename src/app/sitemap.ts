import type { MetadataRoute } from "next";
import { getDestinations } from "@/lib/content/destinations";
import { getActivePackages } from "@/lib/content/packages";
import { site } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const [destinations, packages] = await Promise.all([
    getDestinations(),
    getActivePackages(),
  ]);

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/destinations", priority: 0.9 },
    { path: "/packages", priority: 0.9 },
    { path: "/services", priority: 0.8 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    ...destinations.map((destination) => ({
      url: `${site.url}/destinations/${destination.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...packages.map((pkg) => ({
      url: `${site.url}/packages/${pkg.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
