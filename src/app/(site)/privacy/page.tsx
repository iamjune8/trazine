import type { Metadata } from "next";

import { PageHeader } from "@/components/sections/PageHeader";
import { Container, Section } from "@/components/ui/Layout";
import { Reveal } from "@/components/motion/Reveal";
import { site, fullAddress } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Travel Magazine collects, uses and protects the information you share with us through an enquiry, a call or WhatsApp.",
  alternates: { canonical: "/privacy" },
};

const updated = "16 August 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "What this covers",
    body: (
      <>
        <p>
          This policy explains what {site.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
          &ldquo;{site.name}&rdquo;) collects when you use this website or contact us
          about a trip, why we collect it, and what you can ask us to do with it. It
          applies to this website and to enquiries made by phone, WhatsApp or email.
        </p>
        <p>
          We are not a bank or a payment processor — this site does not take payments,
          store card details, or process bookings directly. It is a way to reach a
          consultant, who then plans and books the trip with you through a separate
          conversation.
        </p>
      </>
    ),
  },
  {
    title: "What we collect",
    body: (
      <>
        <p>When you send an enquiry, we collect what you type into the form:</p>
        <ul>
          <li>Your name, email address and phone number</li>
          <li>The destination you&rsquo;re interested in, if selected</li>
          <li>Who&rsquo;s travelling and roughly when, if provided</li>
          <li>Anything you write in the message field</li>
        </ul>
        <p>
          If you contact us by phone, WhatsApp or email instead, we hold whatever you
          share in that conversation — the same categories of information, essentially,
          arriving a different way.
        </p>
        <p>
          We don&rsquo;t ask for payment details, passport numbers or other travel
          documents through this website. Those are collected later, directly with your
          consultant, once a trip is actually being booked — never through the enquiry
          form.
        </p>
      </>
    ),
  },
  {
    title: "Why we collect it",
    body: (
      <>
        <p>We use enquiry information to:</p>
        <ul>
          <li>Reply to your enquiry and put together a proposal</li>
          <li>Reach you by phone, email or WhatsApp about the trip you asked about</li>
          <li>
            Keep a record of what was discussed, so you don&rsquo;t have to repeat
            yourself to a different consultant
          </li>
        </ul>
        <p>
          We do not sell your information, and we do not use it for purposes unrelated
          to planning your journey.
        </p>
      </>
    ),
  },
  {
    title: "Who we share it with",
    body: (
      <>
        <p>
          Planning an international trip means some of your information necessarily
          passes to third parties who help deliver it — this is normal for any travel
          agency, and we limit it to what each booking actually requires:
        </p>
        <ul>
          <li>
            Airlines, hotels, tour operators and ground-handling partners, to make the
            bookings that make up your itinerary
          </li>
          <li>
            Visa processing centres and consulates, where a visa application requires it
          </li>
          <li>Insurance providers, where you&rsquo;ve asked us to arrange cover</li>
          <li>
            Service providers who help us run this website or store enquiry records
            securely
          </li>
        </ul>
        <p>
          If you reach us on WhatsApp, that conversation is also subject to
          WhatsApp&rsquo;s own privacy policy, since it&rsquo;s Meta&rsquo;s platform
          carrying the message, not ours.
        </p>
        <p>We do not share your information with third parties for their own marketing.</p>
      </>
    ),
  },
  {
    title: "Cookies and analytics",
    body: (
      <>
        <p>
          This site can use Google Analytics and Google Tag Manager to understand, in
          aggregate, how the site is used — which pages get read, roughly where visitors
          come from — so we can improve it. These tools may set cookies in your browser.
          We don&rsquo;t use them to identify you personally, and they play no part in
          how your enquiry itself is handled.
        </p>
        <p>
          You can block or delete these cookies in your browser settings at any time;
          the site works fully without them.
        </p>
      </>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <p>
        We keep enquiry records for as long as is reasonably useful — generally, for the
        life of any relationship with you, and for a period afterwards in case you get in
        touch again about a future trip. If you ask us to delete your information and
        there&rsquo;s no active booking or legal reason to retain it, we will.
      </p>
    ),
  },
  {
    title: "Your choices",
    body: (
      <>
        <p>You can ask us, at any time, to:</p>
        <ul>
          <li>Tell you what information we hold about you</li>
          <li>Correct anything that&rsquo;s wrong</li>
          <li>Delete your information, where we&rsquo;re not required to keep it</li>
          <li>Stop contacting you about a trip you enquired about</li>
        </ul>
        <p>
          Email{" "}
          <a href={`mailto:${site.email}`} className="link-underline text-brass-deep">
            {site.email}
          </a>{" "}
          and we&rsquo;ll act on it directly — there&rsquo;s no form to fill in.
        </p>
      </>
    ),
  },
  {
    title: "Keeping it secure",
    body: (
      <p>
        We take reasonable technical and organisational steps to protect the information
        you share with us against loss, misuse or unauthorised access. No system is
        completely immune to risk, but travel enquiries are not held anywhere they
        don&rsquo;t need to be, and access is limited to the people actually working on
        your trip.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: (
      <p>
        If how we handle information changes in a meaningful way, we&rsquo;ll update this
        page and change the date below. We won&rsquo;t make a material change and stay
        silent about it.
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

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        lede={`Last updated ${updated}.`}
        breadcrumb={[{ label: "Home", href: "/" }]}
        breadcrumbLabel="Privacy Policy"
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
