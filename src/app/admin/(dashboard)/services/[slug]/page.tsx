import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDeleteButton } from "@/components/admin/ui/AdminDeleteButton";
import { Icon } from "@/components/ui/Icon";
import { ServiceForm } from "../ServiceForm";
import { updateService, deleteService } from "../actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function EditServicePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase.from("services").select("*").eq("slug", slug).single();

  if (!service) notFound();

  const boundUpdate = updateService.bind(null, slug);
  const boundDelete = deleteService.bind(null, slug);

  return (
    <div>
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-1.5 text-sm text-admin-text-3 transition-colors duration-200 hover:text-admin-text"
      >
        <Icon name="chevron-left" size={15} />
        All services
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-admin-text sm:text-3xl">
          Edit {service.title}
        </h1>
        <form action={boundDelete}>
          <AdminDeleteButton confirmText={`Delete ${service.title}? This can't be undone.`} />
        </form>
      </div>

      <ServiceForm action={boundUpdate} defaultValues={service} submitLabel="Save changes" lockSlug />
    </div>
  );
}
