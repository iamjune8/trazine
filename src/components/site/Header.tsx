"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Logo } from "./Logo";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useEnquiry } from "@/components/enquiry/EnquiryContext";
import { navLinks, site } from "@/data/site";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

/**
 * Sticky header that adapts to what is beneath it.
 *
 * Over a full-bleed dark hero it sits transparent with light type; once the
 * page scrolls past the hero it fades to paper with a hairline. Only
 * background, colour and opacity change — the bar's height is constant, so
 * the transition never nudges the page (no layout shift).
 */

/** Routes whose first screen is a full-bleed dark photograph. */
function hasDarkHero(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/destinations") ||
    pathname.startsWith("/demo")
  );
}

export function Header() {
  const pathname = usePathname();
  const { open } = useEnquiry();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on navigation. Adjusted during render rather than
  // in an effect — an effect-driven reset would paint one extra frame with
  // the menu still open on the new page before the effect catches up.
  const [priorPathname, setPriorPathname] = useState(pathname);
  if (pathname !== priorPathname) {
    setPriorPathname(pathname);
    setMenuOpen(false);
  }

  const darkHero = hasDarkHero(pathname);
  // Transparent only while over the hero and the menu is closed.
  const transparent = darkHero && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Keyboard users land here first — skips the whole nav. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-90 transition-[background-color,border-color,box-shadow] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
          transparent
            ? "border-b border-transparent bg-transparent"
            : "border-b border-line bg-paper/92 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="shrink-0 py-1"
          >
            <Logo onDark={transparent} />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => {
              // Every nav target is a section root, so a prefix match keeps
              // "Destinations" lit while the reader is on a detail page.
              const active = pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "link-underline py-2 text-[0.8125rem] font-medium uppercase tracking-[0.14em] transition-colors duration-200",
                    transparent
                      ? "text-paper/85 hover:text-paper"
                      : "text-ink-2 hover:text-ink",
                    active && (transparent ? "text-paper" : "text-ink"),
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.phoneHref}
              onClick={() => trackEvent("call_click", { source: "header" })}
              className={cn(
                "hidden items-center gap-2 px-3 py-2.5 text-[0.8125rem] tracking-wide transition-colors duration-200 xl:inline-flex",
                transparent
                  ? "text-paper/85 hover:text-paper"
                  : "text-ink-2 hover:text-brass-deep",
              )}
            >
              <Icon name="phone" size={15} />
              <span>{site.phone}</span>
            </a>

            <Button
              variant={transparent ? "on-dark" : "primary"}
              onClick={() => open({ source: "header" })}
              className="hidden sm:inline-flex"
            >
              Enquire
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={cn(
                "-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center transition-colors duration-200 lg:hidden",
                transparent ? "text-paper" : "text-ink",
              )}
            >
              <Icon name={menuOpen ? "close" : "menu"} size={24} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <m.div
            id="mobile-menu"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-80 bg-paper pt-24 lg:hidden"
          >
            <nav
              aria-label="Mobile"
              className="flex h-full flex-col overflow-y-auto px-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8"
            >
              <ul className="border-t border-line">
                {navLinks.map((link, i) => (
                  <m.li
                    key={link.href}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.04 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-line"
                  >
                    <Link
                      href={link.href}
                      className="font-display flex min-h-[64px] items-center justify-between py-4 text-3xl text-ink transition-colors duration-200 hover:text-brass-deep"
                    >
                      {link.label}
                      <Icon name="arrow-up-right" size={20} className="text-brass" />
                    </Link>
                  </m.li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <Button
                  size="lg"
                  className="w-full"
                  withArrow
                  onClick={() => {
                    setMenuOpen(false);
                    open({ source: "mobile-menu" });
                  }}
                >
                  Plan your journey
                </Button>
                <a
                  href={site.phoneHref}
                  onClick={() => trackEvent("call_click", { source: "mobile-menu" })}
                  className="mt-5 flex min-h-[44px] items-center gap-3 text-ink-2"
                >
                  <Icon name="phone" size={17} className="text-brass" />
                  {site.phone}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  onClick={() => trackEvent("email_click", { source: "mobile-menu" })}
                  className="mt-1 flex min-h-[44px] items-center gap-3 text-ink-2"
                >
                  <Icon name="mail" size={17} className="text-brass" />
                  {site.email}
                </a>
              </div>
            </nav>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
