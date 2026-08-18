import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Card } from "@/components/admin/ui/Card";
import { Badge } from "@/components/admin/ui/Badge";
import { MotionStagger, MotionStaggerItem } from "@/components/admin/ui/MotionIn";
import { Icon } from "@/components/ui/Icon";
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

const STATUS_TONE: Record<Status, "violet" | "cyan" | "success" | "danger"> = {
  new: "violet",
  contacted: "cyan",
  won: "success",
  lost: "danger",
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
      <PageHeader
        eyebrow="Pipeline"
        title="Leads"
        description="Every enquiry submitted through the website."
        actions={
          <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
            <Link
              href="/admin/leads"
              className={cn(
                "rounded-xl border px-3.5 py-2 text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-200",
                !activeStatus
                  ? "border-admin-violet/50 bg-admin-violet/15 text-admin-text"
                  : "border-admin-border text-admin-text-2 hover:border-admin-violet/40",
              )}
            >
              All
            </Link>
            {STATUSES.map((s) => (
              <Link
                key={s}
                href={`/admin/leads?status=${s}`}
                className={cn(
                  "rounded-xl border px-3.5 py-2 text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-200",
                  activeStatus === s
                    ? "border-admin-violet/50 bg-admin-violet/15 text-admin-text"
                    : "border-admin-border text-admin-text-2 hover:border-admin-violet/40",
                )}
              >
                {STATUS_LABEL[s]}
              </Link>
            ))}
          </nav>
        }
      />

      {error ? (
        <p className="mt-8 rounded-xl border border-admin-danger/30 bg-admin-danger/10 px-4 py-3 text-sm text-admin-danger">
          Couldn&rsquo;t load leads: {error.message}
        </p>
      ) : null}

      <Card className="mt-8 overflow-hidden">
        {!leads || leads.length === 0 ? (
          <p className="p-8 text-admin-text-3">
            {activeStatus ? `No ${STATUS_LABEL[activeStatus].toLowerCase()} leads yet.` : "No enquiries yet."}
          </p>
        ) : (
          <MotionStagger>
            <ul>
              {leads.map((lead, i) => (
                <MotionStaggerItem key={lead.id}>
                  <li className={cn("border-admin-border-soft", i !== leads.length - 1 && "border-b")}>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 transition-colors duration-200 hover:bg-white/[0.03]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-admin-violet/25 to-admin-cyan/15 text-xs font-semibold text-admin-text">
                          {lead.name.slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-admin-text">{lead.name}</p>
                          <p className="mt-0.5 truncate text-xs text-admin-text-3">
                            {lead.email} &middot; {lead.phone}
                            {lead.destination ? ` · ${lead.destination}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <span className="hidden text-xs text-admin-text-3 sm:inline">
                          {new Date(lead.received_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <Badge tone={STATUS_TONE[lead.status as Status] ?? "violet"}>
                          {STATUS_LABEL[lead.status as Status] ?? lead.status}
                        </Badge>
                        <Icon name="chevron-right" size={16} className="text-admin-text-3" />
                      </div>
                    </Link>
                  </li>
                </MotionStaggerItem>
              ))}
            </ul>
          </MotionStagger>
        )}
      </Card>
    </div>
  );
}
