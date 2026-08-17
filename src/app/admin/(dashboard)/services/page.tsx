import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const supabase = await createClient();
  const { data: services, error } = await supabase
    .from("services")
    .select("slug, title, display_order")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Services</h1>
          <p className="mt-2 text-ink-2">Shown on the homepage and the /services page.</p>
        </div>
        <ButtonLink href="/admin/services/new" withArrow>
          Add service
        </ButtonLink>
      </div>

      {error ? (
        <p className="mt-8 border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger">
          Couldn&rsquo;t load services: {error.message}
        </p>
      ) : null}

      <div className="mt-8 border border-line bg-paper">
        {!services || services.length === 0 ? (
          <p className="p-8 text-ink-2">No services yet.</p>
        ) : (
          <ul>
            {services.map((service) => (
              <li key={service.slug} className="border-b border-line last:border-b-0">
                <Link
                  href={`/admin/services/${service.slug}`}
                  className="flex items-center justify-between gap-4 px-6 py-5 transition-colors duration-200 hover:bg-paper-2"
                >
                  <span className="text-ink">{service.title}</span>
                  <span className="shrink-0 text-sm text-ink-3">
                    Order {service.display_order}
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
