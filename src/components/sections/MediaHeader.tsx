import Image from "next/image";
import Link from "next/link";
import { photo, photoBlur, type PhotoKey } from "@/lib/images";
import { AnimatedHeading } from "@/components/motion/AnimatedHeading";
import { Container } from "@/components/ui/Layout";
import { Icon } from "@/components/ui/Icon";

/**
 * Full-bleed photographic masthead for the destination pages. A server
 * component, animated in CSS, for the same reasons as the homepage hero.
 *
 * Deliberately shorter than that hero (min-h ~72svh rather than 100svh) so the
 * reader can see that content follows without scrolling — an interior page
 * that fills the viewport reads as a dead end.
 */
export function MediaHeader({
  image,
  imageAlt,
  eyebrow,
  title,
  lede,
  breadcrumb,
  breadcrumbLabel,
  facts,
  objectPosition,
}: {
  image: PhotoKey;
  imageAlt: string;
  eyebrow: string;
  title: string;
  lede?: string;
  breadcrumb?: { label: string; href: string }[];
  /** Short label for the current page in the breadcrumb trail.
      Defaults to `title`, which is usually far too long for a crumb. */
  breadcrumbLabel?: string;
  /** Optional key facts pinned to the foot of the masthead. */
  facts?: { label: string; value: string }[];
  /** CSS object-position, for source photos whose subject isn't centred. */
  objectPosition?: string;
}) {
  return (
    <header className="relative flex min-h-[72svh] flex-col justify-end overflow-hidden bg-ink">
      <div className="animate-ken-burns absolute inset-0">
        <Image
          src={photo(image, 2400)}
          alt={imageAlt}
          fill
          // The LCP element on every destination page — see the note in Hero.
          preload
          sizes="100vw"
          quality={75}
          placeholder="blur"
          blurDataURL={photoBlur(image)}
          className="object-cover object-center"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>

      <div className="photo-scrim absolute inset-0" aria-hidden="true" />
      <div className="photo-scrim-side absolute inset-0" aria-hidden="true" />

      <Container className="relative pb-14 pt-36 sm:pb-16 lg:pb-20">
        {breadcrumb?.length ? (
          <nav
            aria-label="Breadcrumb"
            className="animate-fade mb-8"
            style={{ animationDelay: "0.05s" }}
          >
            <ol className="flex flex-wrap items-center gap-2 text-sm text-paper/70">
              {breadcrumb.map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  <Link
                    href={crumb.href}
                    className="link-underline transition-colors duration-200 hover:text-paper"
                  >
                    {crumb.label}
                  </Link>
                  <Icon name="arrow-right" size={13} className="text-paper/40" />
                </li>
              ))}
              <li aria-current="page" className="text-paper">
                {breadcrumbLabel ?? title}
              </li>
            </ol>
          </nav>
        ) : null}

        <p
          className="eyebrow eyebrow-on-dark animate-rise"
          style={{ animationDelay: "0.1s" }}
        >
          {eyebrow}
        </p>

        <AnimatedHeading
          text={title}
          as="h1"
          delay={0.22}
          className="font-display mt-5 max-w-[14ch] text-[length:var(--step-h1)] text-paper"
        />

        {lede ? (
          <p
            className="animate-rise mt-7 max-w-2xl text-lg leading-relaxed text-paper/85"
            style={{ animationDelay: "0.6s" }}
          >
            {lede}
          </p>
        ) : null}

        {facts?.length ? (
          <dl
            className="animate-fade mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-paper/20 pt-7 sm:grid-cols-3 lg:max-w-4xl"
            style={{ animationDelay: "0.85s" }}
          >
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-brass-light">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-sm text-paper/85">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Container>
    </header>
  );
}
