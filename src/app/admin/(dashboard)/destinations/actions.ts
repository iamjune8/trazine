"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseLines } from "@/lib/admin/textLines";
import {
  parsePlaces,
  parseExperiences,
  parseFacts,
  parseSeasons,
  parseMonthlyClimate,
} from "@/lib/admin/textBlocks";

function revalidateDestinations(slug?: string) {
  revalidatePath("/admin/destinations");
  revalidatePath("/");
  revalidatePath("/destinations");
  if (slug) revalidatePath(`/destinations/${slug}`);
}

function readFields(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const tier = String(formData.get("tier") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const intro = String(formData.get("intro") ?? "").trim();
  const heroImage = String(formData.get("hero_image") ?? "").trim();
  const cardImage = String(formData.get("card_image") ?? "").trim();

  if (!slug || !name || !region || !tagline || !intro || !heroImage) {
    throw new Error("Slug, name, region, tagline, intro and hero image are all required.");
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Slug must be lowercase letters, numbers and hyphens only.");
  }
  if (tier !== "premium" && tier !== "easy") {
    throw new Error("Tier must be premium or easy.");
  }

  const monthlyClimate = parseMonthlyClimate(String(formData.get("monthly_climate") ?? ""));
  if (monthlyClimate.length !== 12) {
    throw new Error(
      `Monthly weather needs all 12 months filled in — got ${monthlyClimate.length}. ` +
        "The detail page reads these by calendar position, so a gap would shift every month after it.",
    );
  }

  return {
    slug,
    name,
    tier,
    region,
    tagline,
    intro,
    hero_image: heroImage,
    card_image: cardImage || null,
    body: parseLines(String(formData.get("body") ?? "")),
    gallery: parseLines(String(formData.get("gallery") ?? "")),
    ideal_for: parseLines(String(formData.get("ideal_for") ?? "")),
    places: parsePlaces(String(formData.get("places") ?? "")),
    experiences: parseExperiences(String(formData.get("experiences") ?? "")),
    facts: parseFacts(String(formData.get("facts") ?? "")),
    seasons: parseSeasons(String(formData.get("seasons") ?? "")),
    monthly_climate: monthlyClimate,
    featured: formData.get("featured") === "on",
    display_order: Number(formData.get("display_order") ?? 0),
  };
}

export async function createDestination(formData: FormData) {
  const fields = readFields(formData);
  const supabase = await createClient();
  const { error } = await supabase.from("destinations").insert(fields);

  if (error) throw new Error(error.message);

  revalidateDestinations(fields.slug);
  redirect("/admin/destinations");
}

export async function updateDestination(slug: string, formData: FormData) {
  const fields = readFields(formData);
  const supabase = await createClient();
  const { error } = await supabase
    .from("destinations")
    // Slug is locked on the edit form (see DestinationForm's lockSlug) and
    // deliberately excluded here — it's baked into URLs across the site
    // (nav, footer, sitemap), so renaming it would silently 404 every
    // existing link. The `.eq("slug", slug)` below always targets the
    // original, regardless of what the (read-only) field submitted.
    .update({
      name: fields.name,
      tier: fields.tier,
      region: fields.region,
      tagline: fields.tagline,
      intro: fields.intro,
      hero_image: fields.hero_image,
      card_image: fields.card_image,
      body: fields.body,
      gallery: fields.gallery,
      ideal_for: fields.ideal_for,
      places: fields.places,
      experiences: fields.experiences,
      facts: fields.facts,
      seasons: fields.seasons,
      monthly_climate: fields.monthly_climate,
      featured: fields.featured,
      display_order: fields.display_order,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) throw new Error(error.message);

  revalidateDestinations(slug);
  redirect("/admin/destinations");
}

export async function deleteDestination(slug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("destinations").delete().eq("slug", slug);

  if (error) throw new Error(error.message);

  revalidateDestinations(slug);
  redirect("/admin/destinations");
}
