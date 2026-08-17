import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const supabase = await createClient();
  const { data: faqs, error } = await supabase
    .from("faqs")
    .select("id, question, display_order")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">FAQs</h1>
          <p className="mt-2 text-ink-2">Shown on the homepage, /services and /contact.</p>
        </div>
        <ButtonLink href="/admin/faqs/new" withArrow>
          Add FAQ
        </ButtonLink>
      </div>

      {error ? (
        <p className="mt-8 border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger">
          Couldn&rsquo;t load FAQs: {error.message}
        </p>
      ) : null}

      <div className="mt-8 border border-line bg-paper">
        {!faqs || faqs.length === 0 ? (
          <p className="p-8 text-ink-2">No FAQs yet.</p>
        ) : (
          <ul>
            {faqs.map((faq) => (
              <li key={faq.id} className="border-b border-line last:border-b-0">
                <Link
                  href={`/admin/faqs/${faq.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-5 transition-colors duration-200 hover:bg-paper-2"
                >
                  <span className="text-ink">{faq.question}</span>
                  <span className="shrink-0 text-sm text-ink-3">
                    Order {faq.display_order}
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
