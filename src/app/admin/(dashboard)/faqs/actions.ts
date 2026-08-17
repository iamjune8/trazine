"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function revalidateFaqs() {
  revalidatePath("/admin/faqs");
  revalidatePath("/"); // FAQ section appears on the homepage
  revalidatePath("/services"); // and on /services
  revalidatePath("/contact"); // and on /contact
}

export async function createFaq(formData: FormData) {
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const displayOrder = Number(formData.get("display_order") ?? 0);

  if (!question || !answer) throw new Error("Question and answer are both required.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("faqs")
    .insert({ question, answer, display_order: displayOrder });

  if (error) throw new Error(error.message);

  revalidateFaqs();
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, formData: FormData) {
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const displayOrder = Number(formData.get("display_order") ?? 0);

  if (!question || !answer) throw new Error("Question and answer are both required.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("faqs")
    .update({ question, answer, display_order: displayOrder, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidateFaqs();
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidateFaqs();
  redirect("/admin/faqs");
}
