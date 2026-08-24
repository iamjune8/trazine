"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m } from "motion/react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export type NavLink = { href: string; label: string; icon: IconName };

export function AdminSidebar({ links, email }: { links: NavLink[]; email: string }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-admin-border-soft px-4 py-6 lg:flex lg:flex-col">
      <Link href="/admin" className="flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-admin-indigo via-admin-violet to-admin-pink text-white">
          <Icon name="sparkle" size={17} />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-admin-text">Travel Magazine</span>
          <span className="block text-[0.65rem] uppercase tracking-[0.16em] text-admin-text-3">
            Control room
          </span>
        </span>
      </Link>

      <nav aria-label="Admin" className="mt-9 flex-1 space-y-1">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                active ? "text-admin-text" : "text-admin-text-2 hover:text-admin-text",
              )}
            >
              {active ? (
                <m.span
                  layoutId="admin-nav-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-admin-violet/20 to-admin-cyan/10 ring-1 ring-admin-violet/30"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <Icon
                name={link.icon}
                size={17}
                className={cn("relative shrink-0", active ? "text-admin-violet" : "text-admin-text-3")}
              />
              <span className="relative">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 space-y-3 border-t border-admin-border-soft pt-5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-admin-text-3 transition-colors duration-200 hover:text-admin-text"
        >
          <Icon name="eye" size={15} />
          View live site
        </Link>
        <div className="flex items-center gap-2.5 truncate px-3 text-xs text-admin-text-3">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-admin-success" />
          <span className="truncate">{email}</span>
        </div>
      </div>
    </aside>
  );
}
