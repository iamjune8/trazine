"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function revalidateTestimonials() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/"); // homepage testimonials section
  revalidatePath("/about"); // and About
}

function readFields(formData: FormData) {
  const quote = String(formData.get("quote") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const trip = String(formData.get("trip") ?? "").trim();
  const displayOrder = Number(formData.get("display_order") ?? 0);

  if (!quote || !name || !role || !trip) {
    throw new Error("Quote, name, role and trip are all required.");
  }

  return { quote, name, role, trip, display_order: displayOrder };
}

export async function createTestimonial(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert(readFields(formData));

  if (error) throw new Error(error.message);

  revalidateTestimonials();
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ ...readFields(formData), updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidateTestimonials();
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidateTestimonials();
  redirect("/admin/testimonials");
}
