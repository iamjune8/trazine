import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * Buttons and button-styled links.
 *
 * Every variant clears the 44×44px touch target (py-3.5 + text-sm ≈ 48px),
 * carries `cursor-pointer`, and transitions in the 200–280ms band. Hover moves
 * colour and a transform only — never size, so neighbours never reflow.
 */

type Variant = "primary" | "outline" | "ghost" | "on-dark";
type Size = "md" | "lg";

export const base =
  "group relative inline-flex items-center justify-center gap-2.5 " +
  "font-sans text-[0.8125rem] font-medium uppercase tracking-[0.14em] " +
  "cursor-pointer select-none whitespace-nowrap " +
  "transition-[background-color,color,border-color,box-shadow] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "disabled:cursor-not-allowed disabled:opacity-55";

export const sizes: Record<Size, string> = {
  md: "px-6 py-3.5 min-h-[48px]",
  lg: "px-8 py-4 min-h-[54px]",
};

export const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-brass-deep",
  outline:
    "border border-line-2 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink hover:text-brass-deep px-0 min-h-[44px]",
  "on-dark":
    "border border-brass-light/45 text-paper hover:bg-brass-light hover:text-ink hover:border-brass-light",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  /** Appends an arrow that slides on hover. */
  withArrow?: boolean;
};

export function Inner({ children, withArrow }: { children: ReactNode; withArrow?: boolean }) {
  return (
    <>
      <span>{children}</span>
      {withArrow ? (
        <Icon
          name="arrow-right"
          size={16}
          className="transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        />
      ) : null}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  withArrow,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      <Inner withArrow={withArrow}>{children}</Inner>
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  withArrow,
  type = "button",
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      <Inner withArrow={withArrow}>{children}</Inner>
    </button>
  );
}

/** External links (WhatsApp, social) — same styling, real anchor semantics. */
export function ExternalButton({
  href,
  variant = "outline",
  size = "md",
  className,
  children,
  withArrow,
}: CommonProps & { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, sizes[size], variants[variant], className)}
    >
      <Inner withArrow={withArrow}>{children}</Inner>
    </a>
  );
}
