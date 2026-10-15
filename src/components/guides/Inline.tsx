import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * Renders the tiny inline syntax used in guide text: **bold**, *italic* and
 * [label](href). Built as React nodes (never injected HTML), and a link is
 * only rendered as one when its target is a site path or an https URL —
 * anything else falls back to plain text.
 */
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

const linkClass =
  "text-brass-deep underline decoration-brass/40 underline-offset-4 transition-colors duration-200 hover:decoration-brass-deep";

function renderPart(part: string): ReactNode {
  if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
    return <strong className="font-medium text-ink">{part.slice(2, -2)}</strong>;
  }
  if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
    return <em>{part.slice(1, -1)}</em>;
  }

  const link = LINK.exec(part);
  if (!link) return part;

  const [, label, href] = link;
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkClass}>
        {label}
      </Link>
    );
  }
  if (href.startsWith("https://")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {label}
      </a>
    );
  }
  return label;
}

export function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => (
        <Fragment key={i}>{renderPart(part)}</Fragment>
      ))}
    </>
  );
}
