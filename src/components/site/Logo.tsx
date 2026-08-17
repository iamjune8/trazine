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
      <span className="mt-1.5 flex items-center gap-2">
        <span
          className={cn(
            "h-px w-5 shrink-0",
            onDark ? "bg-brass-light" : "bg-brass",
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "text-[0.5625rem] font-medium uppercase tracking-[0.3em]",
            onDark ? "text-paper/70" : "text-ink-3",
          )}
        >
          Mumbai
        </span>
      </span>
    </span>
  );
}
