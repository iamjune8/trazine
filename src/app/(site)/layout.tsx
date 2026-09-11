import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "../globals.css";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EnquiryProvider } from "@/components/enquiry/EnquiryContext";
import { EnquiryModalGate } from "@/components/enquiry/EnquiryModalGate";
import { PublicMotionProvider } from "@/components/motion/PublicMotionProvider";
import { SiteSettingsProvider } from "@/components/site/SiteSettingsContext";
import { site } from "@/data/site";
import { getDestinations } from "@/lib/content/destinations";
import { getSiteSettings } from "@/lib/content/siteSettings";
import { jsonLdScript } from "@/lib/utils";

/**
 * Playfair Display carries every heading; Inter carries everything else.
 * Both are loaded as variable fonts through next/font, so they are self-hosted
 * with the build, preloaded, and swap without shifting layout.
 */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Europe tour packages & easy Asia getaways from India`,
    template: `%s | ${site.name}`,
  },
  description:
    "A travel house designing a Premium Luxury circuit across the whole of Europe and Easy & Affordable journeys to Dubai, Bali, Thailand, Vietnam, Malaysia, Singapore, the Maldives, Sri Lanka, Nepal and Kenya. Itinerary design, visa assistance, IATA ticketing and support throughout.",
  keywords: [
    "travel agency India",
    "Europe tour packages from India",
    "Switzerland Paris tour packages",
    "Scandinavia tour packages India",
    "Eastern Europe tour packages",
    "Dubai tour packages from India",
    "Bali tour packages from India",
    "Vietnam tour packages from India",
    "Malaysia tour packages from India",
    "Singapore tour packages from India",
    "Maldives packages from India",
    "Sri Lanka tour packages from India",
    "Nepal tour packages from India",
    "Schengen visa assistance India",
    "international tour operator India",
  ],
  authors: [{ name: site.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    url: site.url,
    title: `${site.name} — ${site.slogan}`,
    description: site.positioning,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.slogan}`,
    description: site.positioning,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#17140f",
  // Never disable zoom — pinch-to-zoom is an accessibility requirement.
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/**
 * Both read from env so analytics stays fully inert — no script tag, no
 * network request — until an ID is actually set. Fill these in via
 * `.env.local` (see `.env.example`) once tracking is ready to go live; no
 * code change needed here. If both are set, configure GA4 as a tag inside
 * GTM rather than sending pageviews through both, to avoid double-counting.
 */
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const gtmContainerId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [destinations, settings] = await Promise.all([getDestinations(), getSiteSettings()]);

  /** Local-business structured data, so the Mumbai office surfaces in search. */
  const organisationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    telephone: settings.phone,
    email: settings.email,
    slogan: site.slogan,
    description: site.positioning,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${settings.address.line1}, ${settings.address.line2}`,
      addressLocality: settings.address.city,
      addressRegion: settings.address.state,
      postalCode: settings.address.postalCode,
      addressCountry: "IN",
    },
    areaServed: destinations.flatMap((d) => d.places.map((p) => p.name)),
    // Deliberately not derived from `settings.hours` — that field is a
    // free-text display string (e.g. "Monday – Saturday, 10:00 – 19:00
    // IST"), and reliably converting arbitrary text to schema.org's
    // "Mo-Sa 10:00-19:00" format isn't something to guess at silently.
    openingHours: "Mo-Sa 10:00-19:00",
  };

  /**
   * Deliberately no `potentialAction`/SearchAction sitelinks-searchbox
   * entry — that requires a real, working on-site search endpoint, and this
   * site doesn't have one. Adding it anyway would be exactly the kind of
   * schema that describes a capability the site doesn't actually have.
   */
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
  };

  return (
    <html
      lang="en-IN"
      className={`${playfair.variable} ${inter.variable}`}
      // The js-gate script below adds a class to <html> before hydration.
      suppressHydrationWarning
      // globals.css sets `scroll-behavior: smooth` on <html> for in-page
      // anchor links. Since Next.js 16, the router no longer temporarily
      // neutralises that during route transitions unless opted in here —
      // without it, navigating via <Link> leaves the new page at the old
      // scroll position instead of resetting to the top.
      data-scroll-behavior="smooth"
    >
      {gtmContainerId && <GoogleTagManager gtmId={gtmContainerId} />}
      <body className="flex min-h-dvh flex-col">
        {/* Marks the document as scripted BEFORE the body paints. Every
            scroll-reveal's hidden state is scoped to `.js`, so if this never
            runs — scripting disabled, bundle blocked — the page renders fully
            visible instead of blank. `beforeInteractive` puts it in the
            initial HTML, so there is no flash of hidden content.
            The class it adds is why <html> suppresses hydration warnings. */}
        <Script id="js-gate" strategy="beforeInteractive">
          {`document.documentElement.classList.add('js')`}
        </Script>

        <script
          type="application/ld+json"
          // areaServed pulls place names out of the admin-edited destinations
          // table, so this isn't purely static — jsonLdScript escapes it.
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organisationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd) }}
        />
        {/* Excludes drag and layout-projection — a ~130KB chunk of
            framer-motion's engine this site's public pages never use.
            Every motion.* component under this tree must be `m.*` instead
            (only two admin-only components use layoutId, and admin has its
            own separate root layout outside this tree). Loaded async from
            its own module (see PublicMotionProvider) so it's a genuinely
            separate chunk, not deduped into the same one as admin's domMax. */}
        <PublicMotionProvider>
          <SiteSettingsProvider settings={settings}>
            <EnquiryProvider>
              <Header />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
              <EnquiryModalGate />
            </EnquiryProvider>
          </SiteSettingsProvider>
        </PublicMotionProvider>
      </body>
      {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
    </html>
  );
}
