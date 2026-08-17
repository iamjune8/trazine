import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Layout primitives. The container is fluid with a max-width ceiling and
 * responsive gutters — never a fixed px width, so nothing can force a
 * horizontal scrollbar on a 320px screen.
 */

export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-[78rem]",
    wide: "max-w-[92rem]",
  };

  return (
    <div className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", widths[size], className)}>
      {children}
    </div>
  );
}

/** Vertical rhythm for a page section. Spacious by design (density 3/10). */
export function Section({
  children,
  className,
  id,
  tone = "paper",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "paper" | "paper-2" | "ink";
}) {
  const tones = {
    paper: "bg-paper text-ink",
    "paper-2": "bg-paper-2 text-ink",
    ink: "bg-ink text-paper",
  };

  return (
    <section
      id={id}
      className={cn("py-20 sm:py-28 lg:py-36", tones[tone], className)}
    >
      {children}
    </section>
  );
}

/**
 * The standard section opener: brass eyebrow, display heading, optional lede.
 * Animated as a single block so the three parts arrive together rather than
 * competing for attention.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  onDark = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: string;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn("eyebrow", onDark && "eyebrow-on-dark")}>{eyebrow}</p>
      ) : null}
      <h2
        className={cn(
          "font-display mt-5 text-[length:var(--step-h2)]",
          onDark ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={cn(
            "mt-6 text-lg leading-relaxed",
            onDark ? "text-paper/75" : "text-ink-2",
          )}
        >
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
