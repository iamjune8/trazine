import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logOut } from "../actions";

/**
 * Shell for every authenticated admin page. The proxy (src/proxy.ts)
 * already redirects signed-out visitors before this ever renders — this
 * check is a second, cheap line of defense, not the primary gate.
 */
export const dynamic = "force-dynamic";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/destinations", label: "Destinations" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/faqs", label: "FAQs" },
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
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex w-full max-w-[92rem] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <Link href="/admin" className="font-display text-lg text-ink">
              Travel Magazine <span className="text-ink-3">/ Admin</span>
            </Link>
            <nav aria-label="Admin" className="flex flex-wrap gap-x-6 gap-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-ink-2 transition-colors duration-200 hover:text-brass-deep"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
            >
              View site ↗
            </Link>
            <span className="text-sm text-ink-3">{email}</span>
            <form action={logOut}>
              <button
                type="submit"
                className="cursor-pointer text-sm font-medium text-ink-2 underline decoration-line-2 underline-offset-4 transition-colors duration-200 hover:text-brass-deep"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-paper-2">
        <div className="mx-auto w-full max-w-[92rem] px-5 py-10 sm:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
