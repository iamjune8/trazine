import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDeleteButton } from "@/components/admin/ui/AdminDeleteButton";
import { AdminTextField, AdminCheckboxField } from "@/components/admin/ui/AdminField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Card } from "@/components/admin/ui/Card";
import { Badge } from "@/components/admin/ui/Badge";
import { Icon } from "@/components/ui/Icon";
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
        className="inline-flex items-center gap-1.5 text-sm text-admin-text-3 transition-colors duration-200 hover:text-admin-text"
      >
        <Icon name="chevron-left" size={15} />
        All packages
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-admin-text sm:text-3xl">Edit {pkg.name}</h1>
        <form action={boundDelete}>
          <AdminDeleteButton confirmText={`Delete ${pkg.name}? This can't be undone.`} />
        </form>
      </div>

      {saved ? (
        <p className="mt-6 inline-flex items-center gap-2 rounded-xl border border-admin-success/30 bg-admin-success/10 px-4 py-2 text-sm text-admin-success">
          <Icon name="check" size={15} />
          Saved.
        </p>
      ) : null}

      {/* ── Departure dates ── */}
      <Card className="mt-10 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-admin-cyan/25 to-admin-indigo/10 text-admin-cyan">
            <Icon name="calendar" size={20} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-admin-text">Departure dates</h2>
            <p className="mt-1 text-sm leading-relaxed text-admin-text-3">
              Each date shown in the &ldquo;Choose your departure&rdquo; dropdown on the package
              page, with its own seats-left count and an optional price override.
            </p>
          </div>
        </div>

        {!departures || departures.length === 0 ? (
          <p className="mt-6 text-sm text-admin-text-3">No departure dates yet — add one below.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {departures.map((d) => {
              const boundUpdateDeparture = updateDeparture.bind(null, d.id, slug);
              const boundDeleteDeparture = deleteDeparture.bind(null, d.id, slug);
              return (
                <li key={d.id} className="rounded-xl border border-admin-border-soft bg-white/[0.02] p-5">
                  <form action={boundUpdateDeparture} className="flex flex-wrap items-end gap-4">
                    <div className="min-w-[9rem]">
                      <span className="block text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-admin-text-3">
                        Date
                      </span>
                      <p className="mt-1.5 flex min-h-[46px] items-center gap-2 text-sm text-admin-text">
                        {d.sold_out ? <Badge tone="danger">Sold out</Badge> : null}
                        {new Date(`${d.departure_date}T00:00:00`).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <AdminTextField
                      label="Seats left"
                      name="seats_left"
                      type="number"
                      min={0}
                      required
                      defaultValue={d.seats_left}
                      className="w-32"
                    />
                    <AdminTextField
                      label="Price override"
                      name="price_override"
                      type="number"
                      min={0}
                      hint="Blank = base price"
                      defaultValue={d.price_override ?? ""}
                      className="w-40"
                    />
                    <div className="pb-2.5">
                      <AdminCheckboxField label="Sold out" name="sold_out" defaultChecked={d.sold_out} />
                    </div>
                    <AdminButton type="submit" size="md" variant="outline">
                      Save
                    </AdminButton>
                  </form>
                  <form action={boundDeleteDeparture} className="mt-3">
                    <AdminDeleteButton confirmText="Remove this departure date?">
                      Remove date
                    </AdminDeleteButton>
                  </form>
                </li>
              );
            })}
          </ul>
        )}

        <form
          action={boundAddDeparture}
          className="mt-6 flex flex-wrap items-end gap-4 border-t border-admin-border-soft pt-6"
        >
          <AdminTextField label="New departure date" name="departure_date" type="date" required className="w-48" />
          <AdminTextField
            label="Seats left"
            name="seats_left"
            type="number"
            min={0}
            required
            defaultValue={10}
            className="w-32"
          />
          <AdminTextField
            label="Price override"
            name="price_override"
            type="number"
            min={0}
            hint="Blank = base price"
            className="w-40"
          />
          <AdminButton type="submit" size="md" icon="plus" withArrow>
            Add date
          </AdminButton>
        </form>
      </Card>

      <PackageForm action={boundUpdate} defaultValues={pkg} submitLabel="Save changes" lockSlug />
    </div>
  );
}
