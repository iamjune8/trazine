import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Faq } from "@/data/faqs";

export const getFaqs = cache(async (): Promise<Faq[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("question, answer")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[content] failed to load faqs", error);
    return [];
  }

  return data ?? [];
});
