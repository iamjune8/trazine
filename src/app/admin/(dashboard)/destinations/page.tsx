import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Card } from "@/components/admin/ui/Card";
import { Badge } from "@/components/admin/ui/Badge";
import { AdminButtonLink } from "@/components/admin/ui/AdminButton";
import { MotionStagger, MotionStaggerItem } from "@/components/admin/ui/MotionIn";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function DestinationsAdminPage() {
  const supabase = await createClient();
  const { data: destinations, error } = await supabase
    .from("destinations")
    .select("slug, name, tier, featured, display_order")
    .order("display_order", { ascending: true });

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Destinations"
        description="Every destination page on the live site."
        actions={
          <AdminButtonLink href="/admin/destinations/new" icon="plus" withArrow>
            Add destination
          </AdminButtonLink>
        }
      />

      {error ? (
        <p className="mt-8 rounded-xl border border-admin-danger/30 bg-admin-danger/10 px-4 py-3 text-sm text-admin-danger">
          Couldn&rsquo;t load destinations: {error.message}
        </p>
      ) : null}

      <Card className="mt-8 overflow-hidden">
        {!destinations || destinations.length === 0 ? (
          <p className="p-8 text-admin-text-3">No destinations yet.</p>
        ) : (
          <MotionStagger>
            <ul>
              {destinations.map((d, i) => (
                <MotionStaggerItem key={d.slug}>
                  <li className={i !== destinations.length - 1 ? "border-b border-admin-border-soft" : ""}>
                    <Link
                      href={`/admin/destinations/${d.slug}`}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 transition-colors duration-200 hover:bg-white/[0.03]"
                    >
                      <span className="flex items-center gap-3">
                        <Icon name="pin" size={16} className="text-admin-text-3" />
                        <span className="text-sm font-medium text-admin-text">{d.name}</span>
                        <Badge tone={d.tier === "premium" ? "pink" : "cyan"}>
                          {d.tier === "premium" ? "Premium" : "Easy"}
                        </Badge>
                        {d.featured ? <Badge tone="violet">Featured</Badge> : null}
                      </span>
                      <span className="flex items-center gap-3 shrink-0 text-xs text-admin-text-3">
                        Order {d.display_order}
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
