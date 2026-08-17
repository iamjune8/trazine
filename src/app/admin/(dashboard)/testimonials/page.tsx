import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("id, name, trip, display_order")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Testimonials</h1>
          <p className="mt-2 text-ink-2">Shown on the homepage and /about.</p>
        </div>
        <ButtonLink href="/admin/testimonials/new" withArrow>
          Add testimonial
        </ButtonLink>
      </div>

      {error ? (
        <p className="mt-8 border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger">
          Couldn&rsquo;t load testimonials: {error.message}
        </p>
      ) : null}

      <div className="mt-8 border border-line bg-paper">
        {!testimonials || testimonials.length === 0 ? (
          <p className="p-8 text-ink-2">No testimonials yet.</p>
        ) : (
          <ul>
            {testimonials.map((t) => (
              <li key={t.id} className="border-b border-line last:border-b-0">
                <Link
                  href={`/admin/testimonials/${t.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-5 transition-colors duration-200 hover:bg-paper-2"
                >
                  <span>
                    <span className="text-ink">{t.name}</span>
                    <span className="ml-3 text-sm text-ink-3">{t.trip}</span>
                  </span>
                  <span className="shrink-0 text-sm text-ink-3">Order {t.display_order}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
