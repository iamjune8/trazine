import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export type Promotion = {
  active: boolean;
  imageUrl: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
};

const EMPTY: Promotion = {
  active: false,
  imageUrl: "",
  heading: "",
  subheading: "",
  ctaLabel: "Enquire now",
};

/**
 * Single-row "settings" table rather than a list — there is only ever one
 * promotion live at a time. `active` is the on/off switch an admin flips
 * from /admin/promotion; the popup itself renders nothing when it's false.
 */
export const getPromotion = cache(async (): Promise<Promotion> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("promotion")
    .select("active, image_url, heading, subheading, cta_label")
    .eq("id", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[content] failed to load promotion", error);
    return EMPTY;
  }

  return {
    active: data.active,
    imageUrl: data.image_url,
    heading: data.heading,
    subheading: data.subheading,
    ctaLabel: data.cta_label,
  };
});
