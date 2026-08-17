/**
 * Shared convention for every string[] field in the admin forms: one item
 * per line in a plain textarea. Simpler and more robust than a dynamic
 * add/remove list UI, and every form stays a plain server-rendered form —
 * no client-side array state needed anywhere except the delete-confirm button.
 */
export function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function stringifyLines(items: string[] | null | undefined): string {
  return (items ?? []).join("\n");
}
