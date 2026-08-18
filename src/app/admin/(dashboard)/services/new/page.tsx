import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ServiceForm } from "../ServiceForm";
import { createService } from "../actions";

export const dynamic = "force-dynamic";

export default function NewServicePage() {
  return (
    <div>
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-1.5 text-sm text-admin-text-3 transition-colors duration-200 hover:text-admin-text"
      >
        <Icon name="chevron-left" size={15} />
        All services
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-admin-text sm:text-3xl">Add service</h1>
      <ServiceForm action={createService} submitLabel="Create service" />
    </div>
  );
}
