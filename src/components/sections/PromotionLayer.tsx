"use client";

import { useCallback, useState } from "react";
import { PromotionPopup } from "./PromotionPopup";
import { LandingPoster } from "./LandingPoster";
import type { Promotion } from "@/lib/content/promotion";
import type { LandingPoster as LandingPosterData } from "@/lib/content/landingPoster";

/**
 * Sequences the two promotion surfaces so they never compete for attention:
 * the big landing poster (limited-time, once per session) gets first look,
 * and the small corner banner (always-on) only starts its own delay once
 * the poster has nothing left to show — inactive, already dismissed this
 * session, or just closed.
 */
export function PromotionLayer({
  promotion,
  poster,
}: {
  promotion: Promotion;
  poster: LandingPosterData;
}) {
  const [posterDone, setPosterDone] = useState(false);
  const handlePosterDone = useCallback(() => setPosterDone(true), []);

  return (
    <>
      <LandingPoster poster={poster} onDone={handlePosterDone} />
      {posterDone ? <PromotionPopup promotion={promotion} /> : null}
    </>
  );
}
