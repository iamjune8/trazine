import type { SVGProps } from "react";

/**
 * Hand-picked line icons in the Lucide idiom (24px grid, 1.5 stroke, round
 * caps). Inlined as SVG rather than pulled from an icon package so the site
 * ships no extra JS for six glyphs — and never an emoji standing in for one.
 *
 * Icons are decorative here: every one is paired with a visible text label,
 * so they carry `aria-hidden` and add nothing to the accessibility tree.
 */

export type IconName =
  | "compass"
  | "stamp"
  | "plane"
  | "shield"
  | "wallet"
  | "headset"
  | "arrow-right"
  | "arrow-up-right"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "close"
  | "menu"
  | "mail"
  | "phone"
  | "pin"
  | "clock"
  | "check"
  | "quote"
  | "play"
  | "pause"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "plus"
  | "minus"
  | "calendar"
  | "users"
  | "bed"
  | "map-route"
  | "receipt";

const paths: Record<IconName, React.ReactNode> = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.1 5-5 2.1 2.1-5z" />
    </>
  ),
  stamp: (
    <>
      <path d="M5 21h14" />
      <path d="M6 18h12v-3H6z" />
      <path d="M9 15V9.5a3 3 0 1 1 6 0V15" />
    </>
  ),
  plane: <path d="M17.8 19.8 16 14l4-4a2 2 0 0 0-2.8-2.8l-4 4-5.8-1.8a1 1 0 0 0-1 1.7L9.5 13 8 16l-2.2.5a.8.8 0 0 0-.3 1.4l2.3 1.6 1.6 2.3a.8.8 0 0 0 1.4-.3L11.3 19l3-1.5 2.9 3.1a1 1 0 0 0 1.7-1z" />,
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.2 2.8 7.9 7 9.5 4.2-1.6 7-5.3 7-9.5V6z" />
      <path d="m9.5 12 1.8 1.8 3.4-3.6" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M3 9h15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3" />
      <circle cx="16.5" cy="12" r="1" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 14h2.5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M20 14h-2.5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1z" />
      <path d="M20 18v1a2 2 0 0 1-2 2h-4" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  "arrow-up-right": (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  close: (
    <>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </>
  ),
  menu: (
    <>
      <path d="M3 7h18" />
      <path d="M3 12h18" />
      <path d="M3 17h18" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <path d="M6.5 3h2l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L15 12l4 1.5v2a2.5 2.5 0 0 1-2.7 2.5A14.5 14.5 0 0 1 3 5.7 2.5 2.5 0 0 1 5.5 3z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  play: <path d="M8 5.5v13l11-6.5z" />,
  pause: (
    <>
      <rect x="7" y="5.5" width="4" height="13" rx="1" />
      <rect x="13" y="5.5" width="4" height="13" rx="1" />
    </>
  ),
  quote: (
    <path d="M9.5 6C6.5 7.5 5 10 5 13v5h5.5v-5.5H8c0-2 .7-3.4 2.4-4.4zm9 0C15.5 7.5 14 10 14 13v5h5.5v-5.5H17c0-2 .7-3.4 2.4-4.4z" />
  ),
  whatsapp: (
    <path d="M20 11.6a7.9 7.9 0 0 1-11.7 7L4 20l1.4-4.2A7.9 7.9 0 1 1 20 11.6z M9 9.2c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.2-.3.3-.1.6a6 6 0 0 0 2.7 2.3c.3.1.5.1.6-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.4a1.8 1.8 0 0 1-1.2 1.5c-.6.2-1.4.1-3-.6a10 10 0 0 1-4-3.6c-.6-1-.7-1.9-.7-2.4a2 2 0 0 1 .7-1.3z" />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="1" />
    </>
  ),
  facebook: (
    <path d="M14.5 8.5H17V5h-2.5a4 4 0 0 0-4 4v2H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9.5a1 1 0 0 1 .5-1z" />
  ),
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M8 10.5V17" />
      <path d="M8 7.4v.1" />
      <path d="M12 17v-3.6a2.4 2.4 0 0 1 4.8 0V17" />
      <path d="M12 10.5V17" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 6.2a3 3 0 0 1 0 5.7" />
      <path d="M17.5 13.3a5.5 5.5 0 0 1 3 5.2" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" />
      <path d="M3 18v2" />
      <path d="M21 18v2" />
      <path d="M3 13v-1a2 2 0 0 1 2-2h6v4" />
    </>
  ),
  "map-route": (
    <>
      <circle cx="6" cy="7" r="2.2" />
      <circle cx="18" cy="17" r="2.2" />
      <path d="M6 9.2V13a3 3 0 0 0 3 3h6" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-2.5-1.6L13 21l-1-1.6L10 21l-2.5-1.6L5 21V3z" />
      <path d="M8.5 8h7" />
      <path d="M8.5 12h7" />
    </>
  ),
};

/** Icons that read better filled than stroked. */
const filled = new Set<IconName>([
  "quote",
  "plane",
  "facebook",
  "whatsapp",
  "play",
  "pause",
]);

export function Icon({
  name,
  size = 20,
  className,
  ...rest
}: { name: IconName; size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  const isFilled = filled.has(name);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
