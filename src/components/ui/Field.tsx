"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * Form fields with visible labels, inline errors and helper text.
 *
 * Deliberate choices:
 *  - the label is always visible; placeholders are examples, never the label
 *  - errors sit directly under their own field, not collected at the top
 *  - `aria-invalid` + `aria-describedby` wire the error to the input
 *  - error text is 4.5:1 and paired with an icon, so colour is not the only
 *    signal that something is wrong
 */

type BaseProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

const controlStyles =
  "w-full min-h-[52px] bg-transparent border-b border-line-2 px-0 py-3 " +
  "font-sans text-base text-ink placeholder:text-ink-3/70 " +
  "transition-colors duration-200 " +
  "hover:border-ink-3 focus:border-brass-deep focus:outline-none " +
  "aria-[invalid=true]:border-danger";

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-3"
    >
      {children}
      {required ? (
        <span className="text-brass-deep" aria-hidden="true">
          {" "}
          *
        </span>
      ) : (
        <span className="normal-case tracking-normal text-ink-3/70"> (optional)</span>
      )}
    </label>
  );
}

function Messages({
  error,
  hint,
  errorId,
  hintId,
}: {
  error?: string;
  hint?: string;
  errorId: string;
  hintId: string;
}) {
  if (error) {
    return (
      <p
        id={errorId}
        className="mt-2 flex items-start gap-1.5 text-sm text-danger"
        role="alert"
      >
        <Icon name="close" size={15} className="mt-0.5 shrink-0" />
        <span>{error}</span>
      </p>
    );
  }
  if (hint) {
    return (
      <p id={hintId} className="mt-2 whitespace-pre-line text-sm text-ink-3">
        {hint}
      </p>
    );
  }
  return null;
}

export function TextField({
  label,
  name,
  error,
  hint,
  required,
  className,
  type = "text",
  ...rest
}: BaseProps & React.ComponentProps<"input">) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn(controlStyles, "mt-1")}
        {...rest}
      />
      <Messages error={error} hint={hint} errorId={errorId} hintId={hintId} />
    </div>
  );
}

export function SelectField({
  label,
  name,
  error,
  hint,
  required,
  className,
  options,
  placeholder = "Please choose",
  ...rest
}: BaseProps & { options: readonly string[]; placeholder?: string } & React.ComponentProps<"select">) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="relative mt-1">
        <select
          id={id}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(controlStyles, "cursor-pointer appearance-none pr-8")}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={16}
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-ink-3"
        />
      </div>
      <Messages error={error} hint={hint} errorId={errorId} hintId={hintId} />
    </div>
  );
}

/**
 * A small group of pill-style radio buttons — for a choice with 2-3 short
 * options where opening a `<select>` is slower than just tapping the answer
 * (matches the pill-button language already used for the admin status
 * filters and destination tier badges elsewhere on the site). Real
 * `<input type="radio">` elements underneath, visually hidden, so it's a
 * normal form field for keyboard nav, screen readers and FormData alike.
 */
export function ChoiceField({
  label,
  name,
  error,
  hint,
  required,
  className,
  options,
  value,
  onChange,
}: BaseProps & {
  options: readonly string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={cn("w-full", className)}>
      <span id={`${id}-label`} className="block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-3">
        {label}
        {required ? (
          <span className="text-brass-deep" aria-hidden="true"> *</span>
        ) : (
          <span className="normal-case tracking-normal text-ink-3/70"> (optional)</span>
        )}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className="mt-2 flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const checked = value === option;
          return (
            <label
              key={option}
              className={cn(
                "flex min-h-[44px] cursor-pointer items-center border px-5 text-sm font-medium transition-colors duration-200",
                checked
                  ? "border-ink bg-ink text-paper"
                  : "border-line-2 text-ink-2 hover:border-ink",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={checked}
                required={required}
                onChange={() => onChange?.(option)}
                className="sr-only"
              />
              {option}
            </label>
          );
        })}
      </div>
      <Messages error={error} hint={hint} errorId={errorId} hintId={hintId} />
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  error,
  hint,
  required,
  className,
  rows = 4,
  ...rest
}: BaseProps & React.ComponentProps<"textarea">) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn(controlStyles, "mt-1 resize-y leading-relaxed")}
        {...rest}
      />
      <Messages error={error} hint={hint} errorId={errorId} hintId={hintId} />
    </div>
  );
}
