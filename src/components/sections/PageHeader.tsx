import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { AnimatedHeading } from "@/components/motion/AnimatedHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";

/**
 * Masthead for the interior light-background pages.
 *
 * Top padding clears the fixed header at every breakpoint; the breadcrumb is
 * a real <nav> with aria-current so the page's position is announced, not just
 * drawn.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  breadcrumb,
  breadcrumbLabel,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  breadcrumb?: { label: string; href: string }[];
  /** Short label for the current page in the breadcrumb trail.
      Defaults to `title`, which is usually far too long for a crumb. */
  breadcrumbLabel?: string;
}) {
  return (
    <header className="border-b border-line bg-paper pb-16 pt-32 sm:pb-20 sm:pt-40 lg:pb-24 lg:pt-44">
      <Container>
        {breadcrumb?.length ? (
          <nav aria-label="Breadcrumb" className="mb-9">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-3">
              {breadcrumb.map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  <Link
                    href={crumb.href}
                    className="link-underline transition-colors duration-200 hover:text-ink"
                  >
                    {crumb.label}
                  </Link>
                  <Icon name="arrow-right" size={13} className="text-line-2" />
                </li>
              ))}
              <li aria-current="page" className="text-ink">
                {breadcrumbLabel ?? title}
              </li>
            </ol>
          </nav>
        ) : null}

        <Reveal direction="none">
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>

        <AnimatedHeading
          text={title}
          as="h1"
          delay={0.12}
          className="font-display mt-6 max-w-[16ch] text-[length:var(--step-h1)] text-ink"
        />

        {lede ? (
          <Reveal delay={0.3} className="mt-8 max-w-2xl">
            <p className="text-lg leading-relaxed text-ink-2">{lede}</p>
          </Reveal>
        ) : null}
      </Container>
    </header>
  );
}
