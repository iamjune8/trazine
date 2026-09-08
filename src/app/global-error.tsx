"use client";

import { useEffect } from "react";

/**
 * The last line of defense: catches an error thrown by the root layouts
 * themselves ((site)/layout.tsx or admin/layout.tsx) — e.g. a Supabase
 * outage hitting getDestinations() during a page render — which is above
 * where every other error.tsx in this app can catch. Next.js requires this
 * one to render its own <html>/<body>, and deliberately avoids importing
 * any app component, since whatever broke the layout could be a reason
 * those fail too.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          padding: "1.5rem",
          textAlign: "center",
          fontFamily: "Georgia, 'Times New Roman', serif",
          background: "#faf8f4",
          color: "#17140f",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          Something went wrong.
        </h1>
        <p style={{ maxWidth: 420, color: "#6b6152", margin: 0 }}>
          The site hit an unexpected error. Try again, or call us if it keeps happening.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.75rem 1.5rem",
            border: "1px solid #17140f",
            background: "#17140f",
            color: "#faf8f4",
            fontSize: "0.8125rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
