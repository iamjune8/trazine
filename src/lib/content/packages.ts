import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Live content layer for bookable tour packages — a separate, admin-managed
 * collection from `destinations`. A destination is an editorial page about a
 * place; a package is a fixed, priced itinerary (flights, hotels, dates,
 * seats) someone can actually book against.
 */

export type PackageHotel = {
  location: string;
  nights: string;
  name: string;
  room: string;
  meal: string;
};

export type PackageItineraryDay = {
  title: string;
  lines: string[];
};

export type PackageDeparture = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  seatsLeft: number;
  priceOverride: number | null;
  soldOut: boolean;
};

export type TourPackage = {
  slug: string;
  name: string;
  departureCode: string;
  routeLabel: string;
  nightsSummary: string;
  heroImage: string;
  basePrice: number;
  currency: string;
  departureCity: string;
  departureAirportCode: string;
  flightsIncluded: boolean;
  flightCarrier: string;
  onwardFlightNumber: string;
  onwardRoute: string;
  onwardDepartureTime: string;
  returnFlightNumber: string;
  returnRoute: string;
  returnDepartureTime: string;
  hotels: PackageHotel[];
  sightseeing: string[];
  itinerary: PackageItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  paymentTerms: string[];
  cancellationTerms: string[];
  active: boolean;
  displayOrder: number;
  departures: PackageDeparture[];
};

type PackageRow = {
  slug: string;
  name: string;
  departure_code: string;
  route_label: string;
  nights_summary: string;
  hero_image: string;
  base_price: number;
  currency: string;
  departure_city: string;
  departure_airport_code: string;
  flights_included: boolean;
  flight_carrier: string;
  onward_flight_number: string;
  onward_route: string;
  onward_departure_time: string;
  return_flight_number: string;
  return_route: string;
  return_departure_time: string;
  hotels: unknown;
  sightseeing: unknown;
  itinerary: unknown;
  inclusions: string[];
  exclusions: string[];
  payment_terms: string[];
  cancellation_terms: string[];
  active: boolean;
  display_order: number;
};

type DepartureRow = {
  id: string;
  package_slug: string;
  departure_date: string;
  seats_left: number;
  price_override: number | null;
  sold_out: boolean;
};

function mapDeparture(row: DepartureRow): PackageDeparture {
  return {
    id: row.id,
    date: row.departure_date,
    seatsLeft: row.seats_left,
    priceOverride: row.price_override,
    soldOut: row.sold_out,
  };
}

function mapRow(row: PackageRow, departures: DepartureRow[]): TourPackage {
  return {
    slug: row.slug,
    name: row.name,
    departureCode: row.departure_code,
    routeLabel: row.route_label,
    nightsSummary: row.nights_summary,
    heroImage: row.hero_image,
    basePrice: row.base_price,
    currency: row.currency,
    departureCity: row.departure_city,
    departureAirportCode: row.departure_airport_code,
    flightsIncluded: row.flights_included,
    flightCarrier: row.flight_carrier,
    onwardFlightNumber: row.onward_flight_number,
    onwardRoute: row.onward_route,
    onwardDepartureTime: row.onward_departure_time,
    returnFlightNumber: row.return_flight_number,
    returnRoute: row.return_route,
    returnDepartureTime: row.return_departure_time,
    hotels: (row.hotels as PackageHotel[]) ?? [],
    sightseeing: (row.sightseeing as string[]) ?? [],
    itinerary: (row.itinerary as PackageItineraryDay[]) ?? [],
    inclusions: row.inclusions ?? [],
    exclusions: row.exclusions ?? [],
    paymentTerms: row.payment_terms ?? [],
    cancellationTerms: row.cancellation_terms ?? [],
    active: row.active,
    displayOrder: row.display_order,
    departures: departures
      .filter((d) => d.package_slug === row.slug)
      .map(mapDeparture)
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export const getPackages = cache(async (): Promise<TourPackage[]> => {
  const supabase = createPublicClient();
  const [{ data: packages, error: packagesError }, { data: departures, error: departuresError }] =
    await Promise.all([
      supabase.from("packages").select("*").order("display_order", { ascending: true }),
      supabase
        .from("package_departures")
        .select("*")
        .order("departure_date", { ascending: true }),
    ]);

  if (packagesError) {
    console.error("[content] failed to load packages", packagesError);
    return [];
  }
  if (departuresError) {
    console.error("[content] failed to load package departures", departuresError);
  }

  return (packages ?? []).map((row) => mapRow(row, departures ?? []));
});

export const getPackage = cache(async (slug: string): Promise<TourPackage | undefined> => {
  const supabase = createPublicClient();
  const [{ data: pkg }, { data: departures }] = await Promise.all([
    supabase.from("packages").select("*").eq("slug", slug).maybeSingle(),
    supabase
      .from("package_departures")
      .select("*")
      .eq("package_slug", slug)
      .order("departure_date", { ascending: true }),
  ]);

  if (!pkg) return undefined;
  return mapRow(pkg, departures ?? []);
});

export async function getActivePackages(): Promise<TourPackage[]> {
  return (await getPackages()).filter((p) => p.active);
}
