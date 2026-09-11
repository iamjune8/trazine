import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export type SiteSettings = {
  phone: string;
  phoneHref: string;
  whatsapp: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  fullAddress: string;
  hours: string;
  mapsEmbedUrl: string;
};

/**
 * The real business details this site was launched with — used as a
 * fallback if the `site_settings` row is ever missing or the query fails,
 * so a database hiccup degrades to "shows the old number" rather than a
 * broken contact page.
 */
const FALLBACK: Omit<SiteSettings, "fullAddress" | "phoneHref" | "whatsapp" | "mapsEmbedUrl"> = {
  phone: "+91 81085 31332",
  email: "ops@travzine.in",
  address: {
    line1: "Unit No F9, Upper Section, First Floor, Kohinoor City Mall",
    line2: "Premier Road, Kurla West",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400070",
    country: "India",
  },
  hours: "Monday – Saturday, 10:00 – 19:00 IST",
};

function derive(row: {
  phone: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  hours: string;
}): SiteSettings {
  const address = {
    line1: row.address_line1,
    line2: row.address_line2,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    country: row.country,
  };
  const fullAddress = [
    address.line1,
    address.line2,
    `${address.city} ${address.postalCode}`,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    phone: row.phone,
    // Derived from the single phone field rather than stored separately —
    // a second/third field for the same number is just another place for
    // the admin to enter it inconsistently with the display version.
    phoneHref: `tel:${row.phone.replace(/[^\d+]/g, "")}`,
    whatsapp: row.phone.replace(/\D/g, ""),
    email: row.email,
    address,
    fullAddress,
    hours: row.hours,
    // A plain address-query embed regenerates itself whenever the address
    // changes — no separate "paste your embed code" field for the admin to
    // keep in sync. Trades away the exact-listing pin a Place ID/ftid gives,
    // but that precision isn't worth a field that goes stale the moment the
    // address is edited without it.
    mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(`${row.address_line1}, ${row.city}`)}&output=embed`,
  };
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "default")
    .single();

  if (error || !data) {
    console.error("[content] failed to load site settings, using fallback", error);
    return derive({
      phone: FALLBACK.phone,
      email: FALLBACK.email,
      address_line1: FALLBACK.address.line1,
      address_line2: FALLBACK.address.line2,
      city: FALLBACK.address.city,
      state: FALLBACK.address.state,
      postal_code: FALLBACK.address.postalCode,
      country: FALLBACK.address.country,
      hours: FALLBACK.hours,
    });
  }

  return derive(data);
});
