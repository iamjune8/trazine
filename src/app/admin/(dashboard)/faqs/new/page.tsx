import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { FaqForm } from "../FaqForm";
import { createFaq } from "../actions";

export const dynamic = "force-dynamic";

export default function NewFaqPage() {
  return (
    <div>
      <Link
        href="/admin/faqs"
        className="inline-flex items-center gap-1.5 text-sm text-admin-text-3 transition-colors duration-200 hover:text-admin-text"
      >
        <Icon name="chevron-left" size={15} />
        All FAQs
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-admin-text sm:text-3xl">Add FAQ</h1>
      <FaqForm action={createFaq} submitLabel="Create FAQ" />
    </div>
  );
}
