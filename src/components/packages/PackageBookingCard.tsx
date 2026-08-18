"use client";

import { useId, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useEnquiry } from "@/components/enquiry/EnquiryContext";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { PackageDeparture } from "@/lib/content/packages";

function formatMoney(amount: number, currency: string) {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

function seatsLabel(departure: PackageDeparture) {
  if (departure.soldOut || departure.seatsLeft <= 0) return "Sold out";
  if (departure.seatsLeft <= 3) return `${departure.seatsLeft} seats left`;
  return `${departure.seatsLeft} seats left`;
}

/**
 * The booking rail — departure city, an admin-fed departure date (each one
 * carrying its own seat count and optional price override), an adults
 * stepper, and a live total. Everything here reads from `departures`, which
 * only exists because /admin/packages lets someone add dates without ever
 * touching code.
 */
export function PackageBookingCard({
  packageName,
  slug,
  departureCity,
  departureAirportCode,
  basePrice,
  currency,
  departures,
}: {
  packageName: string;
  slug: string;
  departureCity: string;
  departureAirportCode: string;
  basePrice: number;
  currency: string;
  departures: PackageDeparture[];
}) {
  const { open } = useEnquiry();
  const dateSelectId = useId();

  const bookable = useMemo(
    () => departures.filter((d) => !d.soldOut && d.seatsLeft > 0),
    [departures],
  );
  const [selectedId, setSelectedId] = useState<string>(bookable[0]?.id ?? "");
  const [adults, setAdults] = useState(1);

  const selected = departures.find((d) => d.id === selectedId);
  const unitPrice = selected?.priceOverride ?? basePrice;
  const total = unitPrice * adults;

  function handleEnquire() {
    trackEvent("package_enquire_click", {
      package: slug,
      departure_date: selected?.date ?? "",
      adults: String(adults),
    });
    open({ destination: packageName, source: `package-${slug}` });
  }

  return (
    <div className="border border-line-2 bg-paper-2 p-7 sm:p-8">
      <p className="eyebrow">Choose your departure</p>

      <div className="mt-6 space-y-6">
        <div>
          <span className="block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-3">
            Departure city
          </span>
          <div className="mt-1.5 flex min-h-[52px] items-center justify-between border-b border-line-2 text-ink">
            <span className="flex items-center gap-2.5">
              <Icon name="plane" size={16} className="text-brass-deep" />
              {departureCity} ({departureAirportCode})
            </span>
            <span className="text-xs uppercase tracking-[0.1em] text-ink-3">Included</span>
          </div>
        </div>

        <div>
          <label
            htmlFor={dateSelectId}
            className="block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-3"
          >
            Departure date
          </label>
          {departures.length === 0 ? (
            <p className="mt-2 text-sm text-ink-3">
              No departure dates published yet — enquire and we&rsquo;ll confirm one.
            </p>
          ) : (
            <div className="relative mt-1.5">
              <select
                id={dateSelectId}
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className={cn(
                  "min-h-[52px] w-full cursor-pointer appearance-none border-b border-line-2 bg-transparent pr-8",
                  "font-sans text-base text-ink transition-colors duration-200",
                  "hover:border-ink-3 focus:border-brass-deep focus:outline-none",
                )}
              >
                {departures.map((d) => (
                  <option key={d.id} value={d.id} disabled={d.soldOut || d.seatsLeft <= 0}>
                    {formatDate(d.date)} — {seatsLabel(d)}
                  </option>
                ))}
              </select>
              <Icon
                name="calendar"
                size={17}
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-ink-3"
              />
            </div>
          )}
          {selected ? (
            <p
              className={cn(
                "mt-2 text-sm",
                selected.seatsLeft <= 3 ? "text-danger" : "text-success",
              )}
            >
              {seatsLabel(selected)}
            </p>
          ) : null}
        </div>

        <div>
          <span className="block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-3">
            Adults
          </span>
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setAdults((n) => Math.max(1, n - 1))}
              disabled={adults <= 1}
              aria-label="Fewer adults"
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border border-line-2 text-ink transition-colors duration-200 hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="minus" size={16} />
            </button>
            <span
              className="min-w-[2ch] text-center font-display text-xl text-ink"
              aria-live="polite"
            >
              {adults}
            </span>
            <button
              type="button"
              onClick={() => setAdults((n) => Math.min(9, n + 1))}
              disabled={adults >= 9}
              aria-label="More adults"
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border border-line-2 text-ink transition-colors duration-200 hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4 border-t border-line-2 pt-6">
        <span className="text-sm text-ink-3">
          Total ({adults} {adults === 1 ? "adult" : "adults"})
        </span>
        <span className="font-display text-2xl text-ink">
          {formatMoney(total, currency)}
        </span>
      </div>

      <Button
        type="button"
        size="lg"
        onClick={handleEnquire}
        withArrow
        className="mt-6 w-full"
      >
        Enquire now
      </Button>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink-3">
        No payment here — a consultant confirms this exact date and seat
        count before anything is booked.
      </p>
    </div>
  );
}
