import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export type LandingPoster = {
  active: boolean;
  imageUrl: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
};

const EMPTY: LandingPoster = {
  active: false,
  imageUrl: "",
  heading: "",
  subheading: "",
  ctaLabel: "Enquire now",
};

/**
 * A second, separate singleton from `promotion` (the always-on corner
 * banner) — this one is meant to run out. `starts_at`/`ends_at` are
 * evaluated here, server-side, so a campaign quietly turns itself off
 * on the end date even if nobody remembers to flip the admin toggle.
 */
export const getLandingPoster = cache(async (): Promise<LandingPoster> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("landing_poster")
    .select("active, image_url, heading, subheading, cta_label, starts_at, ends_at")
    .eq("id", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[content] failed to load landing poster", error);
    return EMPTY;
  }

  const today = new Date().toISOString().slice(0, 10);
  const withinWindow =
    (!data.starts_at || data.starts_at <= today) && (!data.ends_at || data.ends_at >= today);

  return {
    active: data.active && withinWindow,
    imageUrl: data.image_url,
    heading: data.heading,
    subheading: data.subheading,
    ctaLabel: data.cta_label,
  };
});
