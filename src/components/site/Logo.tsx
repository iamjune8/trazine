import { cn } from "@/lib/utils";

/**
 * Typographic wordmark: "TRAVEL" in the display serif, a brass hairline, then
 * "MAGAZINE" letterspaced beneath it. Set in live text rather than an image so
 * it stays crisp at any density and costs nothing to load.
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
    </span>
  );
}
