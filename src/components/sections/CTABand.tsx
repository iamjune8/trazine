import Image from "next/image";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/motion/Reveal";
import { EnquireButton } from "@/components/enquiry/EnquireButton";
import { TrackedExternalButton } from "@/components/ui/TrackedExternalButton";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { Icon } from "@/components/ui/Icon";
import { photo, photoBlur, type PhotoKey } from "@/lib/images";
import { site, whatsappLink } from "@/data/site";

/**
 * Closing call to action. Repeated at the foot of every page — the reader who
 * has scrolled this far should never have to hunt for the way to start.
 *
 * The photograph sits behind a heavy scrim so the white type holds well past
 * the 4.5:1 minimum regardless of what is in frame.
 */
export function CTABand({
  image = "aircraftWing",
  eyebrow = "Start here",
  title = "Tell us where you'd like to go.",
  body = "One conversation, and you will have an itinerary with the reasoning attached — hotels named, inclusions listed, exclusions stated plainly.",
  destination,
  source = "cta-band",
}: {
  image?: PhotoKey;
  eyebrow?: string;
  title?: string;
  body?: string;
  destination?: string;
  source?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Image
        src={photo(image, 2000)}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        quality={70}
        placeholder="blur"
        blurDataURL={photoBlur(image)}
        className="object-cover opacity-45"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/45"
        aria-hidden="true"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        <Reveal className="max-w-2xl">
          <p className="eyebrow eyebrow-on-dark">{eyebrow}</p>
          <h2 className="font-display mt-6 text-[length:var(--step-h1)] text-paper">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-paper/75">{body}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <EnquireButton
              size="lg"
              glass
              destination={destination}
              source={source}
              withArrow
            >
              Plan your journey
            </EnquireButton>
            <TrackedExternalButton
              href={whatsappLink(
                destination
                  ? `Hello, I'd like to plan a trip to ${destination}.`
                  : "Hello, I'd like to plan an international trip.",
              )}
              event="whatsapp_click"
              data={{ source, destination }}
              size="lg"
              variant="ghost"
              className="px-6 text-paper/80 hover:text-paper sm:px-6"
            >
              <span className="inline-flex items-center gap-2.5">
                <Icon name="whatsapp" size={17} />
                WhatsApp us
              </span>
            </TrackedExternalButton>
          </div>

          <p className="mt-8 text-sm text-paper/50">
            Or call{" "}
            <TrackedAnchor
              href={site.phoneHref}
              event="call_click"
              data={{ source, destination }}
              className="link-underline text-brass-light transition-colors duration-200"
            >
              {site.phone}
            </TrackedAnchor>{" "}
            &middot; {site.hours}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
