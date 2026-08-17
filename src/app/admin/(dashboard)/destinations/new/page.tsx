import Link from "next/link";
import { DestinationForm } from "../DestinationForm";
import { createDestination } from "../actions";

export const dynamic = "force-dynamic";

export default function NewDestinationPage() {
  return (
    <div>
      <Link
        href="/admin/destinations"
        className="text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
      >
        ← All destinations
      </Link>
      <h1 className="font-display mt-4 text-3xl text-ink">Add destination</h1>
      <DestinationForm action={createDestination} submitLabel="Create destination" />
    </div>
  );
}
