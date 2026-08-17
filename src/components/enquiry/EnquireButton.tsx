"use client";

import { Button } from "@/components/ui/Button";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { useEnquiry } from "./EnquiryContext";
import type { ComponentProps } from "react";

/**
 * The site-wide CTA. A thin client wrapper so server components can drop a
 * working "Plan your journey" button anywhere without becoming client
 * components themselves.
 *
 * `glass` swaps the solid Button for the frosted LiquidButton — only pass it
 * where the button sits directly over a photograph (the homepage hero,
 * CTABand), never over a flat paper/paper-2 surface, where glass has nothing
 * to blur and just looks broken. `variant`/`withArrow` still apply to the
 * plain Button path; LiquidButton only honours `withArrow` and `size`.
 */
export function EnquireButton({
  destination,
  source,
  glass = false,
  children = "Plan your journey",
  ...rest
}: {
  destination?: string;
  source?: string;
  glass?: boolean;
} & Omit<ComponentProps<typeof Button>, "onClick" | "children"> & {
    children?: React.ReactNode;
  }) {
  const { open } = useEnquiry();
  const onClick = () => open({ destination, source });

  if (glass) {
    return (
      <LiquidButton
        onClick={onClick}
        size={rest.size}
        className={rest.className}
        withArrow={rest.withArrow}
      >
        {children}
      </LiquidButton>
    );
  }

  return (
    <Button onClick={onClick} {...rest}>
      {children}
    </Button>
  );
}
