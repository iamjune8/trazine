"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const VALID_STATUSES = new Set(["new", "contacted", "won", "lost"]);

export async function updateLead(id: string, formData: FormData) {
  const status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "");

  if (!VALID_STATUSES.has(status)) {
    throw new Error("Invalid status.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status, notes }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}
