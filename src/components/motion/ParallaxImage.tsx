"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { photo, photoBlur, type PhotoKey } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * An image that drifts slowly against the scroll inside a fixed-aspect frame.
 *
 * The frame reserves its own space via `aspect-*`, so there is no layout shift
 * as the photo loads (CLS stays at 0). Only `transform` is animated — the
 * image is scaled up by `overscan` so the drift never exposes an empty edge.
 */

type Props = {
  image: PhotoKey;
  alt: string;
  className?: string;
  /** Tailwind aspect class for the frame, e.g. "aspect-[4/5]". */
  aspect?: string;
  /** Vertical drift in percent of container height. Keep it small. */
  strength?: number;
  sizes?: string;
  preload?: boolean;
  rounded?: boolean;
  /** CSS object-position, for source photos whose subject isn't centred. */
  objectPosition?: string;
};

export function ParallaxImage({
  image,
  alt,
  className,
  aspect = "aspect-[4/5]",
  strength = 8,
  sizes = "(max-width: 768px) 100vw, 45vw",
  preload = false,
  rounded = false,
  objectPosition,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  const overscan = 1 + strength / 100 + 0.04;

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-paper-3",
        aspect,
        rounded && "rounded-sm",
        className,
      )}
    >
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y, scale: overscan }}
      >
        <Image
          src={photo(image)}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          placeholder="blur"
          blurDataURL={photoBlur(image)}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </motion.div>
    </div>
  );
}
