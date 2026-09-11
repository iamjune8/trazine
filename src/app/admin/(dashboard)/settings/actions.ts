"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Every public page reads this row (phone, email, address, hours) in its
 * header, footer, or own contact section — so a save here has to invalidate
 * the whole (site) route group at once rather than a handful of named
 * paths, the way a single destination or package edit does.
 */
function revalidateSiteSettings() {
  revalidatePath("/", "layout");
}

function readFields(formData: FormData) {
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const addressLine1 = String(formData.get("address_line1") ?? "").trim();
  const addressLine2 = String(formData.get("address_line2") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const postalCode = String(formData.get("postal_code") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const hours = String(formData.get("hours") ?? "").trim();

  if (!phone || !email || !addressLine1 || !city || !state || !postalCode || !country) {
    throw new Error(
      "Phone, email, address line 1, city, state, postal code and country are all required.",
    );
  }
  if (!/^\+?[\d\s]{7,}$/.test(phone)) {
    throw new Error(
      "Phone should be digits (with spaces) and an optional leading +, e.g. +91 81085 31332.",
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  return {
    phone,
    email,
    address_line1: addressLine1,
    address_line2: addressLine2,
    city,
    state,
    postal_code: postalCode,
    country,
    hours,
  };
}

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update(readFields(formData))
    .eq("id", "default");

  if (error) throw new Error(error.message);

  revalidateSiteSettings();
  redirect("/admin/settings?saved=1");
}
