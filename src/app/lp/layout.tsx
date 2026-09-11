import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "../globals.css";

import { SiteSettingsProvider } from "@/components/site/SiteSettingsContext";
import { getSiteSettings } from "@/lib/content/siteSettings";
import { site } from "@/data/site";

/**
 * A third root layout (Next.js App Router supports several via top-level
 * segments — the admin panel already does this for its own dark theme, see
 * src/app/admin/layout.tsx). Landing pages under /lp/* are paid-traffic
 * pages built for Google Ads Quality Score and load speed, not for site
 * navigation, so this deliberately shares only what's needed and drops
 * everything the main (site) layout carries for browsing:
 *
 * - No Header/Footer nav, no EnquiryProvider/EnquiryModal (the enquiry form
 *   is inline on the page itself, not a modal to open)
 * - No PublicMotionProvider — framer-motion's engine never loads on these
 *   pages at all, not even the trimmed domAnimation bundle the rest of the
 *   site uses
 *
 * GA4/GTM/the fonts are still loaded — tracking and brand typography matter
 * here just as much as anywhere else, they're just not shared code with the
 * (site) layout since this is a separate document root.
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#17140f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const gtmContainerId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID;

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="en-IN" className={`${playfair.variable} ${inter.variable}`}>
      {gtmContainerId && <GoogleTagManager gtmId={gtmContainerId} />}
      <body className="flex min-h-dvh flex-col bg-paper">
        <SiteSettingsProvider settings={settings}>{children}</SiteSettingsProvider>
      </body>
      {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
    </html>
  );
}
