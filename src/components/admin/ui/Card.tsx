import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** The base glass panel every admin surface is built from. */
export function Card({
  children,
  className,
  hoverable = false,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={cn(
        "admin-glass rounded-2xl",
        hoverable &&
          "transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-admin-violet/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * A titled block inside a long form — icon + label + one-line description,
 * so someone editing a page can tell what a section actually controls
 * without reading every field inside it first.
 */
export function SectionCard({
  id,
  icon,
  title,
  description,
  children,
  accent = "violet",
}: {
  id?: string;
  icon: IconName;
  title: string;
  description?: string;
  children: ReactNode;
  accent?: "violet" | "cyan" | "pink";
}) {
  const accentClass = {
    violet: "from-admin-violet/25 to-admin-indigo/10 text-admin-violet",
    cyan: "from-admin-cyan/25 to-admin-indigo/10 text-admin-cyan",
    pink: "from-admin-pink/25 to-admin-violet/10 text-admin-pink",
  }[accent];

  return (
    <section id={id} className="admin-glass scroll-mt-28 rounded-2xl p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
            accentClass,
          )}
        >
          <Icon name={icon} size={20} />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-admin-text">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-relaxed text-admin-text-3">{description}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-7 space-y-6">{children}</div>
    </section>
  );
}
