"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { photo } from "@/lib/images";

type Status = "empty" | "loading" | "ok" | "broken";

/**
 * A text field for a photo-catalogue key, Unsplash photo ID, full URL, or
 * local path — paired with a live thumbnail so an editor sees immediately
 * whether what they typed actually resolves to an image, before saving.
 * Catches the exact failure mode that made the plain-text gallery/hero/place
 * fields silently produce blank cards: a mistyped or invented catalogue key
 * that `photo()` can't resolve, with no feedback until the live site.
 *
 * Two usage modes:
 *  - Uncontrolled + `name`: renders a native form field (hero/card/gallery
 *    images on the destination form), value read from FormData on submit.
 *  - Controlled via `value`/`onChange`, no `name`: for use inside a
 *    client-managed list (e.g. one image per place in the Places editor)
 *    where the parent owns the array of values and serialises it itself.
 */
export function AdminImageField({
  label,
  name,
  hint,
  required,
  defaultValue,
  value: controlledValue,
  onChange,
  className,
}: {
  label: string;
  name?: string;
  hint?: string;
  required?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const value = isControlled ? controlledValue : internalValue;

  // Tracks the load outcome of the most recently resolved src, keyed by that
  // src — so switching back to a previously-broken value doesn't show a
  // stale "ok" from a different one, and a value change always re-derives
  // "loading" until the new image actually reports back.
  const [loadResult, setLoadResult] = useState<{ src: string; ok: boolean } | null>(null);

  const trimmed = value.trim();
  const resolvedSrc = trimmed ? photo(trimmed, 400) : "";

  let status: Status;
  if (!trimmed) status = "empty";
  else if (!resolvedSrc) status = "broken";
  else if (loadResult?.src === resolvedSrc) status = loadResult.ok ? "ok" : "broken";
  else status = "loading";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    if (isControlled) {
      onChange?.(next);
    } else {
      setInternalValue(next);
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <label
        htmlFor={id}
        className="block text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-admin-text-3"
      >
        {label}
        {required ? <span className="text-admin-pink"> *</span> : null}
      </label>

      <div className="mt-1.5 flex items-center gap-3">
        <div className="relative h-[46px] w-[46px] shrink-0 overflow-hidden rounded-lg border border-admin-border bg-white/[0.03]">
          {status === "empty" && (
            <div className="flex h-full w-full items-center justify-center">
              <Icon name="eye" size={16} className="text-admin-text-3/50" />
            </div>
          )}
          {status === "broken" && (
            <div className="flex h-full w-full items-center justify-center bg-admin-danger/10">
              <Icon name="close" size={16} className="text-admin-danger" />
            </div>
          )}
          {(status === "loading" || status === "ok") && resolvedSrc && (
            <Image
              key={resolvedSrc}
              src={resolvedSrc}
              alt=""
              fill
              unoptimized
              sizes="46px"
              className="object-cover"
              onLoad={() => setLoadResult({ src: resolvedSrc, ok: true })}
              onError={() => setLoadResult({ src: resolvedSrc, ok: false })}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            id={id}
            name={name}
            type="text"
            required={required}
            value={value}
            onChange={handleChange}
            aria-describedby={hint ? hintId : undefined}
            className={cn(
              "w-full min-h-[46px] rounded-xl border bg-white/[0.03] px-3.5 py-2.5 font-sans text-sm text-admin-text placeholder:text-admin-text-3 transition-[border-color,box-shadow] duration-200 hover:border-admin-border-soft focus:outline-none focus:shadow-[0_0_0_3px_rgba(139,92,246,0.18)]",
              status === "broken"
                ? "border-admin-danger/70 focus:border-admin-danger/70"
                : "border-admin-border focus:border-admin-violet/60",
            )}
          />
        </div>
      </div>

      {status === "broken" && trimmed ? (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-admin-danger" role="alert">
          <Icon name="close" size={13} className="mt-0.5 shrink-0" />
          <span>
            Doesn&apos;t resolve to an image — check the catalogue key is spelled exactly right, or use a
            full URL instead.
          </span>
        </p>
      ) : status === "ok" ? (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-emerald-400">
          <Icon name="check" size={13} className="mt-0.5 shrink-0" />
          <span>Image loads correctly.</span>
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 whitespace-pre-line text-xs leading-relaxed text-admin-text-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
