"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Inner } from "./Button";

/**
 * A frosted-glass button with a faint liquid ripple in its backdrop blur —
 * restyled from a generic shadcn "liquid glass" snippet to this site's own
 * ink/paper/brass tokens, with the redundant plain-Button and skeuomorphic
 * metal-button variants from that snippet dropped (both duplicate what
 * Button.tsx already covers). No new dependencies: the original used
 * `class-variance-authority` and `@radix-ui/react-slot` for variant
 * management and `asChild` polymorphism, neither of which this file needs
 * for a single glass treatment — sizes are a plain lookup, matching how
 * Button.tsx itself does it.
 *
 * Glass, not paint: it has no opaque background of its own, so it only
 * reads correctly over a photograph or another textured surface — the hero,
 * a MediaHeader, CTABand. On a flat paper/ink section it will look like a
 * faint outline with nothing behind it to blur.
 *
 * The ripple is a real SVG displacement filter referenced via
 * `backdrop-filter: url(#id)`, which is what makes the blur look liquid
 * rather than flat — support is solid in current Chrome and Safari, patchy
 * in Firefox. `useId()` keeps the filter's id unique per instance, since an
 * SVG `id` is only valid once per page and this button may render more than
 * once. The plain `blur()` in the same declaration is the fallback for
 * browsers that ignore the `url()` term: per the Filter Effects spec an
 * unsupported filter function is dropped, not the whole property.
 */

type Size = "md" | "lg";

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[0.8125rem]",
  lg: "h-14 px-8 text-[0.8125rem]",
};

export function LiquidButton({
  size = "md",
  className,
  children,
  withArrow,
  ...props
}: ComponentProps<"button"> & { size?: Size; withArrow?: boolean }) {
  const filterId = useId();

  return (
    <button
      className={cn(
        "group relative inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full",
        "font-sans font-medium uppercase tracking-[0.14em] text-paper",
        "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] active:scale-[0.98]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size],
        className,
      )}
      {...props}
    >
      {/* Backdrop layer — blurs and ripples whatever sits behind the button. Its own element (rather than the button's background) so the blur doesn't also apply to the label. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          backdropFilter: `blur(14px) url(#${filterId})`,
          WebkitBackdropFilter: "blur(14px)",
        }}
      />
      {/* Glass surface — a pale tint (not a dark one) so it reads as frosted glass sitting on top of whatever photo is behind it, plus a top-to-bottom shine and a beveled edge from the inset highlights. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 rounded-full border border-paper/50 bg-gradient-to-b from-paper/25 via-paper/10 to-paper/5",
          "shadow-[inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.8),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.35),0_2px_14px_rgba(0,0,0,0.35)]",
          "transition-colors duration-300 group-hover:border-brass-light/70 group-hover:from-brass-light/30 group-hover:via-brass-light/15 group-hover:to-brass-light/5",
        )}
      />
      <span className="relative">
        <Inner withArrow={withArrow}>{children}</Inner>
      </span>
      <LiquidGlassFilter id={filterId} />
    </button>
  );
}

/** The distortion filter that gives the blur its "liquid" ripple. Zero-size and invisible — only ever referenced via `url(#id)`, never rendered directly. */
function LiquidGlassFilter({ id }: { id: string }) {
  return (
    <svg aria-hidden="true" className="absolute h-0 w-0">
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="1" seed="2" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="softened" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softened"
            scale="50"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>
      </defs>
    </svg>
  );
}
