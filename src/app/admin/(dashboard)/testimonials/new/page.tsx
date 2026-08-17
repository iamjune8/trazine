import Link from "next/link";
import { TestimonialForm } from "../TestimonialForm";
import { createTestimonial } from "../actions";

export const dynamic = "force-dynamic";

export default function NewTestimonialPage() {
  return (
    <div>
      <Link
        href="/admin/testimonials"
        className="text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
      >
        ← All testimonials
      </Link>
      <h1 className="font-display mt-4 text-3xl text-ink">Add testimonial</h1>
      <TestimonialForm action={createTestimonial} submitLabel="Create testimonial" />
    </div>
  );
}
