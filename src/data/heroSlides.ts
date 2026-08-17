import type { StaticImageData } from "next/image";

import dubaiHero from "@/assets/hero/dubai-hero.png";
import switzerlandHero from "@/assets/hero/switzerland-hero.png";
import parisHero from "@/assets/hero/paris-hero.png";
import ukHero from "@/assets/hero/uk-hero.png";

/**
 * Homepage hero slideshow.
 *
 * Static imports (rather than remote URLs) so Next generates width/height and
 * an automatic blur placeholder from the file itself — no manual blur data,
 * no remote host dependency, and the optimizer still re-encodes each PNG to
 * AVIF/WebP at request time.
 *
 * Every source photograph here has its main subject weighted toward the right
 * two-thirds of the frame, which is what makes the left-aligned hero layout
 * work: the text scrim only has to darken the side that was already open sky,
 * water or meadow.
 */

export type HeroSlide = {
  key: string;
  image: StaticImageData;
  alt: string;
  destinationName: string;
  destinationSlug: string;
  region: string;
};

export const heroSlides: HeroSlide[] = [
  {
    key: "dubai",
    image: dubaiHero,
    alt: "A family laughing in an infinity pool at sunset, the Burj Khalifa rising over Dubai behind them",
    destinationName: "Dubai",
    destinationSlug: "dubai",
    region: "United Arab Emirates",
  },
  {
    key: "switzerland",
    image: switzerlandHero,
    alt: "A wooden chalet in an alpine meadow below snow-capped peaks in the Bernese Oberland",
    destinationName: "Switzerland",
    // Switzerland, Paris and the UK all now live inside the single Europe page.
    destinationSlug: "europe",
    region: "The Alps",
  },
  {
    key: "paris",
    image: parisHero,
    alt: "A couple looking out at the Eiffel Tower lit up above the Seine at night",
    destinationName: "Paris",
    destinationSlug: "europe",
    region: "France",
  },
  {
    key: "uk",
    image: ukHero,
    alt: "Tower Bridge and the London skyline at sunset, seen from the Thames",
    destinationName: "United Kingdom",
    destinationSlug: "europe",
    region: "England & Scotland",
  },
];
