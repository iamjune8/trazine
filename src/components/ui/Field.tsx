"use client";

import { useId, useState, type AnimationEvent, type ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * Form fields with a floating label: the label sits inside the control like
 * a placeholder at rest, then lifts into a small caption above it on focus
 * or once a value is present — and stays lifted so it never re-overlaps
 * typed text. It is a real `<label htmlFor>` the whole time (via `m.label`),
 * never a placeholder standing in for it, so screen readers, `for`/`id`
 * association and browser autofill styling all behave normally.
 *
 * Deliberate choices:
 *  - only `transform` (y, scale) and `color`/`opacity` are animated — the
 *    label is `position: absolute` throughout, so lifting it never reflows
 *    the input below it or the error text below that
 *  - the vertical space a lifted label needs is reserved with static
 *    `padding-top`, not animated, so there is no layout shift either way
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
  "field-control w-full min-h-[52px] bg-transparent border-b border-line-2 px-0 py-3 " +
  "font-sans text-base text-ink " +
  "transition-colors duration-200 " +
  "hover:border-ink-3 focus:border-brass-deep focus:outline-none " +
  "aria-[invalid=true]:border-danger";

const LABEL_TRANSITION_MS = 0.28;
const LETTER_STAGGER = 0.014;
/** The gap a floated label lifts into, reserved above the control as
 * static padding so the lift is a pure transform, never a layout change. */
const FLOAT_GAP_PX = 22;

/** True once a value exists, whether the field is controlled or not. */
function hasText(value: unknown): boolean {
  return value !== undefined && value !== null && String(value).length > 0;
}

/**
 * Tracks "does this field have a value" independent of whether the caller
 * passes a controlled `value` — needed because autofill can populate an
 * input without ever firing the onChange a controlled parent listens for.
 */
function useFilledTracking(controlledValue: unknown, defaultValue: unknown) {
  const [everFilled, setEverFilled] = useState(() => hasText(defaultValue));
  const isControlled = controlledValue !== undefined;
  const filled = isControlled ? hasText(controlledValue) : everFilled;

  function onAnimationStart(event: AnimationEvent<HTMLElement>) {
    if (event.animationName === "field-autofill-start") setEverFilled(true);
  }

  return { filled, everFilled, setEverFilled, onAnimationStart };
}

function RequiredMark({ required }: { required?: boolean }) {
  return required ? (
    <span className="text-brass-deep" aria-hidden="true">
      {" "}
      *
    </span>
  ) : (
    <span className="normal-case tracking-normal text-ink-3/70"> (optional)</span>
  );
}

/**
 * The floating label itself. Renders as one real `<label>` the whole time —
 * splitting the text into per-letter spans (for the subtle staggered lift)
 * never changes its accessible name, since the DOM text content is still
 * the full word with no `aria-hidden` on any letter.
 */
function FloatingLabel({
  htmlFor,
  text,
  required,
  floated,
  reduced,
  liftPx,
}: {
  htmlFor: string;
  text: string;
  required?: boolean;
  floated: boolean;
  reduced: boolean;
  liftPx: number;
}) {
  const letters = reduced ? null : text.split("");

  return (
    <m.label
      htmlFor={htmlFor}
      initial={false}
      animate={{ y: floated ? -liftPx : 0, scale: floated ? 0.72 : 1 }}
      transition={{ duration: reduced ? 0 : LABEL_TRANSITION_MS, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "left top", top: liftPx }}
      className={cn(
        "pointer-events-none absolute left-0 max-w-[calc(100%-0.5rem)] truncate",
        "select-none font-sans transition-colors duration-200",
        // `scale` below is a paint-time transform — it never affects layout,
        // so at full (16px) font size this can still be wide enough to wrap
        // once floated, in the modal's narrower columns. `truncate` catches
        // that instead of letting a wrapped second line spill into the
        // control below it.
        floated
          ? "uppercase tracking-[0.16em] text-ink-3"
          : "normal-case tracking-normal text-ink-3/70",
      )}
    >
      {letters
        ? letters.map((ch, i) => (
            <m.span
              key={i}
              className="inline-block"
              animate={{ y: floated ? -1 : 0, opacity: floated ? 1 : 0.92 }}
              transition={{
                duration: LABEL_TRANSITION_MS * 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: i * LETTER_STAGGER,
              }}
            >
              {ch === " " ? " " : ch}
            </m.span>
          ))
        : text}
      <RequiredMark required={required} />
    </m.label>
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

/**
 * `type="date"` is deliberately excluded from the floating overlay: native
 * date inputs paint their own always-visible "dd/mm/yyyy" segments, which
 * would sit directly under a resting label and read as overlapping text.
 * Those get the plain static label instead, via `StaticLabel` below.
 */
function isFloatable(type: string | undefined): boolean {
  return type !== "date" && type !== "time" && type !== "datetime-local" && type !== "month";
}

function StaticLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-3"
    >
      {children}
      <RequiredMark required={required} />
    </label>
  );
}

export function TextField({
  label,
  name,
  error,
  hint,
  required,
  className,
  type = "text",
  value,
  defaultValue,
  placeholder,
  onFocus,
  onBlur,
  ...rest
}: BaseProps & React.ComponentProps<"input">) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const reduced = Boolean(useReducedMotion());
  const [focused, setFocused] = useState(false);
  const { filled, onAnimationStart } = useFilledTracking(value, defaultValue);
  const floatable = isFloatable(type);
  const floated = floatable && (focused || filled || Boolean(error));
  // While floatable and at rest, the resting label sits where a native
  // placeholder would render — showing both at once would double up as
  // overlapping text. The example placeholder only appears once focus (and
  // with it, the lifted label) has already cleared that space.
  const visiblePlaceholder = floatable ? (focused ? placeholder : undefined) : placeholder;

  if (!floatable) {
    return (
      <div className={cn("w-full", className)}>
        <StaticLabel htmlFor={id} required={required}>
          {label}
        </StaticLabel>
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(controlStyles, "mt-1")}
          {...rest}
        />
        <Messages error={error} hint={hint} errorId={errorId} hintId={hintId} />
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="relative" style={{ paddingTop: FLOAT_GAP_PX }}>
        <FloatingLabel
          htmlFor={id}
          text={label}
          required={required}
          floated={floated}
          reduced={reduced}
          liftPx={FLOAT_GAP_PX}
        />
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          defaultValue={defaultValue}
          placeholder={visiblePlaceholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={controlStyles}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onAnimationStart={onAnimationStart}
          {...rest}
        />
      </div>
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
  value,
  defaultValue,
  onFocus,
  onBlur,
  ...rest
}: BaseProps & { options: readonly string[]; placeholder?: string } & React.ComponentProps<"select">) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const reduced = Boolean(useReducedMotion());
  const [focused, setFocused] = useState(false);
  const { filled, onAnimationStart } = useFilledTracking(value, defaultValue);
  const floated = focused || filled || Boolean(error);
  // A native <select> always renders its selected option's text in the
  // closed box, even unfocused — unlike an <input>'s placeholder, it can't
  // be suppressed by leaving an attribute unset. At rest (unfloated,
  // nothing selected) that text would sit directly under the resting
  // label, so it's blanked until the label has somewhere else to be.
  const placeholderText = floated ? placeholder : " ";

  return (
    <div className={cn("w-full", className)}>
      <div className="relative" style={{ paddingTop: FLOAT_GAP_PX }}>
        <FloatingLabel
          htmlFor={id}
          text={label}
          required={required}
          floated={floated}
          reduced={reduced}
          liftPx={FLOAT_GAP_PX}
        />
        <select
          id={id}
          name={name}
          required={required}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(controlStyles, "cursor-pointer appearance-none pr-8")}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onAnimationStart={onAnimationStart}
          {...rest}
        >
          <option value="">{placeholderText}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={16}
          style={{ top: FLOAT_GAP_PX + 26 }}
          className="pointer-events-none absolute right-0 -translate-y-1/2 text-ink-3"
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
 * Not a floating-label candidate — there's no "empty vs filled" state to
 * float over, one option is always either selected or not.
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
        <RequiredMark required={required} />
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
  value,
  defaultValue,
  placeholder,
  onFocus,
  onBlur,
  ...rest
}: BaseProps & React.ComponentProps<"textarea">) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const reduced = Boolean(useReducedMotion());
  const [focused, setFocused] = useState(false);
  const { filled, onAnimationStart } = useFilledTracking(value, defaultValue);
  const floated = focused || filled || Boolean(error);
  const visiblePlaceholder = focused ? placeholder : undefined;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative" style={{ paddingTop: FLOAT_GAP_PX }}>
        <FloatingLabel
          htmlFor={id}
          text={label}
          required={required}
          floated={floated}
          reduced={reduced}
          liftPx={FLOAT_GAP_PX}
        />
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          value={value}
          defaultValue={defaultValue}
          placeholder={visiblePlaceholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(controlStyles, "resize-y leading-relaxed")}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onAnimationStart={onAnimationStart}
          {...rest}
        />
      </div>
      <Messages error={error} hint={hint} errorId={errorId} hintId={hintId} />
    </div>
  );
}
