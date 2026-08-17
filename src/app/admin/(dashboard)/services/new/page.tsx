import Link from "next/link";
import { ServiceForm } from "../ServiceForm";
import { createService } from "../actions";

export const dynamic = "force-dynamic";

export default function NewServicePage() {
  return (
    <div>
      <Link
        href="/admin/services"
        className="text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
      >
        ← All services
      </Link>
      <h1 className="font-display mt-4 text-3xl text-ink">Add service</h1>
      <ServiceForm action={createService} submitLabel="Create service" />
    </div>
  );
}
