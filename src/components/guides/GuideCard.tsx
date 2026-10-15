import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { photo, photoBlur } from "@/lib/images";
import { readingMinutes, type Guide } from "@/data/guides";

/** One whole-card link: a single tab stop, fixed image ratio so the grid never shifts. */
export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link href={`/guides/${guide.slug}`} className="group block focus-visible:outline-offset-4">
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-3">
        <Image
          src={photo(guide.image, 1000)}
          alt={guide.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL={photoBlur(guide.image)}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
      </div>

      <p className="eyebrow mt-6">
        {guide.eyebrow} &middot; {readingMinutes(guide)} min read
      </p>
      <h3 className="font-display mt-3 text-2xl text-ink sm:text-[1.65rem]">{guide.title}</h3>
      <div className="mt-3 flex items-start justify-between gap-5">
        <p className="max-w-[44ch] text-ink-2">{guide.description}</p>
        <span
          className="mt-1 shrink-0 text-brass transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1"
          aria-hidden="true"
        >
          <Icon name="arrow-up-right" size={20} />
        </span>
      </div>
    </Link>
  );
}
