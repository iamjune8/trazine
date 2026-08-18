import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PackagesAdminPage() {
  const supabase = await createClient();
  const { data: packages, error } = await supabase
    .from("packages")
    .select("slug, name, base_price, currency, active, display_order")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Packages</h1>
          <p className="mt-2 text-ink-2">
            Fixed-departure packages with flights, hotels and dated seats.
          </p>
        </div>
        <ButtonLink href="/admin/packages/new" withArrow>
          Add package
        </ButtonLink>
      </div>

      {error ? (
        <p className="mt-8 border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger">
          Couldn&rsquo;t load packages: {error.message}
        </p>
      ) : null}

      <div className="mt-8 border border-line bg-paper">
        {!packages || packages.length === 0 ? (
          <p className="p-8 text-ink-2">No packages yet.</p>
        ) : (
          <ul>
            {packages.map((p) => (
              <li key={p.slug} className="border-b border-line last:border-b-0">
                <Link
                  href={`/admin/packages/${p.slug}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 transition-colors duration-200 hover:bg-paper-2"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-ink">{p.name}</span>
                    <span
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium uppercase tracking-[0.08em]",
                        p.active
                          ? "bg-brass-light/25 text-brass-deep"
                          : "bg-line-2/60 text-ink-2",
                      )}
                    >
                      {p.active ? "Published" : "Hidden"}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm text-ink-3">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: p.currency,
                      maximumFractionDigits: 0,
                    }).format(p.base_price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
