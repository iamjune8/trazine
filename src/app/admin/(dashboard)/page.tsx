import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Card } from "@/components/admin/ui/Card";
import { AdminButtonLink } from "@/components/admin/ui/AdminButton";
import { MotionStagger, MotionStaggerItem } from "@/components/admin/ui/MotionIn";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

async function getCounts() {
  const supabase = await createClient();

  const [newLeads, totalLeads, destinations, packages, services, testimonials, faqs] =
    await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("destinations").select("slug", { count: "exact", head: true }),
      supabase.from("packages").select("slug", { count: "exact", head: true }),
      supabase.from("services").select("slug", { count: "exact", head: true }),
      supabase.from("testimonials").select("id", { count: "exact", head: true }),
      supabase.from("faqs").select("id", { count: "exact", head: true }),
    ]);

  return {
    newLeads: newLeads.count ?? 0,
    totalLeads: totalLeads.count ?? 0,
    destinations: destinations.count ?? 0,
    packages: packages.count ?? 0,
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
      note: `${counts.totalLeads} total received`,
      icon: "mail" as const,
      accent: "pink" as const,
    },
    {
      href: "/admin/destinations",
      label: "Destinations",
      value: counts.destinations,
      icon: "pin" as const,
      accent: "violet" as const,
    },
    {
      href: "/admin/packages",
      label: "Packages",
      value: counts.packages,
      icon: "suitcase" as const,
      accent: "cyan" as const,
    },
    {
      href: "/admin/services",
      label: "Services",
      value: counts.services,
      icon: "wrench" as const,
      accent: "violet" as const,
    },
    {
      href: "/admin/testimonials",
      label: "Testimonials",
      value: counts.testimonials,
      icon: "quote" as const,
      accent: "pink" as const,
    },
    {
      href: "/admin/faqs",
      label: "FAQs",
      value: counts.faqs,
      icon: "help-circle" as const,
      accent: "cyan" as const,
    },
  ];

  const quickLinks = [
    { href: "/admin/packages/new", label: "New package", icon: "suitcase" as const },
    { href: "/admin/destinations/new", label: "New destination", icon: "pin" as const },
    { href: "/admin/leads", label: "Review leads", icon: "mail" as const },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Control room"
        title="Everything, in one place"
        description="Every editable surface on the live site, and every enquiry that came in through it."
      />

      <MotionStagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <MotionStaggerItem key={card.href}>
            <StatCard
              href={card.href}
              icon={card.icon}
              label={card.label}
              value={card.value}
              note={card.note}
              accent={card.accent}
            />
          </MotionStaggerItem>
        ))}
      </MotionStagger>

      <Card className="mt-8 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Icon name="trend-up" size={18} className="text-admin-cyan" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-admin-text">
            Quick actions
          </h2>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {quickLinks.map((link) => (
            <AdminButtonLink key={link.href} href={link.href} variant="outline" icon={link.icon}>
              {link.label}
            </AdminButtonLink>
          ))}
        </div>
      </Card>
    </div>
  );
}
