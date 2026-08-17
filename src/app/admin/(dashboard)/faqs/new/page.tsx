import Link from "next/link";
import { FaqForm } from "../FaqForm";
import { createFaq } from "../actions";

export const dynamic = "force-dynamic";

export default function NewFaqPage() {
  return (
    <div>
      <Link
        href="/admin/faqs"
        className="text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
      >
        ← All FAQs
      </Link>
      <h1 className="font-display mt-4 text-3xl text-ink">Add FAQ</h1>
      <FaqForm action={createFaq} submitLabel="Create FAQ" />
    </div>
  );
}
