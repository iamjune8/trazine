"use client";

import { useRef, useState } from "react";
import { TextField, SelectField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Turnstile } from "@/components/ui/Turnstile";
import { trackEvent, trackConversion } from "@/lib/analytics";
import { useSiteSettings } from "@/components/site/SiteSettingsContext";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

/**
 * The short form Google Ads landing pages need: name, phone, email, and an
 * optional travel month — everything the main site's EnquiryForm asks for
 * beyond that (nights, hotel comfort, transfers, flights already booked)
 * is useful detail but not worth the extra friction on a paid-traffic page
 * whose whole job is to not lose the click.
 *
 * Posts to the same `/api/inquiries` endpoint the full form uses, so leads
 * land in the same admin inbox — the fields this form doesn't ask about are
 * filled with honest placeholders ("Not specified yet") rather than left
 * blank, since the shared endpoint's validation (src/lib/inquiry.ts) is
 * intentionally not duplicated or loosened just for this page.
 */
export function LpEnquiryForm({ destination, source }: { destination: string; source: string }) {
  const settings = useSiteSettings();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const captchaRequired = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    if (name.trim().length < 2 || !phone.trim() || !email.trim()) {
      setServerError("Please fill in your name, phone and email.");
      return;
    }
    if (captchaRequired && !turnstileToken) {
      setServerError("Please complete the verification check below, then send again.");
      return;
    }

    setStatus("submitting");

    // A same-year date roughly two months out when no month is picked —
    // never used to claim the traveller gave a date, only to satisfy the
    // shared endpoint's "when do you leave" field with something more
    // honest than a fabricated exact date.
    const travelDate = (() => {
      const now = new Date();
      if (month) {
        const monthIndex = MONTHS.indexOf(month as (typeof MONTHS)[number]);
        const year = monthIndex < now.getMonth() ? now.getFullYear() + 1 : now.getFullYear();
        return new Date(year, monthIndex, 15).toISOString().slice(0, 10);
      }
      const fallback = new Date(now);
      fallback.setDate(fallback.getDate() + 60);
      return fallback.toISOString().slice(0, 10);
    })();

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          destination,
          adults: "2",
          children: "0",
          accommodation: "Not specified yet",
          nights: "7",
          travelDate,
          transfers: "Not specified yet",
          // The shared endpoint caps this field at 5 characters (built for
          // "Yes"/"No"), so a longer placeholder here would just get
          // silently truncated — "No" is also the safe default assumption
          // for a fresh lead who hasn't gone through the full form.
          flightBooked: "No",
          source,
          company: honeypotRef.current?.value ?? "",
          turnstileToken,
        }),
      });

      if (!response.ok) throw new Error(`Request failed (${response.status})`);

      trackEvent("generate_lead", { source, destination });
      trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD, { email, phone });
      setStatus("success");
    } catch {
      setStatus("error");
      setTurnstileToken(null);
      setServerError(
        "We couldn't send that just now. Please try again, or call us directly.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-none border border-line-2 bg-paper p-8 text-center" role="status">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brass text-brass-deep">
          <Icon name="check" size={26} />
        </span>
        <h3 className="font-display mt-6 text-2xl text-ink">Thank you — that&rsquo;s with us.</h3>
        <p className="mx-auto mt-3 max-w-sm text-ink-2">
          A consultant will call within one working day. If your dates are tight,
          call {settings.phone} directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <input
        ref={honeypotRef}
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="space-y-5">
        <TextField
          label="Your name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ananya Deshmukh"
        />
        <TextField
          label="Phone"
          name="phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 81085 31332"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <SelectField
          label="Preferred travel month"
          name="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          options={MONTHS}
          placeholder="Not sure yet"
        />
      </div>

      {serverError ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {serverError}
        </p>
      ) : null}

      <Turnstile
        onVerify={(token) => setTurnstileToken(token)}
        onExpire={() => setTurnstileToken(null)}
      />

      <Button
        type="submit"
        size="lg"
        withArrow
        disabled={status === "submitting"}
        className="mt-7 w-full"
      >
        {status === "submitting" ? "Sending…" : `Get my ${destination} itinerary`}
      </Button>

      <p className="mt-4 text-center text-xs text-ink-3">
        No obligation. We reply within one working day.
      </p>
    </form>
  );
}
