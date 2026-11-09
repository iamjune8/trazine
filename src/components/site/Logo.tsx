import { cn } from "@/lib/utils";

/**
 * Typographic wordmark: "Travel Magazine" in the display serif with
 * "Tours & Travels" letterspaced beneath it, so the full trading name shows
 * without a header-wide line that would push the menu off a phone screen.
 * Set in live text rather than an image so it stays crisp at any density and
 * costs nothing to load.
 */
export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-display text-xl tracking-[0.02em] sm:text-[1.375rem]",
          onDark ? "text-paper" : "text-ink",
        )}
      >
        Travel Magazine
      </span>
      <span
        className={cn(
          "mt-1 text-[0.5625rem] font-medium uppercase tracking-[0.28em]",
          onDark ? "text-brass-light" : "text-brass-deep",
        )}
      >
        Tours &amp; Travels
      </span>
    </span>
  );
}
