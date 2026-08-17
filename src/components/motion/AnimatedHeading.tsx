import { cn } from "@/lib/utils";

/**
 * Headline that rises word by word.
 *
 * Pure CSS and pure server component — no "use client", no hydration. The
 * headline is the LCP element on every page, so it must be painted and legible
 * before any JavaScript arrives (and even if none ever does). See the
 * `animate-word` notes in globals.css.
 *
 * Accessibility: splitting text into spans makes screen readers announce it
 * word-by-word with odd pauses, so the visible spans are `aria-hidden` and the
 * real string is exposed once, visually hidden. Assistive tech reads one clean
 * sentence; sighted users get the motion.
 *
 * Reduced motion is handled globally — the media query in globals.css collapses
 * `animation-duration` to ~0, so every word lands instantly at its end state.
 */

const WORD_STAGGER = 0.07;

/**
 * The per-word rise-in markup, exported so a caller that needs to continue
 * the same stagger rhythm into a *different* element (e.g. Hero splicing in
 * a live-updating clause after a static lead-in — see RotatingClause) can
 * reuse the exact animation without duplicating the CSS class/timing logic.
 */
export function renderRisingWords(
  words: string[],
  delay: number,
  accentWords: number[] = [],
  indexOffset = 0,
) {
  const accent = new Set(accentWords);

  return words.map((word, i) => (
    <span
      key={`${word}-${indexOffset + i}`}
      className="inline-block overflow-hidden align-bottom pb-[0.08em]"
    >
      <span
        className={cn(
          "animate-word inline-block",
          accent.has(indexOffset + i) && "italic text-brass-light",
        )}
        style={{ animationDelay: `${delay + i * WORD_STAGGER}s` }}
      >
        {word}
      </span>
      {i < words.length - 1 ? <span>&nbsp;</span> : null}
    </span>
  ));
}

type Props = {
  text: string;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  as?: "h1" | "h2" | "p" | "span";
  /** Words at these indexes render in brass italic. */
  accentWords?: number[];
};

export function AnimatedHeading({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
  accentWords = [],
}: Props) {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{renderRisingWords(words, delay, accentWords)}</span>
    </Tag>
  );
}

export { WORD_STAGGER };
