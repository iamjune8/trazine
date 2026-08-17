import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getCounts() {
  const supabase = await createClient();

  const [newLeads, totalLeads, destinations, services, testimonials, faqs] =
    await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("destinations").select("slug", { count: "exact", head: true }),
      supabase.from("services").select("slug", { count: "exact", head: true }),
      supabase.from("testimonials").select("id", { count: "exact", head: true }),
      supabase.from("faqs").select("id", { count: "exact", head: true }),
    ]);

  return {
    newLeads: newLeads.count ?? 0,
    totalLeads: totalLeads.count ?? 0,
    destinations: destinations.count ?? 0,
    services: services.count ?? 0,
    testimonials: testimonials.count ?? 0,
    faqs: faqs.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  const cards = [
    {
      href: "/admin/leads",
      label: "New leads",
      value: counts.newLeads,
      note: `${counts.totalLeads} total`,
      highlight: counts.newLeads > 0,
    },
    { href: "/admin/destinations", label: "Destinations", value: counts.destinations },
    { href: "/admin/services", label: "Services", value: counts.services },
    { href: "/admin/testimonials", label: "Testimonials", value: counts.testimonials },
    { href: "/admin/faqs", label: "FAQs", value: counts.faqs },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Dashboard</h1>
      <p className="mt-2 text-ink-2">
        Everything editable on the live site, in one place.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-paper p-6 transition-colors duration-200 hover:bg-white"
          >
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ink-3">
              {card.label}
            </p>
            <p
              className={
                "font-display mt-3 text-4xl " +
                (card.highlight ? "text-brass-deep" : "text-ink")
              }
            >
              {card.value}
            </p>
            {card.note ? (
              <p className="mt-1 text-sm text-ink-3">{card.note}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
