import Link from "next/link";
import { Logo } from "./Logo";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { getDestinations } from "@/lib/content/destinations";
import { getServices } from "@/lib/content/services";
import { site, fullAddress, navLinks } from "@/data/site";

/**
 * The site footer, with a scroll-reveal effect on large screens: the dark
 * panel stays pinned to the bottom of the viewport and only comes into view
 * as the page scrolls past it, rather than just appearing at the bottom of
 * the document like an ordinary footer.
 *
 * The mechanism is three nested boxes, `lg:` and up only:
 *  - the outer `<footer>` reserves `LG_HEIGHT` of space in the page and
 *    carries a `clip-path`. That clip-path does nothing visually by itself
 *    (its polygon is just the element's own rectangle) — its real job is a
 *    CSS side effect: an element with `clip-path` becomes the containing
 *    block for any `position: fixed` descendant, so the fixed panel inside
 *    it is clipped to *this element's* box instead of the whole viewport.
 *  - the middle div is that `fixed` panel, pinned to the bottom of the
 *    viewport but only ever visible within the footer's reserved rectangle.
 *  - the inner div is `sticky`, which holds the actual footer content at a
 *    fixed position within that panel while it's on screen.
 *
 * Below `lg` none of this applies — plain static block, exactly like any
 * other footer. Two reasons: three-column link grids are already tall once
 * they stack on a phone, and a fixed-height panel that has to scroll inside
 * itself to show all its own links is worse than just not doing the trick.
 * The desktop version is sized (`LG_HEIGHT`) to comfortably fit this
 * footer's actual content with no internal scrolling in the ordinary case;
 * `overflow-y-auto` stays on only as a safety net for unusually large text
 * settings, not as the intended way to read the footer.
 *
 * The brand block and each link column fade/rise in via `<Reveal>` — CSS +
 * IntersectionObserver, not JS-only — so nothing here depends on a script
 * completing to be visible; see src/components/motion/Reveal.tsx.
 */

const LG_HEIGHT = "680px";

const socials: { name: IconName; href: string; label: string }[] = [
  { name: "instagram", href: site.social.instagram, label: "Instagram" },
  { name: "facebook", href: site.social.facebook, label: "Facebook" },
  { name: "linkedin", href: site.social.linkedin, label: "LinkedIn" },
];

export async function Footer() {
  const year = new Date().getFullYear();
  const [destinations, services] = await Promise.all([getDestinations(), getServices()]);

  return (
    <footer
      className="relative w-full lg:h-(--lg-height) lg:[clip-path:polygon(0%_0,100%_0%,100%_100%,0_100%)]"
      style={
        {
          "--lg-height": LG_HEIGHT,
          "--footer-sticky-top": `calc(100vh - ${LG_HEIGHT})`,
        } as React.CSSProperties
      }
    >
      <div className="w-full lg:fixed lg:bottom-0 lg:h-(--lg-height)">
        <div className="bg-ink text-paper lg:sticky lg:top-(--footer-sticky-top) lg:h-full lg:overflow-y-auto">
          <Container
            size="wide"
            className="flex flex-col gap-10 border-t border-line-dark py-14 lg:h-full lg:justify-between lg:py-16"
          >
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
              {/* Brand + contact */}
              <Reveal className="lg:col-span-4">
                <Logo onDark />
                <p className="mt-7 max-w-sm text-paper/65">{site.positioning}</p>

                <address className="mt-9 space-y-4 not-italic">
                  <TrackedAnchor
                    href={site.phoneHref}
                    event="call_click"
                    data={{ source: "footer" }}
                    className="flex items-start gap-3 text-paper/80 transition-colors duration-200 hover:text-brass-light"
                  >
                    <Icon name="phone" size={17} className="mt-1 shrink-0 text-brass-light" />
                    <span>{site.phone}</span>
                  </TrackedAnchor>
                  <TrackedAnchor
                    href={`mailto:${site.email}`}
                    event="email_click"
                    data={{ source: "footer" }}
                    className="flex items-start gap-3 text-paper/80 transition-colors duration-200 hover:text-brass-light"
                  >
                    <Icon name="mail" size={17} className="mt-1 shrink-0 text-brass-light" />
                    <span className="break-all">{site.email}</span>
                  </TrackedAnchor>
                  <p className="flex items-start gap-3 text-paper/65">
                    <Icon name="pin" size={17} className="mt-1 shrink-0 text-brass-light" />
                    <span>{fullAddress}</span>
                  </p>
                  <p className="flex items-start gap-3 text-paper/65">
                    <Icon name="clock" size={17} className="mt-1 shrink-0 text-brass-light" />
                    <span>{site.hours}</span>
                  </p>
                </address>
              </Reveal>

              {/* Link columns */}
              <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
                <Reveal delay={0.1}>
                  <FooterColumn title="Destinations">
                    {destinations.map((d) => (
                      <FooterLink key={d.slug} href={`/destinations/${d.slug}`}>
                        {d.name}
                      </FooterLink>
                    ))}
                  </FooterColumn>
                </Reveal>

                <Reveal delay={0.15}>
                  <FooterColumn title="Services">
                    {services.slice(0, 5).map((s) => (
                      <FooterLink key={s.slug} href={`/services#${s.slug}`}>
                        {s.title}
                      </FooterLink>
                    ))}
                  </FooterColumn>
                </Reveal>

                <Reveal delay={0.2}>
                  <FooterColumn title="Company">
                    {navLinks.map((link) => (
                      <FooterLink key={link.href} href={link.href}>
                        {link.label}
                      </FooterLink>
                    ))}
                  </FooterColumn>
                </Reveal>
              </div>
            </div>

            <div>
              {/* Base line */}
              <div className="mt-8 flex flex-col gap-6 border-t border-line-dark pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                  <p className="text-sm text-paper/45">
                    © {year} {site.legalName} — All rights reserved.
                  </p>
                  <ul className="flex items-center gap-5">
                    <li>
                      <Link
                        href="/privacy"
                        className="text-sm text-paper/45 transition-colors duration-200 hover:text-brass-light"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/terms"
                        className="text-sm text-paper/45 transition-colors duration-200 hover:text-brass-light"
                      >
                        Terms of Use
                      </Link>
                    </li>
                  </ul>
                </div>

                <ul className="flex items-center gap-1">
                  {socials.map((social) => (
                    <li key={social.name}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${site.name} on ${social.label}`}
                        className="flex h-11 w-11 items-center justify-center text-paper/55 transition-colors duration-200 hover:text-brass-light"
                      >
                        <Icon name={social.name} size={19} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-[0.625rem] font-medium uppercase tracking-[0.24em] text-brass-light">
        {title}
      </h2>
      <ul className="mt-5 space-y-1">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="flex min-h-[40px] items-center text-paper/65 transition-colors duration-200 hover:text-brass-light"
      >
        {children}
      </Link>
    </li>
  );
}
