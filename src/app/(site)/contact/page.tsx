import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { jsonLdScript } from "@/lib/utils";
import { MediaHeader } from "@/components/sections/MediaHeader";
import { FAQSection } from "@/components/sections/FAQSection";
import { Container, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/motion/Reveal";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { Icon, type IconName } from "@/components/ui/Icon";
import { whatsappLink } from "@/data/site";
import { getSiteSettings } from "@/lib/content/siteSettings";
import { pageCard } from "@/lib/ogCards";

export const metadata: Metadata = pageMetadata({
  title: "Contact: Mumbai Travel Agency, Kurla West",
  description:
    "Visit or contact Travel Magazine Tours & Travels, a travel agency in Kurla West, Mumbai. Call, WhatsApp, email or send an enquiry for Europe, Asia and Gulf holidays.",
  path: "/contact",
  image: pageCard("contact", "Travel Magazine Tours & Travels — Contact: talk to a consultant."),
});

/** Where a Mumbai traveller is most likely to go next from this page. */
const destinationLinks = [
  { href: "/destinations/europe", label: "Europe tour packages from Mumbai" },
  { href: "/destinations/vietnam", label: "Vietnam tour packages from Mumbai" },
  { href: "/destinations/dubai", label: "Dubai tour packages from Mumbai" },
  { href: "/destinations/thailand", label: "Thailand tour packages from Mumbai" },
  { href: "/destinations/singapore", label: "Singapore tour packages from Mumbai" },
  { href: "/packages", label: "Fixed-departure packages" },
  { href: "/services", label: "Visa, flights and insurance" },
] as const;

type Channel = {
  icon: IconName;
  label: string;
  value: string;
  href: string;
  note: string;
  event: string;
  conversionLabel?: string;
  external?: boolean;
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const channels: Channel[] = [
    {
      icon: "phone",
      label: "Call",
      value: settings.phone,
      href: settings.phoneHref,
      note: settings.hours,
      event: "call_click",
      conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CALL,
    },
    {
      icon: "whatsapp",
      label: "WhatsApp",
      value: settings.phone,
      href: whatsappLink(settings.whatsapp, "Hello, I'd like to plan an international trip."),
      note: "Usually answered within the hour",
      event: "whatsapp_click",
      conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP,
      external: true,
    },
    {
      icon: "mail",
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
      note: "Replies within one working day",
      event: "email_click",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { label: "Home", href: "/" },
              { label: "Contact", href: "/contact" },
            ]),
          ),
        }}
      />
      <MediaHeader
        image="/images/other/contact-cta.jpg"
        imageAlt="An open coastal road, the sea alongside it"
        eyebrow="Contact · Kurla West, Mumbai"
        title="Tell us where you'd like to go"
        lede="Send the form below and a consultant at our Kurla West office will come back within one working day with an itemised proposal — or simply call, and we'll start straight away."
        breadcrumb={[{ label: "Home", href: "/" }]}
        breadcrumbLabel="Contact"
      />

      <Section>
        <Container>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">Start Your Story</p>
                <h2 className="font-display mt-4 text-[length:var(--step-h2)]">
                  Send an enquiry
                </h2>
                <p className="mt-5 max-w-xl text-ink-2">
                  The more you tell us the sharper the first proposal will be —
                  but if all you have is a rough month and a headcount, that is
                  genuinely enough to start.
                </p>
              </Reveal>

              <Reveal delay={0.1} className="mt-12">
                <EnquiryForm source="contact-page" />
              </Reveal>
            </div>

            {/* Direct channels */}
            <div className="lg:col-span-4 lg:col-start-9">
              <Reveal delay={0.15}>
                <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink-3">
                  Or reach us directly
                </h2>

                <ul className="mt-7 border-t border-line">
                  {channels.map((channel) => (
                    <li key={channel.label} className="border-b border-line">
                      <TrackedAnchor
                        href={channel.href}
                        event={channel.event}
                        data={{ source: "contact-page" }}
                        conversionLabel={channel.conversionLabel}
                        {...(channel.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group flex min-h-[44px] items-start gap-4 py-6 transition-colors duration-200 hover:text-brass-deep"
                      >
                        <Icon
                          name={channel.icon}
                          size={19}
                          className="mt-1 shrink-0 text-brass"
                        />
                        <span>
                          <span className="block text-[0.625rem] font-medium uppercase tracking-[0.2em] text-ink-3">
                            {channel.label}
                          </span>
                          <span className="mt-1.5 block font-display text-xl text-ink transition-colors duration-200 group-hover:text-brass-deep">
                            {channel.value}
                          </span>
                          <span className="mt-1 block text-sm text-ink-3">
                            {channel.note}
                          </span>
                        </span>
                      </TrackedAnchor>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 border border-line-2 bg-paper-2 p-7">
                  <h3 className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-ink-3">
                    The office
                  </h3>
                  <address className="mt-4 space-y-3 not-italic text-ink-2">
                    <p className="flex items-start gap-3">
                      <Icon name="pin" size={17} className="mt-1 shrink-0 text-brass" />
                      <span>{settings.fullAddress}</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <Icon name="clock" size={17} className="mt-1 shrink-0 text-brass" />
                      <span>{settings.hours}</span>
                    </p>
                  </address>
                  <p className="mt-5 text-sm text-ink-3">
                    Visitors are welcome, though a call ahead means the right
                    consultant is at their desk when you arrive.
                  </p>
                </div>

                <div className="mt-6 aspect-[4/3] w-full overflow-hidden border border-line-2">
                  <iframe
                    // Built from the address in Settings, so editing the
                    // address there re-pins this map automatically — trades
                    // away the exact verified-listing pin a Place ID would
                    // give for a field that can never go stale.
                    src={settings.mapsEmbedUrl}
                    title="Map showing the Travel Magazine Tours & Travels office location"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper-2">
        <Container>
          <Reveal className="max-w-3xl">
            <p className="eyebrow">From our Kurla West office</p>
            <h2 className="font-display mt-4 text-[length:var(--step-h2)]">
              International holidays planned in Mumbai
            </h2>
            <p className="mt-5 text-lg text-ink-2">
              Our office in Kurla West, Mumbai plans international holidays for
              travellers across the city and the rest of India: Premium Luxury
              circuits in Europe, and Easy &amp; Affordable journeys across Asia
              and the Gulf. Tell us where you are thinking of going, or start
              from one of these.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {destinationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-underline text-brass-deep">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      <FAQSection tone="paper" />
    </>
  );
}
