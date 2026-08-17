import type { Metadata } from "next";

import { PageHeader } from "@/components/sections/PageHeader";
import { Container, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/motion/Reveal";
import { site, fullAddress } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms that govern using the Travel Magazine website — separate from the booking conditions that apply once a trip is actually confirmed.",
  alternates: { canonical: "/terms" },
};

const updated = "16 August 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "What these terms cover",
    body: (
      <>
        <p>
          These terms govern your use of this website, run by {site.legalName}{" "}
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;{site.name}&rdquo;). By browsing the
          site or sending an enquiry, you&rsquo;re agreeing to them.
        </p>
        <p>
          They are <em>not</em> the terms of a travel booking. This website is where a
          journey starts — you tell us what you&rsquo;re thinking about, and a consultant
          takes it from there. Specific booking conditions — payment schedule,
          cancellation and refund terms, what happens if a supplier changes a
          reservation — are agreed separately, in writing, at the time a trip is actually
          confirmed, and take precedence over anything on this website.
        </p>
      </>
    ),
  },
  {
    title: "Using this website",
    body: (
      <>
        <p>
          You&rsquo;re welcome to browse, read and share anything on this site for your
          own personal use in planning a trip. You agree not to:
        </p>
        <ul>
          <li>
            Scrape, systematically copy, or republish the site&rsquo;s content elsewhere
            without asking us first
          </li>
          <li>Attempt to interfere with how the site or its enquiry form runs</li>
          <li>
            Use the enquiry form to send anything other than a genuine travel enquiry
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Accuracy of information",
    body: (
      <>
        <p>
          Destination content, seasonal guidance, visa notes and flying times are
          written to be genuinely useful and are checked when published, but travel
          information changes — visa rules, flight schedules and opening hours especially.
          Treat everything on this site as a considered starting point, not the final
          word, and always confirm the specifics that matter for your own trip with your
          consultant before you rely on them.
        </p>
        <p>
          Nothing on this site is immigration or legal advice. For anything visa-related,
          the relevant embassy or consulate is always the final authority.
        </p>
      </>
    ),
  },
  {
    title: "No prices published here",
    body: (
      <p>
        This site deliberately doesn&rsquo;t publish fixed prices, because every trip is
        costed individually against your dates, hotel category and group size. Anything
        that looks like an indicative figure in an enquiry conversation is exactly
        that — indicative — until it&rsquo;s confirmed in a written proposal.
      </p>
    ),
  },
  {
    title: "Content and ownership",
    body: (
      <p>
        The text, design and photography on this site belong to {site.legalName} or are
        used under licence from their owners. You&rsquo;re welcome to link to it; you
        don&rsquo;t have permission to copy substantial parts of it for your own
        commercial use.
      </p>
    ),
  },
  {
    title: "Links to other sites",
    body: (
      <p>
        Where we link to an external site — an airline, a hotel, a government visa
        portal — we&rsquo;re not responsible for its content or availability. It&rsquo;s
        provided for convenience, not as an endorsement of everything on it.
      </p>
    ),
  },
  {
    title: "Limitation of liability",
    body: (
      <p>
        We provide this website and its content in good faith, but to the extent the law
        allows, we&rsquo;re not liable for loss arising from your use of it — including
        decisions made on the basis of general content here rather than a confirmed
        proposal from your consultant. This doesn&rsquo;t limit any liability that
        can&rsquo;t lawfully be excluded, or anything covered separately by your actual
        booking conditions once a trip is confirmed.
      </p>
    ),
  },
  {
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of India, and any dispute arising from them
        falls under the jurisdiction of the courts in Mumbai.
      </p>
    ),
  },
  {
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms as the site or the business changes. The date below
        reflects the last update; continuing to use the site after a change means you
        accept the current version.
      </p>
    ),
  },
  {
    title: "Contact",
    body: (
      <p>
        {site.legalName}, {fullAddress}. Email{" "}
        <a href={`mailto:${site.email}`} className="link-underline text-brass-deep">
          {site.email}
        </a>{" "}
        or call{" "}
        <a href={site.phoneHref} className="link-underline text-brass-deep">
          {site.phone}
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Use"
        lede={`Last updated ${updated}. Covers this website — booking-specific terms are provided separately when a trip is confirmed.`}
        breadcrumb={[{ label: "Home", href: "/" }]}
        breadcrumbLabel="Terms of Use"
      />

      <Section>
        <Container size="narrow">
          <div className="space-y-14">
            {sections.map((section) => (
              <Reveal key={section.title}>
                <h2 className="font-display text-[length:var(--step-h3)] text-ink">
                  {section.title}
                </h2>
                <div className="prose-body policy-copy mt-5 text-ink-2">
                  {section.body}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
