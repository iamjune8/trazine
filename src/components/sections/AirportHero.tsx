"use client";

import { useCallback, type SyntheticEvent } from "react";
import { useReducedMotion } from "motion/react";
import { renderRisingWords, WORD_STAGGER } from "@/components/motion/AnimatedHeading";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { photo } from "@/lib/images";

/**
 * The source clip carries its own baked-in "THE JOURNEY BEGINS" title card
 * over its final ~4 seconds — which would sit directly under our headline in
 * the hold frame. Stopping playback here instead holds on a clean shot of
 * the traveller mid-stride through the sunlit terminal, just before that
 * title fades in.
 */
const HOLD_AT_SECONDS = 5.6;

/**
 * Hero — the real rendered clip (public/video/airport-hero.mp4). Plays once
 * on load, muted, and pauses itself at `HOLD_AT_SECONDS` rather than running
 * to the end, so the baggage-to-lounge shot reads as a one-time cinematic
 * reveal that settles on a clean frame. A slow CSS scale (`.animate-hero-zoom`)
 * runs independently of playback, so the frame is still very gently moving
 * even once the video itself has stopped.
 *
 * `useReducedMotion` drops the zoom and autoplay entirely and shows the
 * video paused on its poster frame instead — real footage, no motion —
 * matching the "no forced motion" rule ParallaxImage.tsx follows elsewhere
 * on this site.
 */
export function AirportHero() {
  const reduced = useReducedMotion();

  const holdAtFrame = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.currentTime >= HOLD_AT_SECONDS) video.pause();
  }, []);

  return (
    <section className="relative flex h-[100svh] flex-col justify-end overflow-hidden bg-ink">
      <video
        src="/video/airport-hero.mp4"
        poster={photo("travelerCorridorAerial", 1600)}
        autoPlay={!reduced}
        muted
        playsInline
        preload={reduced ? "metadata" : "auto"}
        onTimeUpdate={reduced ? undefined : holdAtFrame}
        aria-hidden="true"
        className={`cinematic-grade absolute inset-0 h-full w-full object-cover ${
          reduced ? "" : "animate-hero-zoom"
        }`}
      />
      <div className="cinematic-vignette absolute inset-0" aria-hidden="true" />
      <div className="cinematic-grain absolute inset-0" aria-hidden="true" />

      <HeroCopy />
    </section>
  );
}

function HeroCopy() {
  return (
    <div className="relative z-10">
      <div className="photo-scrim absolute inset-0" aria-hidden="true" />
      <div className="photo-scrim-side absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[92rem] px-5 pb-24 pt-32 sm:px-8 sm:pb-28 lg:px-12">
        <p className="eyebrow eyebrow-on-dark animate-rise" style={{ animationDelay: "0.1s" }}>
          Mumbai &middot; Chhatrapati Shivaji International
        </p>

        <h1 className="font-display mt-6 max-w-2xl text-[length:var(--step-display)] text-paper">
          <span className="sr-only">Every journey starts on the ground.</span>
          <span aria-hidden="true">
            <span className="block">{renderRisingWords(["Every", "journey", "starts"], 0.28)}</span>
            <span className="block">
              {renderRisingWords(["on", "the", "ground."], 0.28 + 3 * WORD_STAGGER, [2], 3)}
            </span>
          </span>
        </h1>

        <div className="animate-rise mt-9" style={{ animationDelay: "0.9s" }}>
          <LiquidButton>Plan your journey</LiquidButton>
        </div>
      </div>
    </div>
  );
}
