import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDeleteButton } from "@/components/admin/ui/AdminDeleteButton";
import { Icon } from "@/components/ui/Icon";
import { DestinationForm } from "../DestinationForm";
import { updateDestination, deleteDestination } from "../actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function EditDestinationPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: destination } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!destination) notFound();

  const boundUpdate = updateDestination.bind(null, slug);
  const boundDelete = deleteDestination.bind(null, slug);

  return (
    <div>
      <Link
        href="/admin/destinations"
        className="inline-flex items-center gap-1.5 text-sm text-admin-text-3 transition-colors duration-200 hover:text-admin-text"
      >
        <Icon name="chevron-left" size={15} />
        All destinations
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-admin-text sm:text-3xl">
          Edit {destination.name}
        </h1>
        <form action={boundDelete}>
          <AdminDeleteButton confirmText={`Delete ${destination.name}? This can't be undone.`} />
        </form>
      </div>

      <DestinationForm
        action={boundUpdate}
        defaultValues={destination}
        submitLabel="Save changes"
        lockSlug
      />
    </div>
  );
}
