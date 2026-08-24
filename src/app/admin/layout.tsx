import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AdminMotionProvider } from "@/components/admin/ui/AdminMotionProvider";
import "../globals.css";

/**
 * A second, separate root layout — Next.js App Router supports multiple
 * root layouts via route groups, and the admin panel deliberately doesn't
 * share the marketing site's header, footer or enquiry modal — or its warm
 * paper/brass palette. This is its own dark, vibrant control-room theme
 * (see the `.admin-*` tokens and utilities in globals.css), scoped entirely
 * to this document root so none of it can leak into the public site.
 */

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  // Never indexed — this is a login-gated internal tool, not a public page.
  robots: { index: false, follow: false },
};

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
    <html lang="en-IN" className={inter.variable}>
      <body className="admin-root">
        <div className="admin-aurora" />
        <div className="admin-grid-overlay" />
        {/* domMax (not domAnimation, unlike the public site's layout) — the
            admin sidebar and form-section nav use layoutId for their active-
            indicator animation, which needs the layout-projection engine.
            Loaded async so it's a separate chunk from the public site's
            domAnimation, not deduped into one shared chunk (see
            AdminMotionProvider). */}
        <AdminMotionProvider>
          <div className="relative z-10">{children}</div>
        </AdminMotionProvider>
      </body>
    </html>
  );
}
