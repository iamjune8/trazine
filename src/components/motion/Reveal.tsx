"use client";

import type { ReactNode, ElementType, CSSProperties } from "react";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";

/**
 * Scroll reveals.
 *
 * The animation itself is CSS (see `.reveal` / `.stagger` in globals.css); the
 * only job of this component is to set `data-visible` when the element scrolls
 * into view. That split matters:
 *
 *  - the hidden state is gated behind `html.js`, so with scripting off nothing
 *    is ever hidden — no blank page, no `<noscript>` override needed;
 *  - transform + opacity only, so a reveal never triggers layout;
 *  - reduced-motion is handled entirely in CSS, which forces every target
 *    visible and skips the transition;
 *  - `<StaggerItem>` needs no JavaScript at all — the sequence comes from
 *    nth-child transition delays on the parent.
 */

type Direction = "up" | "down" | "left" | "right" | "none";

export type RevealProps = {
  children: ReactNode;
  /** Seconds. Use to give a block a second or third beat. */
  delay?: number;
  direction?: Direction;
  className?: string;
  as?: ElementType;
  /** Adds a subtle scale-in. Reserved for images and cards, not text. */
  scale?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  as: Tag = "div",
  scale = false,
}: RevealProps) {
  const ref = useReveal<HTMLElement>();

  const style: CSSProperties | undefined = delay
    ? { transitionDelay: `${delay}s` }
    : undefined;

  return (
    <Tag
      ref={ref}
      className={cn("reveal", className)}
      data-direction={direction}
      data-scale={scale ? "true" : undefined}
      style={style}
    >
      {children}
    </Tag>
  );
}

/**
 * Reveals its children in sequence. The parent is observed; the children are
 * plain elements whose delays come from CSS, so a list of twelve cards costs
 * exactly one observer entry.
 */
export function Stagger({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useReveal<HTMLElement>();

  return (
    <Tag ref={ref} className={cn("stagger", className)}>
      {children}
    </Tag>
  );
}

/**
 * A child of `<Stagger>`. Deliberately inert — it renders a plain element and
 * ships no JavaScript; the parent's CSS drives its entrance.
 */
export function StaggerItem({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={className}>{children}</Tag>;
}
