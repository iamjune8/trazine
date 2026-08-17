import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "../globals.css";

/**
 * A second, separate root layout — Next.js App Router supports multiple
 * root layouts via route groups, and the admin panel deliberately doesn't
 * share the marketing site's header, footer or enquiry modal. It reuses the
 * same design tokens (globals.css, the same two fonts) so it reads as the
 * same product, just a different room.
 */

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  // Never indexed — this is a login-gated internal tool, not a public page.
  robots: { index: false, follow: false },
};

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

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-paper text-ink">{children}</body>
    </html>
  );
}
