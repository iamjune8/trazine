import type { Metadata } from "next";

import { MediaHeader } from "@/components/sections/MediaHeader";
import { FAQSection } from "@/components/sections/FAQSection";
import { Container, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/motion/Reveal";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { Icon, type IconName } from "@/components/ui/Icon";
import { site, fullAddress, whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to a consultant about a Premium Luxury European circuit or an Easy & Affordable trip across Asia and the Gulf. Call, WhatsApp, email, or send an enquiry and we'll reply within one working day.",
  alternates: { canonical: "/contact" },
};

const channels: {
  icon: IconName;
  label: string;
  value: string;
  href: string;
  note: string;
  event: string;
  external?: boolean;
}[] = [
  {
    icon: "phone",
    label: "Call",
    value: site.phone,
    href: site.phoneHref,
    note: site.hours,
    event: "call_click",
  },
  {
    icon: "whatsapp",
    label: "WhatsApp",
    value: site.phone,
    href: whatsappLink("Hello, I'd like to plan an international trip."),
    note: "Usually answered within the hour",
    event: "whatsapp_click",
    external: true,
  },
  {
    icon: "mail",
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "Replies within one working day",
    event: "email_click",
  },
];

export default function ContactPage() {
  return (
    <>
      <MediaHeader
        image="/images/other/contact-cta.jpg"
        imageAlt="An open coastal road, the sea alongside it"
        eyebrow="Contact"
        title="Tell us where you'd like to go"
        lede="Send the form below and a consultant will come back within one working day with an itemised proposal — or simply call, and we'll start straight away."
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
                      <span>{fullAddress}</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <Icon name="clock" size={17} className="mt-1 shrink-0 text-brass" />
                      <span>{site.hours}</span>
                    </p>
                  </address>
                  <p className="mt-5 text-sm text-ink-3">
                    Visitors are welcome, though a call ahead means the right
                    consultant is at their desk when you arrive.
                  </p>
                </div>

                <div className="mt-6 aspect-[4/3] w-full overflow-hidden border border-line-2">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${site.name}, ${fullAddress}`)}&output=embed`}
                    title="Map showing the Travel Magazine office location"
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

      <FAQSection tone="paper-2" />
    </>
  );
}
