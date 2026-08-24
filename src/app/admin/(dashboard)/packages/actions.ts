"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseLines } from "@/lib/admin/textLines";
import { parseHotels, parseItinerary } from "@/lib/admin/textBlocks";

/**
 * Skip on-demand revalidation entirely on Hostinger's shared hosting.
 * Even 1-2 revalidatePath() calls can exceed Cloudflare's timeout during
 * form submission. Instead, rely on the hourly revalidate = 3600 config
 * set on each public page — pages refresh automatically within 60 minutes,
 * which is acceptable for an admin-controlled travel site.
 *
 * This makes server actions return instantly (under 200ms) instead of
 * timing out at 100 seconds.
 */
function revalidatePackages(slug?: string) {
  // No-op: revalidation happens via hourly page-level config instead
}

function readFields(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const heroImage = String(formData.get("hero_image") ?? "").trim();
  const basePrice = Number(formData.get("base_price") ?? 0);

  if (!slug || !name) {
    throw new Error("Slug and name are required.");
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Slug must be lowercase letters, numbers and hyphens only.");
  }
  if (!Number.isFinite(basePrice) || basePrice < 0) {
    throw new Error("Base price must be a positive number.");
  }

  return {
    slug,
    name,
    departure_code: String(formData.get("departure_code") ?? "").trim(),
    route_label: String(formData.get("route_label") ?? "").trim(),
    nights_summary: String(formData.get("nights_summary") ?? "").trim(),
    hero_image: heroImage,
    base_price: basePrice,
    currency: String(formData.get("currency") ?? "INR").trim() || "INR",
    departure_city: String(formData.get("departure_city") ?? "").trim(),
    departure_airport_code: String(formData.get("departure_airport_code") ?? "").trim(),
    flight_carrier: String(formData.get("flight_carrier") ?? "").trim(),
    onward_flight_number: String(formData.get("onward_flight_number") ?? "").trim(),
    onward_route: String(formData.get("onward_route") ?? "").trim(),
    onward_departure_time: String(formData.get("onward_departure_time") ?? "").trim(),
    return_flight_number: String(formData.get("return_flight_number") ?? "").trim(),
    return_route: String(formData.get("return_route") ?? "").trim(),
    return_departure_time: String(formData.get("return_departure_time") ?? "").trim(),
    hotels: parseHotels(String(formData.get("hotels") ?? "")),
    sightseeing: parseLines(String(formData.get("sightseeing") ?? "")),
    itinerary: parseItinerary(String(formData.get("itinerary") ?? "")),
    inclusions: parseLines(String(formData.get("inclusions") ?? "")),
    exclusions: parseLines(String(formData.get("exclusions") ?? "")),
    payment_terms: parseLines(String(formData.get("payment_terms") ?? "")),
    cancellation_terms: parseLines(String(formData.get("cancellation_terms") ?? "")),
    active: formData.get("active") === "on",
    display_order: Number(formData.get("display_order") ?? 0),
  };
}

export async function createPackage(formData: FormData) {
  const fields = readFields(formData);
  const supabase = await createClient();
  const { error } = await supabase.from("packages").insert(fields);

  if (error) throw new Error(error.message);

  revalidatePackages(fields.slug);
  redirect(`/admin/packages/${fields.slug}`);
}

export async function updatePackage(slug: string, formData: FormData) {
  const fields = readFields(formData);
  const supabase = await createClient();
  const { error } = await supabase
    .from("packages")
    .update({
      name: fields.name,
      departure_code: fields.departure_code,
      route_label: fields.route_label,
      nights_summary: fields.nights_summary,
      hero_image: fields.hero_image,
      base_price: fields.base_price,
      currency: fields.currency,
      departure_city: fields.departure_city,
      departure_airport_code: fields.departure_airport_code,
      flight_carrier: fields.flight_carrier,
      onward_flight_number: fields.onward_flight_number,
      onward_route: fields.onward_route,
      onward_departure_time: fields.onward_departure_time,
      return_flight_number: fields.return_flight_number,
      return_route: fields.return_route,
      return_departure_time: fields.return_departure_time,
      hotels: fields.hotels,
      sightseeing: fields.sightseeing,
      itinerary: fields.itinerary,
      inclusions: fields.inclusions,
      exclusions: fields.exclusions,
      payment_terms: fields.payment_terms,
      cancellation_terms: fields.cancellation_terms,
      active: fields.active,
      display_order: fields.display_order,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) throw new Error(error.message);

  revalidatePackages(slug);
  redirect(`/admin/packages/${slug}?saved=1`);
}

export async function deletePackage(slug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("packages").delete().eq("slug", slug);

  if (error) throw new Error(error.message);

  revalidatePackages(slug);
  redirect("/admin/packages");
}

export async function addDeparture(slug: string, formData: FormData) {
  const departureDate = String(formData.get("departure_date") ?? "").trim();
  const seatsLeft = Number(formData.get("seats_left") ?? 0);
  const priceOverrideRaw = String(formData.get("price_override") ?? "").trim();

  if (!departureDate) throw new Error("A departure date is required.");
  if (!Number.isFinite(seatsLeft) || seatsLeft < 0) {
    throw new Error("Seats left must be zero or a positive number.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("package_departures").insert({
    package_slug: slug,
    departure_date: departureDate,
    seats_left: seatsLeft,
    price_override: priceOverrideRaw ? Number(priceOverrideRaw) : null,
  });

  if (error) throw new Error(error.message);

  revalidatePackages(slug);
  redirect(`/admin/packages/${slug}`);
}

export async function updateDeparture(id: string, slug: string, formData: FormData) {
  const seatsLeft = Number(formData.get("seats_left") ?? 0);
  const priceOverrideRaw = String(formData.get("price_override") ?? "").trim();
  const soldOut = formData.get("sold_out") === "on";

  if (!Number.isFinite(seatsLeft) || seatsLeft < 0) {
    throw new Error("Seats left must be zero or a positive number.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("package_departures")
    .update({
      seats_left: seatsLeft,
      price_override: priceOverrideRaw ? Number(priceOverrideRaw) : null,
      sold_out: soldOut,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePackages(slug);
  redirect(`/admin/packages/${slug}`);
}

export async function deleteDeparture(id: string, slug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("package_departures").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePackages(slug);
  redirect(`/admin/packages/${slug}`);
}

/**
 * Sets the same price override on every departure date for this package in
 * one go — the alternative is opening and saving each row by hand, which
 * doesn't scale once a package has more than a couple of dates.
 */
export async function copyPriceToAllDepartures(slug: string, formData: FormData) {
  const priceRaw = String(formData.get("bulk_price_override") ?? "").trim();
  const price = priceRaw ? Number(priceRaw) : null;

  if (priceRaw && (!Number.isFinite(price) || (price ?? 0) < 0)) {
    throw new Error("Price must be zero or a positive number.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("package_departures")
    .update({ price_override: price, updated_at: new Date().toISOString() })
    .eq("package_slug", slug);

  if (error) throw new Error(error.message);

  revalidatePackages(slug);
  redirect(`/admin/packages/${slug}`);
}
