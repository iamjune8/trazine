/**
 * Single source of truth for brand and navigation.
 *
 * Phone, email, address and hours used to live here too, but are now
 * editable from the admin panel (Settings) and stored in the
 * `site_settings` table — see `@/lib/content/siteSettings` for the loader
 * and `@/components/site/SiteSettingsContext` for how client components
 * read them. `legalName` and `social` are still placeholders — replace
 * them here (one file) before go-live.
 */

export const site = {
  name: "Travel Magazine",
  legalName: "Travel Magazine",
  slogan: "Capture World, Page by Page",
  positioning:
    "A travel house designing Premium Luxury circuits across Europe and Easy & Affordable journeys across Asia and the Gulf.",

  url: "https://travzine.in",

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    linkedin: "https://linkedin.com/",
  },
} as const;

export const navLinks = [
  { label: "Destinations", href: "/destinations" },
  { label: "Packages", href: "/packages" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** `whatsapp` is the digits-only number from `SiteSettings.whatsapp`. */
export function whatsappLink(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
