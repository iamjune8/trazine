import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "../globals.css";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EnquiryProvider } from "@/components/enquiry/EnquiryContext";
import { EnquiryModal } from "@/components/enquiry/EnquiryModal";
import { site } from "@/data/site";
import { getDestinations } from "@/lib/content/destinations";

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
    default: `${site.name} — Europe tour packages & easy Asia getaways from Mumbai`,
    template: `%s | ${site.name}`,
  },
  description:
    "A Mumbai travel house designing a Premium Luxury circuit across the whole of Europe and Easy & Affordable journeys to Dubai, Bali, Thailand, Vietnam, Malaysia, Singapore, the Maldives, Sri Lanka, Nepal and Kenya. Itinerary design, visa assistance, IATA ticketing and support throughout.",
  keywords: [
    "travel agency Mumbai",
    "Europe tour packages from Mumbai",
    "Switzerland Paris tour packages",
    "Scandinavia tour packages India",
    "Eastern Europe tour packages",
    "Dubai tour packages from Mumbai",
    "Bali tour packages from Mumbai",
    "Vietnam tour packages from Mumbai",
    "Malaysia tour packages from Mumbai",
    "Singapore tour packages from Mumbai",
    "Maldives packages from Mumbai",
    "Sri Lanka tour packages from Mumbai",
    "Nepal tour packages from Mumbai",
    "Schengen visa assistance Mumbai",
    "international tour operator Mumbai",
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
  const destinations = await getDestinations();

  /** Local-business structured data, so the Mumbai office surfaces in search. */
  const organisationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    slogan: site.slogan,
    description: site.positioning,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: "IN",
    },
    areaServed: destinations.flatMap((d) => d.places.map((p) => p.name)),
    openingHours: "Mo-Sa 10:00-19:00",
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
          // Static, developer-authored object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
        />
        <EnquiryProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <EnquiryModal />
        </EnquiryProvider>
      </body>
      {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
    </html>
  );
}
