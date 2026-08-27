"use client";

import { useState } from "react";
import { AdminTextField, AdminTextAreaField } from "@/components/admin/ui/AdminField";
import { AdminImageField } from "@/components/admin/ui/AdminImageField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Icon } from "@/components/ui/Icon";
import { stringifyPlaces, type PlaceInput } from "@/lib/admin/textBlocks";

type PlaceDraft = { name: string; image: string; blurb: string; highlightsText: string };

function toDraft(p: PlaceInput): PlaceDraft {
  return { name: p.name, image: p.image, blurb: p.blurb, highlightsText: p.highlights.join("\n") };
}

function toPlaceInput(d: PlaceDraft): PlaceInput {
  return {
    name: d.name,
    image: d.image,
    blurb: d.blurb,
    highlights: d.highlightsText
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean),
  };
}

const BLANK_DRAFT: PlaceDraft = { name: "", image: "", blurb: "", highlightsText: "" };

/**
 * Structured editor for the "places within this circuit" list, replacing
 * the old single freeform textarea (Name/Image/Blurb/Highlights blocks
 * separated by "---") with one card per place and a live image preview —
 * same reasoning as AdminImageField on the hero/card/gallery fields: a
 * mistyped catalogue key in that textarea's "Image:" line produced a blank
 * place card with no feedback until the live site.
 *
 * Submits the same text-block format the server action already parses via
 * parsePlaces() (src/lib/admin/textBlocks.ts) through a hidden field, so
 * nothing server-side needs to change.
 */
export function PlacesEditor({ defaultValue }: { defaultValue?: PlaceInput[] }) {
  const [places, setPlaces] = useState<PlaceDraft[]>(() =>
    defaultValue && defaultValue.length > 0 ? defaultValue.map(toDraft) : [BLANK_DRAFT],
  );

  const serialized = stringifyPlaces(places.map(toPlaceInput));

  function update(index: number, patch: Partial<PlaceDraft>) {
    setPlaces((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  function addPlace() {
    setPlaces((prev) => [...prev, { ...BLANK_DRAFT }]);
  }

  function removePlace(index: number) {
    setPlaces((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-5">
      <input type="hidden" name="places" value={serialized} readOnly />

      {places.map((place, i) => (
        <div key={i} className="space-y-4 rounded-xl border border-admin-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-admin-text-3">
              Place {i + 1}
            </span>
            {places.length > 1 && (
              <button
                type="button"
                onClick={() => removePlace(i)}
                className="flex items-center gap-1 text-xs text-admin-danger transition-opacity hover:opacity-75"
              >
                <Icon name="close" size={13} />
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminTextField
              label="Name"
              name={`place_${i}_name`}
              value={place.name}
              onChange={(e) => update(i, { name: e.target.value })}
              hint='e.g. "Paris, France"'
            />
            <AdminImageField
              label="Image"
              value={place.image}
              onChange={(v) => update(i, { image: v })}
              hint="Catalogue key, Unsplash photo ID, or full URL."
            />
          </div>

          <AdminTextAreaField
            label="Blurb"
            name={`place_${i}_blurb`}
            rows={2}
            value={place.blurb}
            onChange={(e) => update(i, { blurb: e.target.value })}
            hint="One sentence."
          />

          <AdminTextAreaField
            label="Highlights"
            name={`place_${i}_highlights`}
            rows={4}
            value={place.highlightsText}
            onChange={(e) => update(i, { highlightsText: e.target.value })}
            hint="One highlight per line."
          />
        </div>
      ))}

      <AdminButton type="button" variant="outline" size="sm" icon="plus" onClick={addPlace}>
        Add place
      </AdminButton>
    </div>
  );
}
