import type { DestinationSeo } from "./types";
import { europe } from "./europe";
import { vietnam } from "./vietnam";
import { dubai } from "./dubai";
import { thailand } from "./thailand";
import { singapore } from "./singapore";

export type { DestinationSeo, SeoSection, SeoItem, SeoLink } from "./types";

const seoBySlug: Readonly<Record<string, DestinationSeo>> = {
  europe,
  vietnam,
  dubai,
  thailand,
  singapore,
};

export function getDestinationSeo(slug: string): DestinationSeo | undefined {
  return seoBySlug[slug];
}
