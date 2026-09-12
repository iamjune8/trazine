import Image from "next/image";
import { photo, photoBlur } from "@/lib/images";

/**
 * A package's hero image comes from an admin-entered field that accepts
 * either a local catalogue path or a pasted external URL from any host —
 * next/image's optimizer can only handle the former (its `remotePatterns`
 * allowlist can't cover "any host an admin might paste"). Local paths get
 * the full optimizer (resize, avif/webp conversion, blur-up placeholder);
 * external URLs fall back to a plain `<img>`, unchanged from before.
 *
 * Every package currently in the CMS uses a local path, so in practice this
 * is what actually optimizes package hero images — previously every one of
 * them shipped as a raw, full-size JPEG (some pushing 900KB) with no
 * resizing at all.
 */
export function PackageHeroImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  /** Set for the one hero image that's the page's LCP candidate. */
  priority?: boolean;
  className?: string;
}) {
  if (src.startsWith("http")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- admin-pasted URL from any host, outside next/image's remotePatterns allowlist
      <img src={src} alt={alt} className={className} />
    );
  }

  return (
    <Image
      src={photo(src)}
      alt={alt}
      fill
      sizes={sizes}
      quality={75}
      placeholder="blur"
      blurDataURL={photoBlur(src)}
      preload={priority}
      className={className}
    />
  );
}
