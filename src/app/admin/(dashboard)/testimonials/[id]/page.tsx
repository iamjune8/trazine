import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { TestimonialForm } from "../TestimonialForm";
import { updateTestimonial, deleteTestimonial } from "../actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditTestimonialPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: testimonial } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();

  if (!testimonial) notFound();

  const boundUpdate = updateTestimonial.bind(null, id);
  const boundDelete = deleteTestimonial.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/testimonials"
        className="text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
      >
        ← All testimonials
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display mt-4 text-3xl text-ink">Edit testimonial</h1>
        <form action={boundDelete}>
          <DeleteButton confirmText="Delete this testimonial? This can't be undone." />
        </form>
      </div>

      <TestimonialForm
        action={boundUpdate}
        defaultValues={testimonial}
        submitLabel="Save changes"
      />
    </div>
  );
}
