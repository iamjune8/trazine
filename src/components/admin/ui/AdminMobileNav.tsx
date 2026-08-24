"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { NavLink } from "./AdminSidebar";

export function AdminMobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-admin-border text-admin-text"
      >
        <Icon name="menu" size={18} />
      </button>

      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-100">
            <m.button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <m.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="admin-glass absolute inset-y-0 left-0 w-72 border-r border-admin-border-soft p-5"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-admin-indigo via-admin-violet to-admin-pink text-white">
                    <Icon name="sparkle" size={15} />
                  </span>
                  <span className="text-sm font-semibold text-admin-text">Control room</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-admin-text-3 hover:text-admin-text"
                >
                  <Icon name="close" size={17} />
                </button>
              </div>

              <nav className="mt-8 space-y-1">
                {links.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                        active
                          ? "bg-admin-violet/15 text-admin-text ring-1 ring-admin-violet/30"
                          : "text-admin-text-2 hover:text-admin-text",
                      )}
                    >
                      <Icon
                        name={link.icon}
                        size={17}
                        className={active ? "text-admin-violet" : "text-admin-text-3"}
                      />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </m.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
