"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updatePromotion(formData: FormData) {
  const active = formData.get("active") === "on";
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const heading = String(formData.get("heading") ?? "").trim();
  const subheading = String(formData.get("subheading") ?? "").trim();
  const ctaLabel = String(formData.get("cta_label") ?? "").trim() || "Enquire now";

  if (active && !heading) {
    throw new Error("A heading is required while the promotion is active.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("promotion")
    .update({
      active,
      image_url: imageUrl,
      heading,
      subheading,
      cta_label: ctaLabel,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/promotion");
  revalidatePath("/", "layout"); // popup renders from the root layout on every page
  redirect("/admin/promotion?saved=1");
}
