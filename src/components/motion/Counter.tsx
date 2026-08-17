"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a statistic up once, when it first scrolls into view.
 *
 * The final value is rendered on the server and used as the initial state, so
 * the number is correct before hydration, without JavaScript, and under
 * reduced-motion. The count is decoration layered on top of a correct figure —
 * it can fail silently and nothing is lost.
 */
export function Counter({
  value,
  suffix = "",
  duration = 1400,
}: {
  /** Final value; may contain a thousands separator, e.g. "9,400". */
  value: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const element = ref.current;
    const target = Number(value.replace(/,/g, ""));

    if (!element || !Number.isFinite(target) || target <= 0) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();

        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // ease-out-expo: fast arrival, long settle — the site's easing.
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setDisplay(Math.round(target * eased).toLocaleString("en-IN"));
          if (t < 1) frame = requestAnimationFrame(tick);
        };

        // Start from zero only once we know the animation will actually run,
        // so the rendered figure is never wrong for a frame.
        setDisplay("0");
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
