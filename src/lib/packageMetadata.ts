import type { TourPackage } from "@/lib/content/packages";
import { truncateAtWord } from "@/lib/seo";

/** The site title template appends " | Travel Magazine" (18 characters). */
const MAX_TITLE = 47;
const MAX_DESCRIPTION = 160;

/** "7N Japan" -> "7". Undefined when the summary doesn't start with a night count. */
function nightCount(nightsSummary: string): string | undefined {
  return /^0*(\d+)\s*N\b/i.exec(nightsSummary.trim())?.[1];
}

function titleCase(text: string): string {
  return text.toLowerCase().replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

/** "3N OSAKA | 01N HAKONE | 3N TOKYO" -> "Osaka, Hakone and Tokyo". */
export function routeCities(routeLabel: string): string | undefined {
  const cities = routeLabel
    .split("|")
    .map((leg) => titleCase(leg.replace(/^\s*\d+\s*N\s*/i, "").trim()))
    .filter(Boolean);

  if (cities.length === 0) return undefined;
  if (cities.length === 1) return cities[0];
  return `${cities.slice(0, -1).join(", ")} and ${cities[cities.length - 1]}`;
}

/** Longest form of the title that still fits a search result. */
export function packageTitle(pkg: TourPackage): string {
  const nights = nightCount(pkg.nightsSummary);
  const candidates = [
    nights ? `${pkg.name} ${nights}-Night Package` : undefined,
    `${pkg.name} Package`,
    pkg.name,
  ].filter((candidate): candidate is string => Boolean(candidate));

  return candidates.find((candidate) => candidate.length <= MAX_TITLE) ?? pkg.name;
}

/**
 * Built from the package's own data. Flights are only claimed when the
 * package actually includes them.
 */
export function packageDescription(pkg: TourPackage, priceClause = ""): string {
  const nights = nightCount(pkg.nightsSummary);
  const cities = routeCities(pkg.routeLabel);
  const shape =
    nights || cities
      ? [nights ? `${nights}-night` : undefined, cities, "package"].filter(Boolean).join(" ")
      : `${pkg.nightsSummary} package`;
  const includes = pkg.flightsIncluded
    ? "Flights, stay and sightseeing included"
    : "Stay and sightseeing included, flights not included";

  return truncateAtWord(
    `${pkg.name}: ${shape} from ${pkg.departureCity}. ${includes}${priceClause}.`,
    MAX_DESCRIPTION,
  );
}
