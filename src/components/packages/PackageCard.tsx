import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { TourPackage } from "@/lib/content/packages";

function formatMoney(amount: number, currency: string) {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PackageCard({ pkg }: { pkg: TourPackage }) {
  const bookableDates = pkg.departures.filter((d) => !d.soldOut && d.seatsLeft > 0).length;

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group block overflow-hidden border border-line-2 bg-paper transition-colors duration-200 hover:border-ink"
    >
      {pkg.heroImage ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-pasted URL from any host */}
          <img
            src={pkg.heroImage}
            alt={pkg.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        </div>
      ) : null}

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-xl text-ink">{pkg.name}</h3>
          {pkg.departureCode ? (
            <span className="border border-line-2 bg-paper-2 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-ink-2">
              {pkg.departureCode}
            </span>
          ) : null}
        </div>
        {pkg.routeLabel ? <p className="mt-1.5 text-sm text-ink-2">{pkg.routeLabel}</p> : null}

        <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-ink-3">Starting at</p>
            <p className="font-display text-lg text-brass-deep">
              {formatMoney(pkg.basePrice, pkg.currency)}
            </p>
          </div>
          {bookableDates > 0 ? (
            <p className="flex items-center gap-1.5 text-xs text-ink-3">
              <Icon name="calendar" size={13} />
              {bookableDates} date{bookableDates === 1 ? "" : "s"} open
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
