import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Where lead notifications land. Deliberately its own env var rather than
 * reusing `site.email` — that one is public-facing (shown on the contact
 * page); this can be pointed at a different inbox later without touching it.
 */
const NOTIFY_TO = process.env.LEAD_NOTIFICATION_EMAIL || "travelmagazine24@gmail.com";

/**
 * Without a verified sending domain in Resend, `onboarding@resend.dev` is
 * the only address Resend will send from — fine for now, replace once a
 * real domain is verified (see .env.example).
 */
const FROM = process.env.RESEND_FROM_EMAIL || "Travel Magazine <onboarding@resend.dev>";

export type LeadNotification = {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  adults: string;
  children: string;
  accommodation: string;
  nights: string;
  travelDate: string;
  transfers: string;
  flightBooked: string;
  source: string;
  /** The request's own origin, so the admin link works on localhost, a preview deploy, or production without hardcoding a domain. */
  siteOrigin: string;
};

/**
 * Emails the team when a new enquiry lands. Deliberately never throws — by
 * the time this runs the lead is already safely in the `leads` table, and a
 * failed notification email must not turn that into a failed request. A
 * silent no-op if RESEND_API_KEY isn't set, the same inert-until-configured
 * pattern as the GA4/GTM scaffold.
 */
export async function sendLeadNotification(lead: LeadNotification): Promise<void> {
  if (!resend) return;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: lead.email || undefined,
      subject: `New enquiry — ${lead.destination || "destination undecided"}`,
      html: renderLeadEmail(lead),
    });
    if (error) console.error("[email] Resend rejected the notification", error);
  } catch (error) {
    console.error("[email] failed to send lead notification", error);
  }
}

function renderLeadEmail(lead: LeadNotification): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:5px 16px 5px 0;color:#6b6152;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:5px 0;color:#17140f;font-size:14px;">${escapeHtml(value)}</td></tr>`
      : "";

  const children = Number(lead.children) || 0;
  const travellers = `${lead.adults} adult${lead.adults === "1" ? "" : "s"}${
    children > 0 ? `, ${children} child${children === 1 ? "" : "ren"}` : ""
  }`;

  const travelDate = lead.travelDate
    ? new Date(`${lead.travelDate}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return `
    <div style="font-family:Georgia,'Times New Roman',serif;max-width:480px;margin:0 auto;padding:24px;">
      <p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#a97a2b;margin:0 0 8px;">Travel Magazine</p>
      <h1 style="font-size:22px;color:#17140f;margin:0 0 20px;">New enquiry</h1>
      <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        ${row("Name", lead.name)}
        ${row("Email", lead.email)}
        ${row("Phone", lead.phone)}
        ${row("Destination", lead.destination)}
        ${row("Travellers", travellers)}
        ${row("Nights", lead.nights)}
        ${row("Travel date", travelDate)}
        ${row("Hotel comfort", lead.accommodation)}
        ${row("Transfers", lead.transfers)}
        ${row("Flights booked?", lead.flightBooked)}
        ${row("Source", lead.source)}
      </table>
      <p style="margin-top:24px;">
        <a href="${lead.siteOrigin}/admin/leads/${lead.id}" style="color:#7f5a1c;font-size:13px;">View in admin panel →</a>
      </p>
    </div>
  `;
}

export type PackageEnquiryNotification = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  packageName: string;
  departureCode: string;
  departureDate: string;
  pax: string;
  estTotal: string;
  currency: string;
  specialRequests: string;
  source: string;
  siteOrigin: string;
};

/**
 * Separate from `sendLeadNotification` because the shape is different — a
 * package enquiry carries a departure date, pax count and an estimated
 * total already priced by the booking widget, none of which the general
 * enquiry form collects. Still writes into the same `leads` table (see
 * /api/package-enquiries), just formatted into its own email.
 */
export async function sendPackageEnquiryNotification(
  enquiry: PackageEnquiryNotification,
): Promise<void> {
  if (!resend) return;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: enquiry.email || undefined,
      subject: `New package enquiry — ${enquiry.packageName}`,
      html: renderPackageEnquiryEmail(enquiry),
    });
    if (error) console.error("[email] Resend rejected the package enquiry notification", error);
  } catch (error) {
    console.error("[email] failed to send package enquiry notification", error);
  }
}

function renderPackageEnquiryEmail(enquiry: PackageEnquiryNotification): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:5px 16px 5px 0;color:#6b6152;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:5px 0;color:#17140f;font-size:14px;">${escapeHtml(value)}</td></tr>`
      : "";

  const departureDate = enquiry.departureDate
    ? new Date(`${enquiry.departureDate}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const total = enquiry.estTotal
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: enquiry.currency || "INR",
        maximumFractionDigits: 0,
      }).format(Number(enquiry.estTotal))
    : "";

  return `
    <div style="font-family:Georgia,'Times New Roman',serif;max-width:480px;margin:0 auto;padding:24px;">
      <p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#a97a2b;margin:0 0 8px;">Travel Magazine</p>
      <h1 style="font-size:22px;color:#17140f;margin:0 0 20px;">New package enquiry</h1>
      <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        ${row("Package", `${enquiry.packageName}${enquiry.departureCode ? ` (${enquiry.departureCode})` : ""}`)}
        ${row("Departure date", departureDate)}
        ${row("Pax", enquiry.pax)}
        ${row("Est. total", total)}
        ${row("Name", enquiry.customerName)}
        ${row("Email", enquiry.email)}
        ${row("Phone", enquiry.phone)}
        ${row("Special requests", enquiry.specialRequests)}
        ${row("Source", enquiry.source)}
      </table>
      <p style="margin-top:24px;">
        <a href="${enquiry.siteOrigin}/admin/leads/${enquiry.id}" style="color:#7f5a1c;font-size:13px;">View in admin panel →</a>
      </p>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
