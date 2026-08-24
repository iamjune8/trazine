"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { Turnstile } from "@/components/ui/Turnstile";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * A dedicated enquiry dialog for the package booking flow — deliberately not
 * the site-wide <EnquiryModal>. That one is a wide, editorial, multi-section
 * form built for someone still deciding where to go; this one opens with the
 * decision already made (package, date, pax, price all fixed by the booking
 * card), so it's a compact confirmation-style card that summarises the
 * booking back before asking only for who's asking: name, mobile, email,
 * an optional note. Rounded corners and a boxed summary panel are used
 * nowhere else on the site, on purpose — it should read as "checkout", not
 * as another editorial page.
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
      <motion.button
        type="button"
        aria-label="Close enquiry form"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-ink/60 backdrop-blur-[3px]"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.25 }}
      />

      <motion.div
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
        className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-paper p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl outline-none sm:p-8"
      >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-ink-3 transition-colors duration-200 hover:bg-paper-2 hover:text-ink"
            >
              <Icon name="close" size={20} />
            </button>

            <PackageEnquiryPanel
              key={displaySummary.openedAt}
              summary={displaySummary}
              onClose={onClose}
            />
      </motion.div>
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
      setStatus("success");
    } catch {
      setStatus("error");
      setTurnstileToken(null);
      setServerError("We couldn't send that just now. Please try again, or call us directly.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-6 text-center"
        role="status"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          <Icon name="check" size={26} />
        </span>
        <h2 className="mt-6 text-xl font-semibold text-ink">Enquiry sent — we&rsquo;ve got it.</h2>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink-2">
          A consultant will call or email you within one working day to confirm this departure
          and lock your seats.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-7 cursor-pointer rounded-lg bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors duration-200 hover:bg-brass-deep"
        >
          Done
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <h2 id="package-enquiry-title" className="pr-8 text-xl font-semibold text-ink">
        Submit enquiry
      </h2>

      <div className="mt-5 rounded-xl border border-line-2 bg-paper-2 p-5">
        <p className="text-sm font-medium text-ink">
          {summary.packageName}
          {summary.departureCode ? ` | ${summary.departureCode}` : ""}
        </p>
        <div className="mt-4 flex items-start justify-between gap-4 text-sm">
          <div>
            <p className="text-ink-3">Departure:</p>
            <p className="mt-0.5 font-medium text-ink">{summary.departureDateLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-ink-3">Pax:</p>
            <p className="mt-0.5 font-medium text-ink">{summary.pax}</p>
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-line-2 pt-4">
          <p className="text-sm text-ink-3">Est. Total:</p>
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
          <ModalField
            label="Customer Name"
            required
            value={name}
            error={errors.name}
            placeholder="Your name"
            autoComplete="name"
            onChange={(v) => setName(v)}
          />
          <ModalField
            label="Mobile Number (10 digits)"
            required
            type="tel"
            inputMode="tel"
            value={phone}
            error={errors.phone}
            placeholder="9876543210"
            autoComplete="tel"
            onChange={(v) => setPhone(v)}
          />
        </div>

        <ModalField
          label="Email"
          required
          type="email"
          inputMode="email"
          value={email}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          onChange={(v) => setEmail(v)}
        />

        <div>
          <label htmlFor="package-enquiry-notes" className="block text-sm font-medium text-ink">
            Special Requests (Optional)
          </label>
          <textarea
            id="package-enquiry-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requirements or questions…"
            className="mt-2 w-full resize-y rounded-lg border border-line-2 bg-paper px-3.5 py-3 text-sm text-ink placeholder:text-ink-3/70 transition-colors duration-200 focus:border-brass-deep focus:outline-none focus:ring-2 focus:ring-brass-deep/25"
          />
        </div>

        {serverError ? (
          <p
            className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
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
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-lg border border-line-2 py-3 text-sm font-medium text-ink-2 transition-colors duration-200 hover:border-ink hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex-1 cursor-pointer rounded-lg bg-ink py-3 text-sm font-medium text-paper transition-colors duration-200 hover:bg-brass-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Submit Enquiry"}
          </button>
        </div>
      </form>
    </>
  );
}

function ModalField({
  label,
  value,
  onChange,
  error,
  required,
  type = "text",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
} & Omit<React.ComponentProps<"input">, "value" | "onChange" | "type">) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-brass-deep"> *</span> : null}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-2 w-full rounded-lg border px-3.5 py-3 text-sm text-ink placeholder:text-ink-3/70",
          "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brass-deep/25",
          error ? "border-danger" : "border-line-2 focus:border-brass-deep",
        )}
        {...rest}
      />
      {error ? <p className="mt-1.5 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
