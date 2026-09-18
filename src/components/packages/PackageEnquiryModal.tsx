"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { Turnstile } from "@/components/ui/Turnstile";
import { Button } from "@/components/ui/Button";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { trackEvent, trackConversion } from "@/lib/analytics";

/**
 * A dedicated enquiry dialog for the package booking flow — deliberately not
 * the site-wide <EnquiryModal>. That one is a wide, editorial, multi-section
 * form built for someone still deciding where to go; this one opens with the
 * decision already made (package, date, pax, price all fixed by the booking
 * card), so it's a compact confirmation-style card that summarises the trip
 * back before asking only for who's asking: name, mobile, email, an optional
 * note. Compact sizing and the boxed summary panel are the only things that
 * still set it apart from the rest of the site — everything else (fields,
 * type, focus, buttons) is the shared Travzine language, since this is an
 * enquiry a consultant follows up on, not a checkout that takes payment.
 */

export type PackageEnquirySummary = {
  packageName: string;
  departureCode: string;
  departureDateLabel: string;
  departureDateISO: string;
  pax: number;
  estTotalLabel: string;
  estTotal: number;
  currency: string;
  slug: string;
  /** Set fresh each time the modal opens — used as a React key so the form
   * panel below remounts with clean field state instead of carrying over
   * whatever was typed into a previous enquiry. */
  openedAt: number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-\s\d]{8,20}$/;

type Status = "idle" | "submitting" | "success" | "error";

export function PackageEnquiryModal({
  summary,
  onClose,
}: {
  summary: PackageEnquirySummary | null;
  onClose: () => void;
}) {
  const isOpen = summary !== null;
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(isOpen);
  const [lastSummary, setLastSummary] = useState(summary);

  // Mounting and `lastSummary` are set during render (React re-renders
  // immediately, before paint, so this has the same effect as an
  // effect-based update without the extra render pass). `lastSummary`
  // keeps the panel's content rendered through the closing transition,
  // since `summary` itself goes null the instant the caller closes it.
  // Unmounting stays in an effect since it's a genuinely delayed,
  // cancellable timer — decoupled from AnimatePresence's own exit-complete
  // signal, which can get stuck and leave an invisible, click-blocking
  // overlay in the DOM forever (reproduced in testing); a plain timer
  // matching the longest exit transition below removes it deterministically
  // instead.
  if (summary && summary !== lastSummary) {
    setLastSummary(summary);
    setMounted(true);
  }

  useEffect(() => {
    if (summary) return;
    const timer = setTimeout(() => setMounted(false), 400);
    return () => clearTimeout(timer);
  }, [summary]);

  const displaySummary = summary ?? lastSummary;

  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [isOpen, onClose]);

  if (!mounted || !displaySummary) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <m.button
        type="button"
        aria-label="Close enquiry form"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-ink/60 backdrop-blur-[3px]"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.25 }}
      />

      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-enquiry-title"
        tabIndex={-1}
        initial={reduced ? false : { opacity: 0, y: 28, scale: 0.97 }}
        animate={
          isOpen
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 20, scale: 0.98 }
        }
        transition={{ duration: reduced ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto bg-paper p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl outline-none sm:p-8"
      >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center text-ink-3 transition-colors duration-200 hover:text-ink"
            >
              <Icon name="close" size={20} />
            </button>

            <PackageEnquiryPanel
              key={displaySummary.openedAt}
              summary={displaySummary}
              onClose={onClose}
            />
      </m.div>
    </div>
  );
}

/**
 * Remounted (via the `key` above) every time the dialog opens, so its field
 * state always starts clean without needing a setState-in-effect reset.
 */
function PackageEnquiryPanel({
  summary,
  onClose,
}: {
  summary: PackageEnquirySummary;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const honeypotRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const captchaRequired = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Re-entrancy guard — see the matching comment in EnquiryForm.tsx: the
    // submit button's `disabled` lags one render behind this handler
    // starting, so a fast double-click can invoke it twice before that
    // commit. `status` is read fresh on every render, closing that race.
    if (status === "submitting") return;
    setServerError(null);

    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Please tell us your name.";
    if (!PHONE_RE.test(phone)) nextErrors.phone = "Enter a valid mobile number.";
    if (!EMAIL_RE.test(email)) nextErrors.email = "Enter a valid email address.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const form = event.currentTarget;
      setTimeout(() => {
        form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      }, 0);
      return;
    }

    if (captchaRequired && !turnstileToken) {
      setServerError("Please complete the verification check below, then submit again.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/package-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          email,
          specialRequests: notes,
          packageName: summary.packageName,
          departureCode: summary.departureCode,
          departureDate: summary.departureDateISO,
          pax: String(summary.pax),
          estTotal: String(summary.estTotal),
          currency: summary.currency,
          source: `package-${summary.slug}`,
          company: honeypotRef.current?.value ?? "",
          turnstileToken,
        }),
      });

      if (!response.ok) throw new Error(`Request failed (${response.status})`);

      trackEvent("generate_lead", {
        source: `package-${summary.slug}`,
        destination: summary.packageName,
      });
      trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD, {
        value: summary.estTotal,
        currency: summary.currency,
        email,
        phone,
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setTurnstileToken(null);
      setServerError("We couldn't send that just now. Please try again, or call us directly.");
    }
  }

  if (status === "success") {
    return (
      <m.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-6 text-center"
        role="status"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brass text-brass-deep">
          <Icon name="check" size={26} />
        </span>
        <h2 className="font-display mt-6 text-xl text-ink">Enquiry sent — we&rsquo;ve got it.</h2>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink-2">
          A consultant will call or email you within one working day to confirm this departure
          and lock your seats.
        </p>
        <Button type="button" onClick={onClose} className="mt-7">
          Done
        </Button>
      </m.div>
    );
  }

  return (
    <>
      <h2 id="package-enquiry-title" className="font-display pr-8 text-xl text-ink">
        Enquire about this trip
      </h2>

      <div className="mt-5 border border-line-2 bg-paper-2 p-5">
        <p className="text-sm font-medium text-ink">
          {summary.packageName}
          {summary.departureCode ? ` | ${summary.departureCode}` : ""}
        </p>
        <div className="mt-4 flex items-start justify-between gap-4 text-sm">
          <div>
            <p className="text-ink-3">Departure</p>
            <p className="mt-0.5 font-medium text-ink">{summary.departureDateLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-ink-3">Travellers</p>
            <p className="mt-0.5 font-medium text-ink">{summary.pax}</p>
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-line-2 pt-4">
          <p className="text-sm text-ink-3">Estimated price</p>
          <p className="text-xl font-semibold text-brass-deep">{summary.estTotalLabel}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <input
          ref={honeypotRef}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            label="Your name"
            name="name"
            required
            value={name}
            error={errors.name}
            placeholder="e.g. Ananya Deshmukh"
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Phone"
            name="phone"
            required
            type="tel"
            inputMode="tel"
            value={phone}
            error={errors.phone}
            placeholder="9876543210"
            autoComplete="tel"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <TextField
          label="Email"
          name="email"
          required
          type="email"
          inputMode="email"
          value={email}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextAreaField
          label="Special requests"
          name="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requirements or questions…"
        />

        {serverError ? (
          <p
            className="flex items-start gap-2 border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger"
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

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={status === "submitting"} className="flex-1">
            {status === "submitting" ? "Sending…" : "Submit Enquiry"}
          </Button>
        </div>
      </form>
    </>
  );
}
