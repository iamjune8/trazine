"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TextField, SelectField, ChoiceField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Turnstile } from "@/components/ui/Turnstile";
import {
  destinationOptions,
  accommodationOptions,
  transferOptions,
  flightBookedOptions,
  validateInquiry,
  hasErrors,
  todayISO,
  type FieldErrors,
  type InquiryInput,
} from "@/lib/inquiry";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

/**
 * The one enquiry form, used inside the modal, on the contact page and in
 * every destination page's sidebar rail.
 *
 * Built to be answerable in about two minutes: every field but name/email/
 * phone is a tap, not typing — selects and pill-style choices rather than
 * free text, and no open "tell us more" box. What used to be a single flat
 * grid is now three short, numbered sections (a magazine questionnaire's
 * "the details" panel, not a form) — who's coming, the trip itself, then
 * two quick either/or questions.
 *
 * Validation strategy: nothing is flagged until the user has left a field
 * (`touched`), then that field re-validates on every keystroke so an error
 * clears the moment it is fixed. Submitting marks everything touched, moves
 * focus to the first invalid control, and shows errors beside their own field.
 */

const EMPTY: InquiryInput = {
  name: "",
  email: "",
  phone: "",
  destination: "",
  adults: "2",
  children: "0",
  accommodation: "",
  nights: "",
  travelDate: "",
  transfers: "",
  flightBooked: "",
};

type Status = "idle" | "submitting" | "success" | "error";

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-line pb-2.5 sm:col-span-2">
      <span className="font-display text-xl text-brass" aria-hidden="true">
        {number}
      </span>
      <h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink-3">
        {title}
      </h3>
    </div>
  );
}

export function EnquiryForm({
  defaultDestination,
  source = "website",
  compact = false,
  onSuccess,
}: {
  defaultDestination?: string;
  source?: string;
  /** Tightens spacing for the modal. */
  compact?: boolean;
  onSuccess?: () => void;
}) {
  const reduced = useReducedMotion();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<InquiryInput>({
    ...EMPTY,
    destination: defaultDestination ?? "",
  });
  const [touched, setTouched] = useState<Set<keyof InquiryInput>>(new Set());
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const captchaRequired = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  const allErrors = validateInquiry(values);
  const visibleErrors: FieldErrors = {};
  for (const key of Object.keys(allErrors) as (keyof InquiryInput)[]) {
    if (touched.has(key)) visibleErrors[key] = allErrors[key];
  }

  function update(field: keyof InquiryInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function blur(field: keyof InquiryInput) {
    setTouched((prev) => new Set(prev).add(field));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    if (hasErrors(allErrors)) {
      setTouched(new Set(Object.keys(EMPTY) as (keyof InquiryInput)[]));
      // Move focus to the first control that failed, so keyboard and screen
      // reader users are taken to the problem rather than told about it.
      // `setTouched` above hasn't painted yet — querying the DOM synchronously
      // here would still see the pre-submit `aria-invalid` state, so the query
      // has to wait for React to re-render with the new errors. `setTimeout`
      // rather than `requestAnimationFrame`: rAF is paused on a backgrounded
      // tab, and a user can easily alt-tab between clicking submit and the
      // validation running.
      const form = event.currentTarget;
      setTimeout(() => {
        form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      }, 0);
      return;
    }

    if (captchaRequired && !turnstileToken) {
      setServerError("Please complete the verification check below, then send again.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          source,
          company: honeypotRef.current?.value ?? "",
          turnstileToken,
        }),
      });

      if (!response.ok) throw new Error(`Request failed (${response.status})`);

      trackEvent("generate_lead", { source, destination: values.destination });
      setStatus("success");
      onSuccess?.();
    } catch {
      setStatus("error");
      setTurnstileToken(null);
      setServerError(
        "We couldn't send that just now. Please try again, or call us directly — we'd rather hear from you than lose the enquiry.",
      );
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="py-6 text-center"
        role="status"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brass text-brass-deep">
          <Icon name="check" size={26} />
        </span>
        <h3 className="font-display mt-6 text-[length:var(--step-h3)]">
          Thank you — that&rsquo;s with us.
        </h3>
        <p className="mx-auto mt-4 max-w-md text-ink-2">
          A consultant will be in touch within one working day, usually sooner. If
          your dates are tight, call us on{" "}
          <a
            href={site.phoneHref}
            onClick={() => trackEvent("call_click", { source: "enquiry-success" })}
            className="link-underline font-medium text-brass-deep"
          >
            {site.phone}
          </a>{" "}
          and we&rsquo;ll start straight away.
        </p>
      </motion.div>
    );
  }

  const gap = compact ? "gap-5" : "gap-7";
  const sectionGap = compact ? "mt-7" : "mt-9";

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      {/* Honeypot — invisible to a real visitor, irresistible to a bot that
          fills every field it finds. Off-screen rather than display:none,
          since some bots specifically skip hidden inputs; tabIndex -1 and
          aria-hidden keep it out of the way for keyboard and screen-reader
          users. See the matching check in /api/inquiries. */}
      <input
        ref={honeypotRef}
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      />

      <p className="font-display text-lg italic leading-snug text-brass-deep">
        Two minutes of your time — the itinerary is our work from here.
      </p>

      {/* 01 — Who's travelling */}
      <div className={cn("grid grid-cols-1 sm:grid-cols-2", gap, sectionGap)}>
        <SectionHeading number="01" title="Who's travelling" />
        <TextField
          label="Your name"
          name="name"
          required
          autoComplete="name"
          placeholder="e.g. Ananya Deshmukh"
          className="sm:col-span-2"
          value={values.name}
          error={visibleErrors.name}
          onChange={(e) => update("name", e.target.value)}
          onBlur={() => blur("name")}
        />
        <TextField
          label="Phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="+91 81085 31332"
          hint="We'll call at a time that suits you."
          value={values.phone}
          error={visibleErrors.phone}
          onChange={(e) => update("phone", e.target.value)}
          onBlur={() => blur("phone")}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={values.email}
          error={visibleErrors.email}
          onChange={(e) => update("email", e.target.value)}
          onBlur={() => blur("email")}
        />
        <TextField
          label="Adults"
          name="adults"
          type="number"
          inputMode="numeric"
          min={1}
          required
          value={values.adults}
          error={visibleErrors.adults}
          onChange={(e) => update("adults", e.target.value)}
          onBlur={() => blur("adults")}
        />
        <TextField
          label="Children"
          name="children"
          type="number"
          inputMode="numeric"
          min={0}
          hint="Under 12, if any."
          value={values.children}
          error={visibleErrors.children}
          onChange={(e) => update("children", e.target.value)}
          onBlur={() => blur("children")}
        />
      </div>

      {/* 02 — The trip */}
      <div className={cn("grid grid-cols-1 sm:grid-cols-2", gap, sectionGap)}>
        <SectionHeading number="02" title="The trip" />
        <SelectField
          label="Destination"
          name="destination"
          required
          options={destinationOptions}
          placeholder="Where are you thinking of?"
          className="sm:col-span-2"
          value={values.destination}
          error={visibleErrors.destination}
          onChange={(e) => update("destination", e.target.value)}
          onBlur={() => blur("destination")}
        />
        <TextField
          label="Nights"
          name="nights"
          type="number"
          inputMode="numeric"
          min={1}
          required
          placeholder="e.g. 7"
          value={values.nights}
          error={visibleErrors.nights}
          onChange={(e) => update("nights", e.target.value)}
          onBlur={() => blur("nights")}
        />
        <TextField
          label="Travel date"
          name="travelDate"
          type="date"
          required
          min={todayISO()}
          hint="Just the date you'd leave — the rest can flex."
          value={values.travelDate}
          error={visibleErrors.travelDate}
          onChange={(e) => update("travelDate", e.target.value)}
          onBlur={() => blur("travelDate")}
        />
        <SelectField
          label="Hotel comfort"
          name="accommodation"
          required
          options={accommodationOptions}
          placeholder="Select"
          className="sm:col-span-2"
          value={values.accommodation}
          error={visibleErrors.accommodation}
          onChange={(e) => update("accommodation", e.target.value)}
          onBlur={() => blur("accommodation")}
        />
      </div>

      {/* 03 — A couple of quick ones */}
      <div className={cn("grid grid-cols-1 sm:grid-cols-2", gap, sectionGap)}>
        <SectionHeading number="03" title="A couple of quick ones" />
        <ChoiceField
          label="Getting around"
          name="transfers"
          required
          options={transferOptions}
          value={values.transfers}
          error={visibleErrors.transfers}
          onChange={(value) => {
            update("transfers", value);
            blur("transfers");
          }}
        />
        <ChoiceField
          label="Flights booked already?"
          name="flightBooked"
          required
          options={flightBookedOptions}
          value={values.flightBooked}
          error={visibleErrors.flightBooked}
          onChange={(value) => {
            update("flightBooked", value);
            blur("flightBooked");
          }}
        />
      </div>

      {serverError ? (
        <p
          className="mt-6 flex items-start gap-2 border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger"
          role="alert"
        >
          <Icon name="close" size={16} className="mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </p>
      ) : null}

      <Turnstile
        onVerify={(token) => setTurnstileToken(token)}
        onExpire={() => setTurnstileToken(null)}
      />

      <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          withArrow={status !== "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send enquiry"}
        </Button>
        <p className="max-w-xs text-sm leading-relaxed text-ink-3">
          No obligation, and we never pass your details on.
        </p>
      </div>

      {/* Announce the in-flight state to assistive tech without a visual change. */}
      <span aria-live="polite" className="sr-only">
        {status === "submitting" ? "Sending your enquiry" : ""}
      </span>
    </form>
  );
}
