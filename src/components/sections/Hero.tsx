import Link from "next/link";
import { HeroSlideshow } from "@/components/sections/HeroSlideshow";
import { renderRisingWords, WORD_STAGGER } from "@/components/motion/AnimatedHeading";
import { RotatingClause } from "@/components/motion/RotatingClause";
import { EnquireButton } from "@/components/enquiry/EnquireButton";
import { ButtonLink } from "@/components/ui/Button";
import { heroSlides } from "@/data/heroSlides";
import { getFeaturedDestinations } from "@/lib/content/destinations";

/**
 * The headline reads as one sentence, set across three deliberate lines
 * rather than left to wrap wherever the viewport happens to break it:
 *
 *   Two ways to travel,
 *   planned as though we
 *   ⟨rotating ending⟩
 *
 * The first two lines are static (word-by-word CSS rise, identical to every
 * other animated heading on the site). The third keeps retyping itself
 * through a short list of endings — see RotatingClause for why that's
 * hand-rolled rather than a dependency, and why it never starts cycling
 * without JS or under prefers-reduced-motion.
 *
 * That third line is deliberately set smaller than the first two, not the
 * same giant size — every ending is short enough to fit on one line at that
 * size on any phone, so the line's height never changes as the words retype,
 * which is the actual point: a wrapping or resizing line was what made the
 * whole block visibly jump while cycling.
 *
 * Screen readers get one clean, complete sentence (the first ending, sr-only)
 * rather than the word-by-word spans or the live retyping — both of those are
 * `aria-hidden`.
 */
const HERO_LINE_1 = "Two ways to travel,";
const HERO_LINE_2 = "planned as though we";
const HERO_ENDINGS = [
  "were coming with you.",
  "knew where to stop.",
  "packed the bags ourselves.",
  "were part of the family.",
  "had done this before.",
];

/**
 * Homepage hero — a server component wrapping one client island
 * (`HeroSlideshow`). The copy, buttons and destination rail are plain server
 * markup animated in CSS, so the LCP block paints and animates with no
 * hydration; only the slideshow's crossfade timing and dot controls need JS.
 *
 * Every source photograph carries its main subject in the right two-thirds of
 * the frame, which is why the copy sits bottom-left: the scrim only has to
 * darken the side that was already open sky, water or meadow, so the
 * photography itself stays the most visible thing on the screen.
 */
export async function Hero() {
  const featuredDestinations = await getFeaturedDestinations();

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink">
      <HeroSlideshow slides={heroSlides} />

      {/* Two-pass scrim: vertical for the copy block, horizontal because the
          type is left-aligned and the right of the frame — where every one of
          these photographs puts its subject — stays open. */}
      <div className="photo-scrim absolute inset-0" aria-hidden="true" />
      <div className="photo-scrim-side absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[92rem] px-5 pb-14 pt-36 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
        <p className="eyebrow eyebrow-on-dark animate-rise" style={{ animationDelay: "0.1s" }}>
          International journeys since 2020
        </p>

        <h1 className="font-display mt-7 text-paper">
          <span className="sr-only">
            {HERO_LINE_1} {HERO_LINE_2} {HERO_ENDINGS[0]}
          </span>
          <span aria-hidden="true">
            <span className="block text-[length:var(--step-display)]">
              {renderRisingWords(HERO_LINE_1.split(" "), 0.28)}
            </span>
            <span className="block text-[length:var(--step-display)]">
              {renderRisingWords(HERO_LINE_2.split(" "), 0.28 + 4 * WORD_STAGGER, [], 4)}
            </span>
            <RotatingClause
              phrases={HERO_ENDINGS}
              delay={0.28 + 8 * WORD_STAGGER}
              className="mt-2 block whitespace-nowrap text-xl sm:text-2xl lg:text-4xl"
            />
          </span>
        </h1>

        <div className="animate-rise mt-9 max-w-xl" style={{ animationDelay: "0.95s" }}>
          <p className="text-lg leading-relaxed text-paper/85">
            Grand circuits across Europe, or easy, affordable escapes across Asia
            and the Gulf — private itineraries, visas filed in-house, and one
            consultant with you from the first call until you are home.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <EnquireButton size="lg" glass source="hero" withArrow>
              Plan your journey
            </EnquireButton>
            <ButtonLink
              href="/destinations"
              size="lg"
              variant="ghost"
              className="px-6 text-paper/85 hover:text-paper sm:px-6"
            >
              See the destinations
            </ButtonLink>
          </div>
        </div>

        {/* Destination rail — doubles as a table of contents for the site. */}
        <nav
          aria-label="Featured destinations"
          className="animate-fade mt-14 border-t border-paper/20 pt-6 lg:mt-20"
          style={{ animationDelay: "1.25s" }}
        >
          <ul className="flex flex-wrap gap-x-8 gap-y-1 sm:gap-x-12">
            {featuredDestinations.map((destination) => (
              <li key={destination.slug}>
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="link-underline inline-flex min-h-[44px] items-center text-sm uppercase tracking-[0.16em] text-paper/75 transition-colors duration-200 hover:text-paper"
                >
                  {destination.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
