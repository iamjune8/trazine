"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Counts up from 0 to `value` once, when the component first mounts. Cheap
 * and dependency-free — no IntersectionObserver needed since every user is
 * above the fold where this is used. */
export function useCountUp(value: number, duration = 900) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced || value === 0) {
      return;
    }
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, reduced]);

  return display;
}
