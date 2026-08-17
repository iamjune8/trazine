import Link from "next/link";
import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/Layout";
import { photo, photoBlur, type PhotoKey } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * A vertical, scroll-driven photo wall — two images from every destination,
 * arranged in three columns where the centre column pins in place while the
 * outer two scroll past it.
 *
 * This is a from-scratch adaptation of a "sticky-scroll gallery" pattern, not
 * a port: the reference version wrapped the entire page in `lenis` for
 * inertia scrolling, which would have hijacked scroll behaviour site-wide —
 * fighting `prefers-reduced-motion`, native anchor scrolling, and keyboard
 * paging everywhere else on the site, not just here. The pin effect itself
 * is plain CSS `position: sticky`, which needs none of that: it works with
 * the browser's native scroll, respects reduced motion automatically (there
 * is no motion to reduce — nothing animates, things merely stop scrolling
 * for a while), and costs zero JavaScript.
 *
 * Every figure is a real `<Link>` to its destination page, so — unlike a
 * canvas or JS-only gallery — this degrades to a perfectly normal, fully
 * crawlable set of photo links with no script at all.
 *
 * Below `sm`, the three columns collapse into one plain vertical list
 * (`display: contents` on the column wrappers): three narrow columns would
 * make every photo too small to read on a phone, so mobile gets the literal
 * "vertical" version rather than a cramped facsimile of the desktop one.
 */

type Shot = { slug: string; name: string; image: PhotoKey };

const left: Shot[] = [
  { slug: "europe", name: "Europe — Switzerland", image: "swissLauterbrunnen" },
  { slug: "europe", name: "Europe — Budapest", image: "budapestParliament" },
  { slug: "dubai", name: "Dubai — Jumeirah", image: "dubaiBurjAlArabBeach" },
  { slug: "vietnam", name: "Vietnam — Hoi An", image: "hoiAnLanterns" },
  { slug: "malaysia", name: "Malaysia — Kuala Lumpur", image: "kualaLumpurPetronas" },
  { slug: "singapore", name: "Singapore", image: "singaporeGardens" },
  { slug: "sri-lanka", name: "Sri Lanka — Ella", image: "sriLankaNineArches" },
];

const middle: Shot[] = [
  { slug: "bali", name: "Bali", image: "baliRiceTerraces" },
  { slug: "maldives", name: "Maldives", image: "maldivesOverwater" },
  { slug: "europe", name: "Europe — Paris", image: "parisEiffelSeine" },
  { slug: "dubai", name: "Dubai", image: "dubaiSkyline" },
];

const right: Shot[] = [
  { slug: "europe", name: "Europe — Norway", image: "norwayFjord" },
  { slug: "vietnam", name: "Vietnam — Ha Long Bay", image: "vietnamHaLongBayJunks" },
  { slug: "malaysia", name: "Malaysia — Penang", image: "malaysiaPenangBicycleMural" },
  { slug: "singapore", name: "Singapore — Marina Bay", image: "singaporeMarinaBaySandsPool" },
  { slug: "sri-lanka", name: "Sri Lanka — Sigiriya", image: "sriLankaSigiriyaSunset" },
  { slug: "nepal", name: "Nepal — Kathmandu", image: "nepalKathmanduDurbarSquare" },
];

function Frame({ shot, sizes }: { shot: Shot; sizes: string }) {
  return (
    <Link
      href={`/destinations/${shot.slug}`}
      className="group relative block aspect-[3/4] overflow-hidden bg-paper-3/10 focus-visible:outline-offset-4 sm:h-full sm:aspect-auto"
    >
      <Image
        src={photo(shot.image, 700)}
        alt={shot.name}
        fill
        sizes={sizes}
        loading="lazy"
        placeholder="blur"
        blurDataURL={photoBlur(shot.image)}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/20" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/80 to-transparent p-4 text-sm text-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {shot.name}
      </span>
    </Link>
  );
}

export function DestinationGallerySection() {
  return (
    <section className="bg-ink py-20 sm:py-28 lg:py-36">
      <Container className="mb-14 lg:mb-16">
        <SectionHeading
          onDark
          align="center"
          eyebrow="The whole map"
          title="Every destination, one long scroll"
          lede="A frame from every place we send you — keep scrolling and the middle column holds its ground while the rest moves past it."
        />
      </Container>

      <div className={cn("grid grid-cols-1 gap-2 px-2", "sm:grid-cols-12 sm:px-3 lg:px-4")}>
        <div className="contents sm:col-span-4 sm:grid sm:auto-rows-[22rem] sm:gap-2">
          {left.map((shot, i) => (
            <Frame key={`l-${i}`} shot={shot} sizes="(max-width: 640px) 100vw, 33vw" />
          ))}
        </div>

        <div className="contents sm:sticky sm:top-0 sm:col-span-4 sm:grid sm:h-screen sm:grid-rows-4 sm:gap-2">
          {middle.map((shot, i) => (
            <Frame key={`m-${i}`} shot={shot} sizes="(max-width: 640px) 100vw, 33vw" />
          ))}
        </div>

        <div className="contents sm:col-span-4 sm:grid sm:auto-rows-[22rem] sm:gap-2">
          {right.map((shot, i) => (
            <Frame key={`r-${i}`} shot={shot} sizes="(max-width: 640px) 100vw, 33vw" />
          ))}
        </div>
      </div>
    </section>
  );
}
