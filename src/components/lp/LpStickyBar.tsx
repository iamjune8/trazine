"use client";

import { Icon } from "@/components/ui/Icon";
import { trackEvent, trackConversion } from "@/lib/analytics";
import { whatsappLink } from "@/data/site";
import { useSiteSettings } from "@/components/site/SiteSettingsContext";

/**
 * Same fixed bottom bar as the main site's StickyMobileBar, but "Enquire"
 * scrolls to the inline form instead of opening a modal — this route tree
 * has no EnquiryProvider (see src/app/lp/layout.tsx for why), and a modal
 * would be one more chunk of JS a page built to load fast doesn't need.
 */
export function LpStickyBar({
  destination,
  source,
}: {
  destination: string;
  source: string;
}) {
  const settings = useSiteSettings();

  function handleWhatsApp() {
    trackEvent("whatsapp_click", { source, destination });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP);
  }

  function handleCall() {
    trackEvent("call_click", { source, destination });
    trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CALL);
  }

  function handleEnquireClick() {
    trackEvent("enquire_scroll_click", { source, destination });
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line-2 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
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
          `Hello, I'd like to plan a trip to ${destination}.`,
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
      <a
        href="#enquiry"
        onClick={handleEnquireClick}
        className="flex min-h-[52px] flex-[1.4] items-center justify-center gap-2 bg-ink text-sm font-medium text-paper transition-colors active:bg-ink/90"
      >
        Enquire
      </a>
    </div>
  );
}
