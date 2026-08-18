import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/Icon";

type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-xl font-medium " +
  "cursor-pointer select-none whitespace-nowrap transition-all duration-200 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-xs min-h-[36px]",
  md: "px-5 py-3 text-sm min-h-[44px]",
  lg: "px-6 py-3.5 text-sm min-h-[50px]",
};

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-to-r from-admin-indigo via-admin-violet to-admin-pink " +
    "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_-8px_rgba(139,92,246,0.6)] " +
    "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_10px_30px_-6px_rgba(139,92,246,0.75)] hover:-translate-y-0.5",
  outline:
    "border border-admin-border text-admin-text hover:border-admin-violet/50 hover:bg-white/5",
  ghost: "text-admin-text-2 hover:text-admin-text hover:bg-white/5",
  danger:
    "border border-admin-danger/30 text-admin-danger hover:bg-admin-danger/10 hover:border-admin-danger/50",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  icon?: IconName;
  withArrow?: boolean;
};

function Inner({
  children,
  icon,
  withArrow,
}: {
  children: ReactNode;
  icon?: IconName;
  withArrow?: boolean;
}) {
  return (
    <>
      {icon ? <Icon name={icon} size={16} /> : null}
      <span>{children}</span>
      {withArrow ? (
        <Icon
          name="arrow-right"
          size={15}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      ) : null}
    </>
  );
}

export function AdminButton({
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  withArrow,
  type = "button",
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button type={type} className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      <Inner icon={icon} withArrow={withArrow}>
        {children}
      </Inner>
    </button>
  );
}

export function AdminButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  withArrow,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      <Inner icon={icon} withArrow={withArrow}>
        {children}
      </Inner>
    </Link>
  );
}
