import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { sendPackageEnquiryNotification } from "@/lib/email";

/**
 * A second, narrower intake than /api/inquiries — the package booking
 * widget already knows the destination, dates and price, so this only
 * collects who's asking (name, phone, email, an optional note). Still
 * writes into the shared `leads` table the admin panel already reads from;
 * the package context goes into `message` since `leads` has no
 * package-specific columns of its own.
 */

const MAX = {
  name: 120,
  email: 200,
  phone: 30,
  packageName: 120,
  departureCode: 20,
  departureDate: 10,
  pax: 3,
  estTotal: 12,
  currency: 6,
  specialRequests: 1000,
  source: 80,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-\s\d]{8,20}$/;

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
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
    return NextResponse.json({ ok: false, error: "Malformed request body." }, { status: 400 });
  }

  // Honeypot — see /api/inquiries for the matching client-side field.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return NextResponse.json({ ok: true, id: "0" }, { status: 201 });
  }

  const input = {
    customerName: clean(payload.customerName, MAX.name),
    email: clean(payload.email, MAX.email),
    phone: clean(payload.phone, MAX.phone),
    packageName: clean(payload.packageName, MAX.packageName),
    departureCode: clean(payload.departureCode, MAX.departureCode),
    departureDate: clean(payload.departureDate, MAX.departureDate),
    pax: clean(payload.pax, MAX.pax),
    estTotal: clean(payload.estTotal, MAX.estTotal),
    currency: clean(payload.currency, MAX.currency) || "INR",
    specialRequests: clean(payload.specialRequests, MAX.specialRequests),
    source: clean(payload.source, MAX.source) || "package",
  };

  const errors: Record<string, string> = {};
  if (!input.customerName) errors.customerName = "Please tell us your name.";
  if (!EMAIL_RE.test(input.email)) errors.email = "Enter a valid email address.";
  if (!PHONE_RE.test(input.phone)) errors.phone = "Enter a valid mobile number.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const id = crypto.randomUUID();
  const pax = Number(input.pax) || 1;

  const messageLines = [
    `Package: ${input.packageName}${input.departureCode ? ` (${input.departureCode})` : ""}`,
    input.departureDate ? `Departure: ${input.departureDate}` : "",
    `Pax: ${pax}`,
    input.estTotal ? `Est. total: ${input.estTotal} ${input.currency}` : "",
    input.specialRequests ? `\nSpecial requests: ${input.specialRequests}` : "",
  ].filter(Boolean);

  const supabase = createPublicClient();
  const { error } = await supabase.from("leads").insert({
    id,
    name: input.customerName,
    email: input.email,
    phone: input.phone,
    destination: input.packageName || null,
    adults: pax,
    children: 0,
    travel_date: input.departureDate || null,
    message: messageLines.join("\n"),
    source: input.source,
  });

  if (error) {
    console.error("[package-enquiries] failed to persist", error);
    return NextResponse.json({ ok: false, error: "Could not record the enquiry." }, { status: 500 });
  }

  await sendPackageEnquiryNotification({
    id,
    ...input,
    siteOrigin: new URL(request.url).origin,
  });

  return NextResponse.json({ ok: true, id }, { status: 201 });
}
