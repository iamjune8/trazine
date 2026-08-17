import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "won", "lost"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_LABEL: Record<Status, string> = {
  new: "New",
  contacted: "Contacted",
  won: "Won",
  lost: "Lost",
};

const STATUS_STYLE: Record<Status, string> = {
  new: "bg-brass-light/25 text-brass-deep",
  contacted: "bg-line-2/60 text-ink-2",
  won: "bg-success/15 text-success",
  lost: "bg-danger/10 text-danger",
};

type Props = { searchParams: Promise<{ status?: string }> };

export default async function LeadsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const activeStatus = STATUSES.includes(status as Status) ? (status as Status) : undefined;

  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("id, name, email, phone, destination, status, received_at")
    .order("received_at", { ascending: false });

  if (activeStatus) query = query.eq("status", activeStatus);

  const { data: leads, error } = await query;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Leads</h1>
          <p className="mt-2 text-ink-2">Every enquiry submitted through the website.</p>
        </div>

        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          <Link
            href="/admin/leads"
            className={cn(
              "border px-4 py-2 text-sm font-medium uppercase tracking-[0.08em] transition-colors duration-200",
              !activeStatus
                ? "border-ink bg-ink text-paper"
                : "border-line-2 text-ink-2 hover:border-ink",
            )}
          >
            All
          </Link>
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/leads?status=${s}`}
              className={cn(
                "border px-4 py-2 text-sm font-medium uppercase tracking-[0.08em] transition-colors duration-200",
                activeStatus === s
                  ? "border-ink bg-ink text-paper"
                  : "border-line-2 text-ink-2 hover:border-ink",
              )}
            >
              {STATUS_LABEL[s]}
            </Link>
          ))}
        </nav>
      </div>

      {error ? (
        <p className="mt-8 border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger">
          Couldn&rsquo;t load leads: {error.message}
        </p>
      ) : null}

      <div className="mt-8 border border-line bg-paper">
        {!leads || leads.length === 0 ? (
          <p className="p-8 text-ink-2">
            {activeStatus ? `No ${STATUS_LABEL[activeStatus].toLowerCase()} leads yet.` : "No enquiries yet."}
          </p>
        ) : (
          <ul>
            {leads.map((lead) => (
              <li key={lead.id} className="border-b border-line last:border-b-0">
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 transition-colors duration-200 hover:bg-paper-2"
                >
                  <div className="min-w-0">
                    <p className="font-display text-lg text-ink">{lead.name}</p>
                    <p className="mt-1 text-sm text-ink-3">
                      {lead.email} · {lead.phone}
                      {lead.destination ? ` · ${lead.destination}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <span className="text-sm text-ink-3">
                      {new Date(lead.received_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span
                      className={cn(
                        "px-3 py-1 text-xs font-medium uppercase tracking-[0.08em]",
                        STATUS_STYLE[lead.status as Status] ?? STATUS_STYLE.new,
                      )}
                    >
                      {STATUS_LABEL[lead.status as Status] ?? lead.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
