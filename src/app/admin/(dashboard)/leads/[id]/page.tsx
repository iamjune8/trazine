import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SelectField, TextAreaField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { updateLead } from "../actions";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = ["new", "contacted", "won", "lost"] as const;

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).single();

  if (!lead) notFound();

  const boundUpdate = updateLead.bind(null, id);

  // Older leads (before trip-detail fields were added) only have the
  // original travellers/travel_window text — shown as a fallback so nothing
  // in the historical record goes blank.
  const travellers =
    lead.adults != null
      ? `${lead.adults} adult${lead.adults === 1 ? "" : "s"}${
          lead.children ? `, ${lead.children} child${lead.children === 1 ? "" : "ren"}` : ""
        }`
      : lead.travellers;

  const travelDate = lead.travel_date
    ? new Date(`${lead.travel_date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : lead.travel_window;

  const facts: { label: string; value: string | null }[] = [
    { label: "Email", value: lead.email },
    { label: "Phone", value: lead.phone },
    { label: "Destination", value: lead.destination },
    { label: "Travellers", value: travellers },
    { label: "Nights", value: lead.nights != null ? String(lead.nights) : null },
    { label: "Travel date", value: travelDate },
    { label: "Hotel comfort", value: lead.accommodation },
    { label: "Transfers", value: lead.transfers },
    {
      label: "Flights booked?",
      value: lead.flight_booked === null ? null : lead.flight_booked ? "Yes" : "No",
    },
    { label: "Source", value: lead.source },
    {
      label: "Received",
      value: new Date(lead.received_at).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    },
  ];

  return (
    <div>
      <Link
        href="/admin/leads"
        className="text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
      >
        ← All leads
      </Link>

      <h1 className="font-display mt-4 text-3xl text-ink">{lead.name}</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <dl className="grid grid-cols-1 gap-6 border border-line bg-paper p-6 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-ink-3">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-ink">{fact.value || "—"}</dd>
              </div>
            ))}
          </dl>

          {lead.message ? (
            <div className="mt-6 border border-line bg-paper p-6">
              <p className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-ink-3">
                Message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-ink-2">{lead.message}</p>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-5">
          <form action={boundUpdate} className="border border-line-2 bg-paper-2 p-7">
            <p className="eyebrow">Manage</p>
            <div className="mt-6 space-y-6">
              <SelectField
                label="Status"
                name="status"
                defaultValue={lead.status}
                options={STATUS_OPTIONS}
                placeholder="Select a status"
              />
              <TextAreaField
                label="Internal notes"
                name="notes"
                defaultValue={lead.notes ?? ""}
                rows={6}
                hint="Only visible here, never on the website."
              />
            </div>
            <Button type="submit" size="lg" className="mt-7 w-full">
              Save
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
