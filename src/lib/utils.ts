/** Tiny class-name joiner. Falsy values are dropped. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Serialises a value for a `<script type="application/ld+json">` tag via
 * `dangerouslySetInnerHTML`. Plain `JSON.stringify` doesn't escape the `<`
 * character, so a literal closing-script-tag substring inside any string
 * value (an admin-edited FAQ answer, a destination place name, ...) would
 * end the tag early and let whatever follows run as HTML/script. Escaping
 * every `<` to its unicode form neutralises that without changing the
 * parsed JSON value.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
