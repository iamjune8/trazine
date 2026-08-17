import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { FaqForm } from "../FaqForm";
import { updateFaq, deleteFaq } from "../actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditFaqPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: faq } = await supabase.from("faqs").select("*").eq("id", id).single();

  if (!faq) notFound();

  const boundUpdate = updateFaq.bind(null, id);
  const boundDelete = deleteFaq.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/faqs"
        className="text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
      >
        ← All FAQs
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display mt-4 text-3xl text-ink">Edit FAQ</h1>
        <form action={boundDelete}>
          <DeleteButton confirmText="Delete this FAQ? This can't be undone." />
        </form>
      </div>

      <FaqForm action={boundUpdate} defaultValues={faq} submitLabel="Save changes" />
    </div>
  );
}
