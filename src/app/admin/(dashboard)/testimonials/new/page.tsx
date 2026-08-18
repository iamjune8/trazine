import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { TestimonialForm } from "../TestimonialForm";
import { createTestimonial } from "../actions";

export const dynamic = "force-dynamic";

export default function NewTestimonialPage() {
  return (
    <div>
      <Link
        href="/admin/testimonials"
        className="inline-flex items-center gap-1.5 text-sm text-admin-text-3 transition-colors duration-200 hover:text-admin-text"
      >
        <Icon name="chevron-left" size={15} />
        All testimonials
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-admin-text sm:text-3xl">Add testimonial</h1>
      <TestimonialForm action={createTestimonial} submitLabel="Create testimonial" />
    </div>
  );
}
