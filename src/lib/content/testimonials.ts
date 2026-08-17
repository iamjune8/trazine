import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Testimonial } from "@/data/testimonials";

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("quote, name, role, trip")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[content] failed to load testimonials", error);
    return [];
  }

  return data ?? [];
});
