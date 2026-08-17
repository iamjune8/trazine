import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
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
        className="text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
      >
        ← All destinations
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display mt-4 text-3xl text-ink">Edit {destination.name}</h1>
        <form action={boundDelete}>
          <DeleteButton confirmText={`Delete ${destination.name}? This can't be undone.`} />
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
