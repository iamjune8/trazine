import type { MetadataRoute } from "next";
import { getDestinations } from "@/lib/content/destinations";
import { site } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const destinations = await getDestinations();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/destinations", priority: 0.9 },
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
  ];
}
