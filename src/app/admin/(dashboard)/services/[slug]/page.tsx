import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ServiceForm } from "../ServiceForm";
import { updateService, deleteService } from "../actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function EditServicePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!service) notFound();

  const boundUpdate = updateService.bind(null, slug);
  const boundDelete = deleteService.bind(null, slug);

  return (
    <div>
      <Link
        href="/admin/services"
        className="text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
      >
        ← All services
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display mt-4 text-3xl text-ink">Edit service</h1>
        <form action={boundDelete}>
          <DeleteButton confirmText="Delete this service? This can't be undone." />
        </form>
      </div>

      <ServiceForm
        action={boundUpdate}
        defaultValues={service}
        submitLabel="Save changes"
        lockSlug
      />
    </div>
  );
}
