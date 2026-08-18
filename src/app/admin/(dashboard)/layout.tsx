import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logOut } from "../actions";
import { AdminSidebar, type NavLink } from "@/components/admin/ui/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/ui/AdminMobileNav";
import { Icon } from "@/components/ui/Icon";

/**
 * Shell for every authenticated admin page. The proxy (src/proxy.ts)
 * already redirects signed-out visitors before this ever renders — this
 * check is a second, cheap line of defense, not the primary gate.
 */
export const dynamic = "force-dynamic";

const navLinks: NavLink[] = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/leads", label: "Leads", icon: "mail" },
  { href: "/admin/destinations", label: "Destinations", icon: "pin" },
  { href: "/admin/packages", label: "Packages", icon: "suitcase" },
  { href: "/admin/services", label: "Services", icon: "wrench" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "quote" },
  { href: "/admin/faqs", label: "FAQs", icon: "help-circle" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/admin/login");
  }

  const email = String(data.claims.email ?? "");

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar links={navLinks} email={email} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-admin-border-soft px-5 py-4 sm:px-8">
          <AdminMobileNav links={navLinks} />
          <span className="text-sm font-medium text-admin-text-2 lg:hidden">
            Travel Magazine <span className="text-admin-text-3">/ Admin</span>
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden truncate text-xs text-admin-text-3 sm:inline">{email}</span>
            <form action={logOut}>
              <button
                type="submit"
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-admin-border px-3.5 py-2 text-xs font-medium text-admin-text-2 transition-colors duration-200 hover:border-admin-danger/40 hover:text-admin-danger"
              >
                <Icon name="logout" size={14} />
                Log out
              </button>
            </form>
          </div>
        </header>

        <main className="admin-scrollbar flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[92rem] px-5 py-10 sm:px-8 lg:py-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
