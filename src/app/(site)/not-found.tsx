import { Container } from "@/components/ui/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { DestinationCard } from "@/components/DestinationCard";
import { getDestinations } from "@/lib/content/destinations";

export default async function NotFound() {
  const destinations = await getDestinations();

  return (
    <div className="pb-24 pt-40 sm:pt-48">
      <Container>
        <p className="eyebrow">Error 404</p>
        <h1 className="font-display mt-6 max-w-[14ch] text-[length:var(--step-h1)]">
          That page has wandered off.
        </h1>
        <p className="mt-7 max-w-xl text-lg text-ink-2">
          The link may be out of date, or we may have moved something. Here is
          where most people are heading.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <ButtonLink href="/" withArrow>
            Back to the homepage
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Talk to a consultant
          </ButtonLink>
        </div>

        <ul className="mt-20 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.slice(0, 3).map((destination) => (
            <li key={destination.slug}>
              <DestinationCard destination={destination} />
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
