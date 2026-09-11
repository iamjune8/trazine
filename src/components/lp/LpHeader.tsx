import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/site/Logo";
import { getSiteSettings } from "@/lib/content/siteSettings";

/**
 * Deliberately not the site's real Header — no destination/package/service
 * nav links, no mobile menu, nothing that gives a paid-traffic visitor a
 * way to wander off this page. Just the wordmark (trust signal, not a
 * link — see the layout doc comment) and the phone number.
 */
export async function LpHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Logo />
        <a
          href={settings.phoneHref}
          className="flex items-center gap-2 text-sm font-medium text-ink-2 transition-colors duration-200 hover:text-brass-deep"
        >
          <Icon name="phone" size={16} className="text-brass" />
          <span className="hidden sm:inline">{settings.phone}</span>
        </a>
      </div>
    </header>
  );
}
