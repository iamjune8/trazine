"use client";

import type { ReactNode } from "react";
import { LazyMotion } from "motion/react";

// See PublicMotionProvider — same reasoning, domMax variant: the admin
// sidebar and form-section nav use layoutId, which needs the
// layout-projection engine domAnimation excludes.
const loadFeatures = () => import("@/lib/motion-features-max").then((mod) => mod.default);

export function AdminMotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
