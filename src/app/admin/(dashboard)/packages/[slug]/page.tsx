import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { PackageForm } from "../PackageForm";
import {
  updatePackage,
  deletePackage,
  addDeparture,
  updateDeparture,
  deleteDeparture,
} from "../actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditPackagePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { saved } = await searchParams;
  const supabase = await createClient();

  const [{ data: pkg }, { data: departures }] = await Promise.all([
    supabase.from("packages").select("*").eq("slug", slug).single(),
    supabase
      .from("package_departures")
      .select("*")
      .eq("package_slug", slug)
      .order("departure_date", { ascending: true }),
  ]);

  if (!pkg) notFound();

  const boundUpdate = updatePackage.bind(null, slug);
  const boundDelete = deletePackage.bind(null, slug);
  const boundAddDeparture = addDeparture.bind(null, slug);

  return (
    <div>
      <Link
        href="/admin/packages"
        className="text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
      >
        ← All packages
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display mt-4 text-3xl text-ink">Edit {pkg.name}</h1>
        <form action={boundDelete}>
          <DeleteButton confirmText={`Delete ${pkg.name}? This can't be undone.`} />
        </form>
      </div>

      {saved ? (
        <p className="mt-6 inline-block border border-success/40 bg-success/10 px-4 py-2 text-sm text-success">
          Saved.
        </p>
      ) : null}

      {/* ── Departure dates ── */}
      <div className="mt-10 max-w-3xl border border-line-2 bg-paper p-7">
        <p className="eyebrow">Departure dates</p>
        <p className="mt-2 text-sm text-ink-2">
          Each date shown in the &ldquo;Choose your departure&rdquo; dropdown on the
          package page, with its own seats-left count and an optional price
          override.
        </p>

        {!departures || departures.length === 0 ? (
          <p className="mt-6 text-sm text-ink-3">No departure dates yet — add one below.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {departures.map((d) => {
              const boundUpdateDeparture = updateDeparture.bind(null, d.id, slug);
              const boundDeleteDeparture = deleteDeparture.bind(null, d.id, slug);
              return (
                <li key={d.id} className="border border-line-2 bg-paper-2 p-5">
                  <form
                    action={boundUpdateDeparture}
                    className="flex flex-wrap items-end gap-4"
                  >
                    <div className="min-w-[9rem]">
                      <span className="block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-3">
                        Date
                      </span>
                      <p className="mt-1 min-h-[52px] content-center text-ink">
                        {new Date(`${d.departure_date}T00:00:00`).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <TextField
                      label="Seats left"
                      name="seats_left"
                      type="number"
                      min={0}
                      required
                      defaultValue={d.seats_left}
                      className="w-32"
                    />
                    <TextField
                      label="Price override"
                      name="price_override"
                      type="number"
                      min={0}
                      hint="Blank = base price"
                      defaultValue={d.price_override ?? ""}
                      className="w-40"
                    />
                    <label className="flex items-center gap-2 pb-3 text-sm text-ink-2">
                      <input
                        type="checkbox"
                        name="sold_out"
                        defaultChecked={d.sold_out}
                        className="h-5 w-5 cursor-pointer accent-brass-deep"
                      />
                      Sold out
                    </label>
                    <Button type="submit" size="md">
                      Save
                    </Button>
                  </form>
                  <form action={boundDeleteDeparture} className="mt-3">
                    <DeleteButton confirmText="Remove this departure date?">
                      Remove date
                    </DeleteButton>
                  </form>
                </li>
              );
            })}
          </ul>
        )}

        <form action={boundAddDeparture} className="mt-6 flex flex-wrap items-end gap-4 border-t border-line-2 pt-6">
          <TextField
            label="New departure date"
            name="departure_date"
            type="date"
            required
            className="w-48"
          />
          <TextField
            label="Seats left"
            name="seats_left"
            type="number"
            min={0}
            required
            defaultValue={10}
            className="w-32"
          />
          <TextField
            label="Price override"
            name="price_override"
            type="number"
            min={0}
            hint="Blank = base price"
            className="w-40"
          />
          <Button type="submit" size="md" withArrow>
            Add date
          </Button>
        </form>
      </div>

      <PackageForm
        action={boundUpdate}
        defaultValues={pkg}
        submitLabel="Save changes"
        lockSlug
      />
    </div>
  );
}
