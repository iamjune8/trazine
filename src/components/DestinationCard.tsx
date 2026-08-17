import Image from "next/image";
import Link from "next/link";
import { photo, photoBlur } from "@/lib/images";
import { Icon } from "@/components/ui/Icon";
import type { Destination } from "@/data/destinations";
import { cn } from "@/lib/utils";

/**
 * Destination card.
 *
 * The whole card is one link — a single tab stop and a target far larger than
 * 44px, rather than a separate "read more" the user has to aim at. Hover
 * scales only the image (inside an overflow-hidden frame) and slides the
 * arrow, so nothing around the card reflows.
 *
 * The frame carries a fixed aspect ratio, so the grid's height is known before
 * a single photograph loads and the layout never shifts under the reader.
 */
export function DestinationCard({
  destination,
  aspect = "aspect-[4/5]",
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  /** Set when the card sits directly on a dark (tone="ink") section. */
  onDark = false,
  /** Shows a small tier pill over the image — for grids that mix both tiers. */
  showTier = false,
}: {
  destination: Destination;
  aspect?: string;
  className?: string;
  sizes?: string;
  onDark?: boolean;
  showTier?: boolean;
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={cn("group block focus-visible:outline-offset-4", className)}
    >
      <div className={cn("relative overflow-hidden bg-paper-3", aspect)}>
        <Image
          src={photo(destination.cardImage ?? destination.heroImage)}
          alt={`${destination.name} — ${destination.tagline}`}
          fill
          sizes={sizes}
          // Cards always sit below a full-bleed masthead, so lazy loading is
          // both correct and cheaper — no card is ever the LCP element.
          loading="lazy"
          placeholder="blur"
          blurDataURL={photoBlur(destination.cardImage ?? destination.heroImage)}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />

        <div className="photo-scrim-soft absolute inset-0" aria-hidden="true" />

        {showTier ? (
          <span className="absolute left-6 top-6 border border-paper/40 bg-ink/35 px-3 py-1.5 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-paper backdrop-blur-sm sm:left-7 sm:top-7">
            {destination.tier === "premium" ? "Premium Luxury" : "Easy & Affordable"}
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.24em] text-brass-light">
            {destination.region}
          </p>
          <h3 className="font-display mt-2.5 text-2xl text-paper sm:text-[1.75rem]">
            {destination.name}
          </h3>
        </div>
      </div>

      <div className="flex items-start justify-between gap-5 pt-5">
        <p className={cn("max-w-[34ch]", onDark ? "text-paper/70" : "text-ink-2")}>
          {destination.tagline}
        </p>
        <span
          className={cn(
            "mt-1 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1",
            onDark ? "text-brass-light" : "text-brass",
          )}
          aria-hidden="true"
        >
          <Icon name="arrow-up-right" size={20} />
        </span>
      </div>
    </Link>
  );
}
