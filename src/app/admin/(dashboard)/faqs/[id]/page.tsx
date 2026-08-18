import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDeleteButton } from "@/components/admin/ui/AdminDeleteButton";
import { Icon } from "@/components/ui/Icon";
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
        className="inline-flex items-center gap-1.5 text-sm text-admin-text-3 transition-colors duration-200 hover:text-admin-text"
      >
        <Icon name="chevron-left" size={15} />
        All FAQs
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-admin-text sm:text-3xl">Edit FAQ</h1>
        <form action={boundDelete}>
          <AdminDeleteButton confirmText="Delete this FAQ? This can't be undone." />
        </form>
      </div>

      <FaqForm action={boundUpdate} defaultValues={faq} submitLabel="Save changes" />
    </div>
  );
}
