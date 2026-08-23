/**
 * Single source of truth for brand, contact and navigation.
 *
 * Phone, email and address are the company's real details. `legalName`
 * and `social` are still placeholders — replace them here (one file)
 * before go-live; every header, footer, contact page and JSON-LD block
 * reads from this object.
 */

export const site = {
  name: "Travel Magazine",
  legalName: "Travel Magazine Holidays Pvt. Ltd.",
  slogan: "Capture World, Page by Page",
  positioning:
    "A travel house designing Premium Luxury circuits across Europe and Easy & Affordable journeys across Asia and the Gulf.",

  url: "https://www.travelmagazine.example",

  email: "travelmagazine24@gmail.com",
  phone: "+91 81085 31332",
  phoneHref: "tel:+918108531332",
  whatsapp: "918108531332",

  address: {
    line1: "Unit No F9, Upper Section, First Floor, Kohinoor City Mall",
    line2: "Premier Road, Kurla West",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400070",
    country: "India",
  },

  hours: "Monday – Saturday, 10:00 – 19:00 IST",

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

export const fullAddress = [
  site.address.line1,
  site.address.line2,
  `${site.address.city} ${site.address.postalCode}`,
  site.address.country,
].join(", ");

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
