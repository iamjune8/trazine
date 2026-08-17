import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Service } from "@/data/services";

type ServiceRow = {
  slug: string;
  title: string;
  summary: string;
  detail: string;
  points: string[];
  icon: string;
  image: string | null;
};

function mapRow(row: ServiceRow): Service {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    detail: row.detail,
    points: row.points,
    icon: row.icon as Service["icon"],
    image: row.image,
  };
}

export const getServices = cache(async (): Promise<Service[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[content] failed to load services", error);
    return [];
  }

  return (data ?? []).map(mapRow);
});
