import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Card } from "@/components/admin/ui/Card";
import { Badge } from "@/components/admin/ui/Badge";
import { AdminButtonLink } from "@/components/admin/ui/AdminButton";
import { MotionStagger, MotionStaggerItem } from "@/components/admin/ui/MotionIn";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function PackagesAdminPage() {
  const supabase = await createClient();
  const { data: packages, error } = await supabase
    .from("packages")
    .select("slug, name, base_price, currency, active, display_order")
    .order("display_order", { ascending: true });

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Packages"
        description="Fixed-departure packages with flights, hotels and dated seats."
        actions={
          <AdminButtonLink href="/admin/packages/new" icon="plus" withArrow>
            Add package
          </AdminButtonLink>
        }
      />

      {error ? (
        <p className="mt-8 rounded-xl border border-admin-danger/30 bg-admin-danger/10 px-4 py-3 text-sm text-admin-danger">
          Couldn&rsquo;t load packages: {error.message}
        </p>
      ) : null}

      <Card className="mt-8 overflow-hidden">
        {!packages || packages.length === 0 ? (
          <p className="p-8 text-admin-text-3">No packages yet.</p>
        ) : (
          <MotionStagger>
            <ul>
              {packages.map((p, i) => (
                <MotionStaggerItem key={p.slug}>
                  <li className={i !== packages.length - 1 ? "border-b border-admin-border-soft" : ""}>
                    <Link
                      href={`/admin/packages/${p.slug}`}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 transition-colors duration-200 hover:bg-white/[0.03]"
                    >
                      <span className="flex items-center gap-3">
                        <Icon name="suitcase" size={16} className="text-admin-text-3" />
                        <span className="text-sm font-medium text-admin-text">{p.name}</span>
                        <Badge tone={p.active ? "success" : "neutral"}>
                          {p.active ? "Published" : "Hidden"}
                        </Badge>
                      </span>
                      <span className="flex items-center gap-3 shrink-0 text-xs text-admin-text-3">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: p.currency,
                          maximumFractionDigits: 0,
                        }).format(p.base_price)}
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
