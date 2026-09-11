import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { TrackedExternalButton } from "@/components/ui/TrackedExternalButton";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { Icon } from "@/components/ui/Icon";
import { photo, photoBlur, type PhotoKey } from "@/lib/images";
import { whatsappLink } from "@/data/site";
import { getSiteSettings } from "@/lib/content/siteSettings";

/**
 * One image, one headline, one primary action — deliberately not the full
 * site's HeroSlideshow (no slideshow JS, no Ken Burns animation, a single
 * `preload`ed image instead of several). This is the whole point of a
 * dedicated ad landing page: the visitor arrived already wanting this one
 * destination, so there is nothing here to choose between.
 */
export async function LpHero({
  destinationName,
  tagline,
  heroImage,
  source,
}: {
  destinationName: string;
  tagline: string;
  heroImage: PhotoKey;
  source: string;
}) {
  const settings = await getSiteSettings();

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Image
        src={photo(heroImage, 2000)}
        alt={`${destinationName} — ${tagline}`}
        fill
        preload
        sizes="100vw"
        quality={75}
        placeholder="blur"
        blurDataURL={photoBlur(heroImage)}
        className="object-cover opacity-55"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[62svh] w-full max-w-5xl flex-col justify-end px-5 py-16 sm:px-8 sm:py-20">
        <p className="eyebrow eyebrow-on-dark">{destinationName} Tour Packages</p>
        <h1 className="font-display mt-5 max-w-2xl text-[length:var(--step-h1)] text-paper">
          {tagline}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-paper/80">
          Tell us your dates and group size — a named consultant sends back a
          costed, itemised {destinationName} proposal within one working day.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href="#enquiry" size="lg" withArrow>
            Get a Free {destinationName} Itinerary
          </ButtonLink>
          <TrackedExternalButton
            href={whatsappLink(
              settings.whatsapp,
              `Hello, I'd like to plan a trip to ${destinationName}.`,
            )}
            event="whatsapp_click"
            data={{ source, destination: destinationName }}
            conversionLabel={process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP}
            variant="on-dark"
            size="lg"
          >
            <span className="inline-flex items-center gap-2.5">
              <Icon name="whatsapp" size={17} />
              WhatsApp
            </span>
          </TrackedExternalButton>
          <TrackedAnchor
            href={settings.phoneHref}
            event="call_click"
            data={{ source, destination: destinationName }}
            className="inline-flex min-h-[50px] items-center justify-center gap-2.5 px-6 text-sm font-medium text-paper/90 underline decoration-paper/40 underline-offset-4 transition-colors duration-200 hover:text-paper"
          >
            <Icon name="phone" size={17} />
            {settings.phone}
          </TrackedAnchor>
        </div>
      </div>
    </section>
  );
}
