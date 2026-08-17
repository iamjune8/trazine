"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseLines } from "@/lib/admin/textLines";

function revalidateServices() {
  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/services");
}

function readFields(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const detail = String(formData.get("detail") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const points = parseLines(String(formData.get("points") ?? ""));
  const displayOrder = Number(formData.get("display_order") ?? 0);

  if (!slug || !title || !summary || !detail || !icon) {
    throw new Error("Slug, title, summary, detail and icon are all required.");
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Slug must be lowercase letters, numbers and hyphens only.");
  }

  return {
    slug,
    title,
    summary,
    detail,
    icon,
    image: image || null,
    points,
    display_order: displayOrder,
  };
}

export async function createService(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("services").insert(readFields(formData));

  if (error) throw new Error(error.message);

  revalidateServices();
  redirect("/admin/services");
}

export async function updateService(slug: string, formData: FormData) {
  const fields = readFields(formData);
  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) throw new Error(error.message);

  revalidateServices();
  redirect("/admin/services");
}

export async function deleteService(slug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("slug", slug);

  if (error) throw new Error(error.message);

  revalidateServices();
  redirect("/admin/services");
}
