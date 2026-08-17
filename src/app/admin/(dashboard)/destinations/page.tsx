import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DestinationsAdminPage() {
  const supabase = await createClient();
  const { data: destinations, error } = await supabase
    .from("destinations")
    .select("slug, name, tier, featured, display_order")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Destinations</h1>
          <p className="mt-2 text-ink-2">Every destination page on the live site.</p>
        </div>
        <ButtonLink href="/admin/destinations/new" withArrow>
          Add destination
        </ButtonLink>
      </div>

      {error ? (
        <p className="mt-8 border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger">
          Couldn&rsquo;t load destinations: {error.message}
        </p>
      ) : null}

      <div className="mt-8 border border-line bg-paper">
        {!destinations || destinations.length === 0 ? (
          <p className="p-8 text-ink-2">No destinations yet.</p>
        ) : (
          <ul>
            {destinations.map((d) => (
              <li key={d.slug} className="border-b border-line last:border-b-0">
                <Link
                  href={`/admin/destinations/${d.slug}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 transition-colors duration-200 hover:bg-paper-2"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-ink">{d.name}</span>
                    <span
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium uppercase tracking-[0.08em]",
                        d.tier === "premium"
                          ? "bg-brass-light/25 text-brass-deep"
                          : "bg-line-2/60 text-ink-2",
                      )}
                    >
                      {d.tier === "premium" ? "Premium" : "Easy"}
                    </span>
                    {d.featured ? (
                      <span className="text-xs uppercase tracking-[0.08em] text-ink-3">
                        Featured
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 text-sm text-ink-3">Order {d.display_order}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
