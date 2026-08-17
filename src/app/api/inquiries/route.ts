import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { validateInquiry, hasErrors } from "@/lib/inquiry";
import { sendLeadNotification } from "@/lib/email";

/**
 * Enquiry intake — writes straight into the `leads` table the admin panel
 * reads from (/admin/leads), replacing the old placeholder JSON-file log.
 * RLS on `leads` allows anonymous INSERT only — no SELECT/UPDATE/DELETE — so
 * this route can't be used to read back or tamper with anyone else's data
 * even with the public Supabase key.
 */

/** Server-side length caps, independent of anything the browser enforced. */
const MAX = {
  name: 120,
  email: 200,
  phone: 30,
  destination: 120,
  adults: 4,
  children: 4,
  accommodation: 40,
  nights: 4,
  travelDate: 10,
  transfers: 20,
  flightBooked: 5,
  source: 80,
} as const;

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  // Strip control characters, collapse runs of whitespace, then cap length.
  return value
    .replace(/\p{Cc}/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request body." },
      { status: 400 },
    );
  }

  // Honeypot: a field named to look legitimate to a bot filling every input
  // it finds, but hidden from real visitors (see EnquiryForm's "company"
  // field). Anything in it means non-human traffic — report success without
  // writing anything, so the bot has no signal to adapt against.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return NextResponse.json({ ok: true, id: "0" }, { status: 201 });
  }

  const input = {
    name: clean(payload.name, MAX.name),
    email: clean(payload.email, MAX.email),
    phone: clean(payload.phone, MAX.phone),
    destination: clean(payload.destination, MAX.destination),
    adults: clean(payload.adults, MAX.adults),
    children: clean(payload.children, MAX.children),
    accommodation: clean(payload.accommodation, MAX.accommodation),
    nights: clean(payload.nights, MAX.nights),
    travelDate: clean(payload.travelDate, MAX.travelDate),
    transfers: clean(payload.transfers, MAX.transfers),
    flightBooked: clean(payload.flightBooked, MAX.flightBooked),
    source: clean(payload.source, MAX.source) || "website",
  };

  // The client validates for a good experience; the server validates because
  // it is the only place validation actually counts.
  const errors = validateInquiry(input);
  if (hasErrors(errors)) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Generated here rather than read back via `.select()` after insert: the
  // public role can INSERT into leads but deliberately can't SELECT from it
  // (only an authenticated admin can read a lead back), and Supabase's
  // default `Prefer: return=representation` needs read access to satisfy the
  // RETURNING clause — requesting it here would fail RLS despite the insert
  // itself being fine. Skipping `.select()` sends `return=minimal` instead.
  const id = crypto.randomUUID();

  const supabase = createPublicClient();
  const { error } = await supabase.from("leads").insert({
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    destination: input.destination || null,
    adults: Number(input.adults),
    children: input.children ? Number(input.children) : 0,
    accommodation: input.accommodation,
    nights: Number(input.nights),
    travel_date: input.travelDate,
    transfers: input.transfers,
    flight_booked: input.flightBooked === "Yes",
    source: input.source,
  });

  if (error) {
    console.error("[inquiries] failed to persist", error);
    return NextResponse.json(
      { ok: false, error: "Could not record the enquiry." },
      { status: 500 },
    );
  }

  // Best-effort — the lead is already saved above, so a failed notification
  // email is logged (inside sendLeadNotification) rather than surfaced here.
  await sendLeadNotification({
    id,
    ...input,
    siteOrigin: new URL(request.url).origin,
  });

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
