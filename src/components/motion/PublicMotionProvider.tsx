"use client";

import type { ReactNode } from "react";
import { LazyMotion } from "motion/react";

// Defined here, not passed as a prop from the (site) root layout (a Server
// Component) — a plain function can't cross that boundary. Async, pointing
// at a standalone module, so this becomes a genuinely separate chunk rather
// than being deduped into whatever else imports "motion/react" (see
// src/lib/motion-features.ts).
const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

export function PublicMotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
