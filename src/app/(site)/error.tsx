"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Layout";
import { ButtonLink, Button } from "@/components/ui/Button";

/**
 * Catches any error thrown while rendering a public page or its data
 * fetching (a Supabase outage mid-getDestinations(), for instance) so a
 * visitor sees this instead of Next's blank default crash screen. There was
 * previously no error.tsx anywhere under (site) — every public route relied
 * entirely on nothing going wrong.
 */
export default function SiteError({
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
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="font-display text-[length:var(--step-h2)] text-ink">
        This page hit a snag.
      </h1>
      <p className="max-w-md text-ink-2">
        Try again in a moment, or head back to the homepage. If this keeps happening, call us and
        we&rsquo;ll sort it from our end.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <Button onClick={reset} variant="primary">
          Try again
        </Button>
        <ButtonLink href="/" variant="outline">
          Back to homepage
        </ButtonLink>
      </div>
    </Container>
  );
}
