import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { DestinationForm } from "../DestinationForm";
import { createDestination } from "../actions";

export const dynamic = "force-dynamic";

export default function NewDestinationPage() {
  return (
    <div>
      <Link
        href="/admin/destinations"
        className="inline-flex items-center gap-1.5 text-sm text-admin-text-3 transition-colors duration-200 hover:text-admin-text"
      >
        <Icon name="chevron-left" size={15} />
        All destinations
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-admin-text sm:text-3xl">Add destination</h1>
      <DestinationForm action={createDestination} submitLabel="Create destination" />
    </div>
  );
}
