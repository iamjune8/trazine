import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Card } from "@/components/admin/ui/Card";
import { AdminButtonLink } from "@/components/admin/ui/AdminButton";
import { MotionStagger, MotionStaggerItem } from "@/components/admin/ui/MotionIn";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const supabase = await createClient();
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("id, name, trip, display_order")
    .order("display_order", { ascending: true });

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Testimonials"
        description="Quotes shown across the site's social-proof sections."
        actions={
          <AdminButtonLink href="/admin/testimonials/new" icon="plus" withArrow>
            Add testimonial
          </AdminButtonLink>
        }
      />

      {error ? (
        <p className="mt-8 rounded-xl border border-admin-danger/30 bg-admin-danger/10 px-4 py-3 text-sm text-admin-danger">
          Couldn&rsquo;t load testimonials: {error.message}
        </p>
      ) : null}

      <Card className="mt-8 overflow-hidden">
        {!testimonials || testimonials.length === 0 ? (
          <p className="p-8 text-admin-text-3">No testimonials yet.</p>
        ) : (
          <MotionStagger>
            <ul>
              {testimonials.map((t, i) => (
                <MotionStaggerItem key={t.id}>
                  <li className={i !== testimonials.length - 1 ? "border-b border-admin-border-soft" : ""}>
                    <Link
                      href={`/admin/testimonials/${t.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 transition-colors duration-200 hover:bg-white/[0.03]"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-admin-text-3">
                          <Icon name="quote" size={14} />
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-admin-text">{t.name}</span>
                          <span className="block text-xs text-admin-text-3">{t.trip}</span>
                        </span>
                      </span>
                      <span className="flex items-center gap-3 shrink-0 text-xs text-admin-text-3">
                        Order {t.display_order}
                        <Icon name="chevron-right" size={16} />
                      </span>
                    </Link>
                  </li>
                </MotionStaggerItem>
              ))}
            </ul>
          </MotionStagger>
        )}
      </Card>
    </div>
  );
}
