import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Enquiry submissions are not content — keep them out of the index.
      disallow: "/api/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
