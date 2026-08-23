/**
 * Text-block convention for the nested object-array fields on a destination
 * (places, experiences, facts, seasons) — plain-text blocks separated by a
 * `---` line, each a set of `Label: value` lines. Chosen over a dynamic
 * add/remove form UI so every admin page stays a plain server-rendered form
 * with zero client-side array state; the trade-off is the admin has to
 * follow a text format instead of clicking "add row", which the field hints
 * spell out with a worked example.
 */

export type PlaceInput = { name: string; blurb: string; highlights: string[]; image: string };
export type ExperienceInput = { title: string; description: string };
export type FactInput = { label: string; value: string };
export type SeasonInput = { window: string; note: string };
export type HotelInput = { location: string; nights: string; name: string; room: string; meal: string };
export type ItineraryDayInput = { title: string; lines: string[] };
export type MonthClimateInput = { month: string; tempRange: string; condition: string };

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function splitBlocks(text: string): string[] {
  return text
    .split(/\n\s*---\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function getField(block: string, label: string): string {
  const match = block.match(new RegExp(`^${label}:\\s*(.*)$`, "im"));
  return match ? match[1].trim() : "";
}

function getListField(block: string, label: string): string[] {
  const lines = block.split("\n");
  const items: string[] = [];
  let collecting = false;

  for (const line of lines) {
    if (new RegExp(`^${label}:`, "i").test(line.trim())) {
      collecting = true;
      continue;
    }
    if (!collecting) continue;

    const trimmed = line.trim();
    if (trimmed.startsWith("-")) {
      items.push(trimmed.slice(1).trim());
    } else if (trimmed !== "") {
      collecting = false;
    }
  }

  return items;
}

function getHighlights(block: string): string[] {
  return getListField(block, "Highlights");
}

export function parsePlaces(text: string): PlaceInput[] {
  return splitBlocks(text)
    .map((block) => ({
      name: getField(block, "Name"),
      image: getField(block, "Image"),
      blurb: getField(block, "Blurb"),
      highlights: getHighlights(block),
    }))
    .filter((place) => place.name);
}

export function stringifyPlaces(places: PlaceInput[] | null | undefined): string {
  return (places ?? [])
    .map((p) =>
      [
        `Name: ${p.name}`,
        `Image: ${p.image}`,
        `Blurb: ${p.blurb}`,
        `Highlights:`,
        ...p.highlights.map((h) => `- ${h}`),
      ].join("\n"),
    )
    .join("\n---\n");
}

export function parseExperiences(text: string): ExperienceInput[] {
  return splitBlocks(text)
    .map((block) => ({
      title: getField(block, "Title"),
      description: getField(block, "Description"),
    }))
    .filter((e) => e.title);
}

export function stringifyExperiences(
  experiences: ExperienceInput[] | null | undefined,
): string {
  return (experiences ?? [])
    .map((e) => [`Title: ${e.title}`, `Description: ${e.description}`].join("\n"))
    .join("\n---\n");
}

export function parseFacts(text: string): FactInput[] {
  return splitBlocks(text)
    .map((block) => ({
      label: getField(block, "Label"),
      value: getField(block, "Value"),
    }))
    .filter((f) => f.label);
}

export function stringifyFacts(facts: FactInput[] | null | undefined): string {
  return (facts ?? [])
    .map((f) => [`Label: ${f.label}`, `Value: ${f.value}`].join("\n"))
    .join("\n---\n");
}

export function parseSeasons(text: string): SeasonInput[] {
  return splitBlocks(text)
    .map((block) => ({
      window: getField(block, "Window"),
      note: getField(block, "Note"),
    }))
    .filter((s) => s.window);
}

export function stringifySeasons(seasons: SeasonInput[] | null | undefined): string {
  return (seasons ?? [])
    .map((s) => [`Window: ${s.window}`, `Note: ${s.note}`].join("\n"))
    .join("\n---\n");
}

export function parseHotels(text: string): HotelInput[] {
  return splitBlocks(text)
    .map((block) => ({
      location: getField(block, "Location"),
      nights: getField(block, "Nights"),
      name: getField(block, "Hotel"),
      room: getField(block, "Room"),
      meal: getField(block, "Meal"),
    }))
    .filter((h) => h.location && h.name);
}

export function stringifyHotels(hotels: HotelInput[] | null | undefined): string {
  return (hotels ?? [])
    .map((h) =>
      [
        `Location: ${h.location}`,
        `Nights: ${h.nights}`,
        `Hotel: ${h.name}`,
        `Room: ${h.room}`,
        `Meal: ${h.meal}`,
      ].join("\n"),
    )
    .join("\n---\n");
}

export function parseItinerary(text: string): ItineraryDayInput[] {
  return splitBlocks(text)
    .map((block) => ({
      title: getField(block, "Title"),
      lines: getListField(block, "Body"),
    }))
    .filter((day) => day.title);
}

export function stringifyItinerary(days: ItineraryDayInput[] | null | undefined): string {
  return (days ?? [])
    .map((d) =>
      [`Title: ${d.title}`, `Body:`, ...d.lines.map((l) => `- ${l}`)].join("\n"),
    )
    .join("\n---\n");
}

/**
 * The destination page looks these up by array index (0 = January) rather
 * than matching month names, so admin edits are always sorted into
 * calendar order here — however the blocks were typed in, or reordered by
 * a later edit, the site can't end up reading April's numbers as June's.
 */
export function parseMonthlyClimate(text: string): MonthClimateInput[] {
  return splitBlocks(text)
    .map((block) => ({
      month: getField(block, "Month"),
      tempRange: getField(block, "Temp"),
      condition: getField(block, "Condition"),
    }))
    .filter((m) => m.month && MONTH_NAMES.includes(m.month as (typeof MONTH_NAMES)[number]))
    .sort(
      (a, b) => MONTH_NAMES.indexOf(a.month as (typeof MONTH_NAMES)[number]) -
        MONTH_NAMES.indexOf(b.month as (typeof MONTH_NAMES)[number]),
    );
}

export function stringifyMonthlyClimate(
  months: MonthClimateInput[] | null | undefined,
): string {
  const bySortedMonth = MONTH_NAMES.map(
    (name) => (months ?? []).find((m) => m.month === name) ?? { month: name, tempRange: "", condition: "" },
  );
  return bySortedMonth
    .map((m) => [`Month: ${m.month}`, `Temp: ${m.tempRange}`, `Condition: ${m.condition}`].join("\n"))
    .join("\n---\n");
}
