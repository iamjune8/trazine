"use client";

import { Icon } from "@/components/ui/Icon";
import { trackEvent, trackConversion } from "@/lib/analytics";
import { whatsappLink } from "@/data/site";
import { useSiteSettings } from "@/components/site/SiteSettingsContext";
import { useEnquiry } from "./EnquiryContext";

/**
 * Fixed bottom action bar shown only on mobile/tablet — the sticky enquiry +
 * WhatsApp surface Google Ads landing-page guidance expects, since a reader
 * who arrived on a phone otherwise has to scroll back up to find any of these
 * three actions. Hidden at `lg` and above, where the page's own sticky
 * enquiry rail (see the destination/package pages) already does this job
 * alongside the content instead of covering it.
 *
 * `pb-[env(safe-area-inset-bottom)]` keeps the bar clear of the home
 * indicator on notched iOS devices.
 */
export function StickyMobileBar({
  destination,
  source,
}: {
  destination?: string;
  source: string;
}) {
  const { open } = useEnquiry();
  const settings = useSiteSettings();

  function handleWhatsApp() {
    trackEvent("whatsapp_click", { source, destination });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP);
  }

  function handleCall() {
    trackEvent("call_click", { source, destination });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CALL);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line-2 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden">
      <a
        href={settings.phoneHref}
        onClick={handleCall}
        aria-label={`Call ${settings.phone}`}
        className="flex min-h-[52px] flex-1 items-center justify-center gap-2 border-r border-line-2 text-sm font-medium text-ink-2 transition-colors active:bg-paper-2"
      >
        <Icon name="phone" size={17} aria-hidden="true" />
        Call
      </a>
      <a
        href={whatsappLink(
          settings.whatsapp,
          destination
            ? `Hello, I'd like to plan a trip to ${destination}.`
            : "Hello, I'd like to plan an international trip.",
        )}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsApp}
        aria-label="Chat on WhatsApp"
        className="flex min-h-[52px] flex-1 items-center justify-center gap-2 border-r border-line-2 text-sm font-medium text-ink-2 transition-colors active:bg-paper-2"
      >
        <Icon name="whatsapp" size={17} aria-hidden="true" />
        WhatsApp
      </a>
      <button
        type="button"
        onClick={() => open({ destination, source })}
        className="flex min-h-[52px] flex-[1.4] items-center justify-center gap-2 bg-ink text-sm font-medium text-paper transition-colors active:bg-ink/90"
      >
        Enquire
      </button>
    </div>
  );
}
