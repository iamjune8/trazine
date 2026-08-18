import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSelectField, AdminTextAreaField } from "@/components/admin/ui/AdminField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Card } from "@/components/admin/ui/Card";
import { Icon } from "@/components/ui/Icon";
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

  const facts: { label: string; value: string | null; icon: Parameters<typeof Icon>[0]["name"] }[] = [
    { label: "Email", value: lead.email, icon: "mail" },
    { label: "Phone", value: lead.phone, icon: "phone" },
    { label: "Destination", value: lead.destination, icon: "pin" },
    { label: "Travellers", value: travellers, icon: "users" },
    { label: "Nights", value: lead.nights != null ? String(lead.nights) : null, icon: "bed" },
    { label: "Travel date", value: travelDate, icon: "calendar" },
    { label: "Hotel comfort", value: lead.accommodation, icon: "bed" },
    { label: "Transfers", value: lead.transfers, icon: "map-route" },
    {
      label: "Flights booked?",
      value: lead.flight_booked === null ? null : lead.flight_booked ? "Yes" : "No",
      icon: "plane",
    },
    { label: "Source", value: lead.source, icon: "sparkle" },
    {
      label: "Received",
      value: new Date(lead.received_at).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      icon: "clock",
    },
  ];

  return (
    <div>
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm text-admin-text-3 transition-colors duration-200 hover:text-admin-text"
      >
        <Icon name="chevron-left" size={15} />
        All leads
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-admin-violet/30 to-admin-cyan/15 text-sm font-semibold text-admin-text">
          {lead.name.slice(0, 1).toUpperCase()}
        </span>
        <h1 className="text-2xl font-semibold text-admin-text sm:text-3xl">{lead.name}</h1>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-7">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-admin-text-3">
                  <Icon name={fact.icon} size={14} />
                </span>
                <div>
                  <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-admin-text-3">
                    {fact.label}
                  </p>
                  <p className="mt-0.5 text-sm text-admin-text">{fact.value || "—"}</p>
                </div>
              </div>
            ))}
          </Card>

          {lead.message ? (
            <Card className="p-6 sm:p-7">
              <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-admin-text-3">
                Message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-admin-text-2">
                {lead.message}
              </p>
            </Card>
          ) : null}
        </div>

        <div className="lg:col-span-5">
          <Card className="admin-glow-ring p-7">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-admin-violet">
              Manage
            </p>
            <form action={boundUpdate} className="mt-6 space-y-6">
              <AdminSelectField
                label="Status"
                name="status"
                defaultValue={lead.status}
                options={STATUS_OPTIONS}
                placeholder="Select a status"
              />
              <AdminTextAreaField
                label="Internal notes"
                name="notes"
                defaultValue={lead.notes ?? ""}
                rows={6}
                hint="Only visible here, never on the website."
              />
              <AdminButton type="submit" size="lg" className="w-full">
                Save
              </AdminButton>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
