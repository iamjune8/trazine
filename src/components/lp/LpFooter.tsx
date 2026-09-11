import Link from "next/link";
import { getSiteSettings } from "@/lib/content/siteSettings";

/**
 * Deliberately minimal — just what Google Ads' policy review and basic
 * legal compliance need (a real address, a working Privacy Policy link),
 * not the full site's destinations/services/company link columns. Every
 * link here is a legal necessity, not a navigation invitation.
 */
export async function LpFooter() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper-2 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-8">
      {/* Extra bottom padding clears the fixed sticky bar (LpStickyBar),
          which — unlike the main site's — is shown at every breakpoint on
          these pages, so this footer needs the same clearance on desktop
          too, not just mobile. */}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 text-center text-xs text-ink-3 sm:px-8">
        <p>{settings.fullAddress}</p>
        <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>© {year} Travel Magazine</span>
          <Link href="/privacy" className="link-underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="link-underline">
            Terms of Use
          </Link>
        </p>
      </div>
    </footer>
  );
}
