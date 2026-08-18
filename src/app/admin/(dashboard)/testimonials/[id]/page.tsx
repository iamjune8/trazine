import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDeleteButton } from "@/components/admin/ui/AdminDeleteButton";
import { Icon } from "@/components/ui/Icon";
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
        className="inline-flex items-center gap-1.5 text-sm text-admin-text-3 transition-colors duration-200 hover:text-admin-text"
      >
        <Icon name="chevron-left" size={15} />
        All testimonials
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-admin-text sm:text-3xl">
          Edit {testimonial.name}
        </h1>
        <form action={boundDelete}>
          <AdminDeleteButton confirmText={`Delete this testimonial from ${testimonial.name}? This can't be undone.`} />
        </form>
      </div>

      <TestimonialForm action={boundUpdate} defaultValues={testimonial} submitLabel="Save changes" />
    </div>
  );
}
