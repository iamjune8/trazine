"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { seasonalPlanner } from "@/data/seasonalPlanner";

/**
 * Month-by-month strip of picture cards. It drifts on its own, and visitors can
 * step forward or back with the arrows or pause it. The cards are rendered
 * twice so the loop joins seamlessly. Motion stops for anyone with reduced
 * motion turned on, and the arrows still work for them.
 */
const cards = seasonalPlanner.flatMap((entry) =>
  entry.picks.map((pick) => ({ ...pick, month: entry.month })),
);

/** Pixels per frame at 60fps: about 40px a second, a calm drift. */
const DRIFT_PER_FRAME = 0.67;

type Card = (typeof cards)[number];

function SeasonCard({ card, hidden }: { card: Card; hidden?: boolean }) {
  return (
    <li className="w-[78vw] shrink-0 sm:w-[340px]" aria-hidden={hidden || undefined}>
      <Link
        href={`/destinations/${card.slug}`}
        tabIndex={hidden ? -1 : undefined}
        className="group block"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.image}
            alt={hidden ? "" : card.imageAlt}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 bg-paper px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-ink">
            {card.month}
          </span>
        </div>
        <h3 className="font-display mt-5 text-2xl text-ink">{card.name}</h3>
        <p className="mt-2 text-ink-2">{card.why}</p>
      </Link>
    </li>
  );
}

const controlClass =
  "flex h-11 w-11 items-center justify-center border border-line-2 text-ink transition-colors duration-200 hover:border-brass hover:text-brass-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass";

export function SeasonalPlanner() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const position = useRef(0);
  /** Where a button press is easing towards, or null when none is pending. */
  const goal = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // One animation loop owns the scroll position. It eases towards a button
  // press when one is pending, and otherwise drifts unless paused, hovered or
  // reduced motion is on. The position is kept as a float so slow drift is
  // not rounded away. When the first copy has scrolled past, the loop jumps
  // back by exactly one copy so the strip never shows a gap.
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const wrapBy = (half: number) => {
      if (position.current >= half) {
        position.current -= half;
        if (goal.current !== null) goal.current -= half;
      }
      if (position.current < 0) {
        position.current += half;
        if (goal.current !== null) goal.current += half;
      }
    };

    let frame = 0;
    const step = () => {
      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (goal.current !== null) {
          const gap = goal.current - position.current;
          position.current += gap * 0.12;
          if (Math.abs(gap) < 0.5) {
            position.current = goal.current;
            goal.current = null;
          }
        } else if (!paused && !hovered && !reducedMotion) {
          position.current += DRIFT_PER_FRAME;
        }
        wrapBy(half);
        viewport.scrollLeft = position.current;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [paused, hovered, reducedMotion]);

  /** One press moves one card; repeated presses stack up before easing. */
  function move(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector("li");
    const stepSize = firstCard ? firstCard.getBoundingClientRect().width + 24 : 340;
    goal.current = (goal.current ?? position.current) + direction * stepSize;
  }

  return (
    <Section tone="paper-2">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Planning ahead</p>
            <h2 className="font-display mt-4 text-[length:var(--step-h2)]">
              Where to go, month by month
            </h2>
            <p className="mt-5 text-lg text-ink-2">
              Not sure where to go yet? Start with the season. These picks follow
              typical weather for the coming months. Your consultant will check
              current conditions for your dates.
            </p>
          </Reveal>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-pressed={paused}
              aria-label={paused ? "Resume scrolling" : "Pause scrolling"}
              className={controlClass}
            >
              <Icon name={paused ? "play" : "pause"} size={18} />
            </button>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Show previous destinations"
              className={controlClass}
            >
              <Icon name="chevron-left" size={20} />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Show next destinations"
              className={controlClass}
            >
              <Icon name="chevron-right" size={20} />
            </button>
          </div>
        </div>
      </Container>

      <div
        ref={viewportRef}
        role="region"
        aria-label="Destinations by month"
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="mt-14 overflow-x-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
      >
        <ul ref={trackRef} className="flex w-max gap-6 px-5 sm:px-8">
          {cards.map((card) => (
            <SeasonCard key={`a-${card.month}-${card.slug}`} card={card} />
          ))}
          {cards.map((card) => (
            <SeasonCard key={`b-${card.month}-${card.slug}`} card={card} hidden />
          ))}
        </ul>
      </div>

      <Container>
        <p className="mt-10 text-sm text-ink-3">
          Weather varies from year to year.{" "}
          <Link href="/contact" className="link-underline text-brass-deep">
            Ask us which month suits your dates
          </Link>
          .
        </p>
      </Container>
    </Section>
  );
}
