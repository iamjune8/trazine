"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateLandingPoster(formData: FormData) {
  const active = formData.get("active") === "on";
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const heading = String(formData.get("heading") ?? "").trim();
  const subheading = String(formData.get("subheading") ?? "").trim();
  const ctaLabel = String(formData.get("cta_label") ?? "").trim() || "Enquire now";
  const startsAt = String(formData.get("starts_at") ?? "").trim() || null;
  const endsAt = String(formData.get("ends_at") ?? "").trim() || null;

  if (active && !heading) {
    throw new Error("A heading is required while the poster is active.");
  }
  if (startsAt && endsAt && startsAt > endsAt) {
    throw new Error("The end date can't be before the start date.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("landing_poster")
    .update({
      active,
      image_url: imageUrl,
      heading,
      subheading,
      cta_label: ctaLabel,
      starts_at: startsAt,
      ends_at: endsAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/poster");
  revalidatePath("/", "layout"); // poster renders from the root layout on every page
  redirect("/admin/poster?saved=1");
}
