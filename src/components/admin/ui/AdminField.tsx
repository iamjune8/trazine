"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

type BaseProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

const controlStyles =
  "w-full min-h-[46px] rounded-xl border border-admin-border bg-white/[0.03] px-3.5 py-2.5 " +
  "font-sans text-sm text-admin-text placeholder:text-admin-text-3 " +
  "transition-[border-color,box-shadow] duration-200 " +
  "hover:border-admin-border-soft focus:border-admin-violet/60 focus:outline-none " +
  "focus:shadow-[0_0_0_3px_rgba(139,92,246,0.18)] " +
  "aria-[invalid=true]:border-admin-danger/70";

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
      className="block text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-admin-text-3"
    >
      {children}
      {required ? <span className="text-admin-pink"> *</span> : null}
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
      <p id={errorId} className="mt-2 flex items-start gap-1.5 text-xs text-admin-danger" role="alert">
        <Icon name="close" size={13} className="mt-0.5 shrink-0" />
        <span>{error}</span>
      </p>
    );
  }
  if (hint) {
    return (
      <p id={hintId} className="mt-2 whitespace-pre-line text-xs leading-relaxed text-admin-text-3">
        {hint}
      </p>
    );
  }
  return null;
}

export function AdminTextField({
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
        className={cn(controlStyles, "mt-1.5")}
        {...rest}
      />
      <Messages error={error} hint={hint} errorId={errorId} hintId={hintId} />
    </div>
  );
}

export function AdminTextAreaField({
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
        className={cn(controlStyles, "mt-1.5 resize-y leading-relaxed")}
        {...rest}
      />
      <Messages error={error} hint={hint} errorId={errorId} hintId={hintId} />
    </div>
  );
}

export function AdminSelectField({
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
      <div className="relative mt-1.5">
        <select
          id={id}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(controlStyles, "cursor-pointer appearance-none pr-9")}
          {...rest}
        >
          <option value="" className="bg-admin-surface-2">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-admin-surface-2">
              {option}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-admin-text-3"
        />
      </div>
      <Messages error={error} hint={hint} errorId={errorId} hintId={hintId} />
    </div>
  );
}

export function AdminCheckboxField({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm text-admin-text-2">
        <input
          id={id}
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="h-5 w-5 cursor-pointer rounded-md border border-admin-border bg-white/5 accent-admin-violet"
        />
        {label}
      </label>
      {hint ? <p className="mt-1.5 pl-8 text-xs text-admin-text-3">{hint}</p> : null}
    </div>
  );
}
