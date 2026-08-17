"use client";

/** A submit button that confirms before letting its parent form submit. */
export function DeleteButton({
  confirmText = "Delete this? This can't be undone.",
  children = "Delete",
}: {
  confirmText?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className="cursor-pointer text-sm font-medium text-danger underline decoration-danger/40 underline-offset-4 transition-colors duration-200 hover:decoration-danger"
    >
      {children}
    </button>
  );
}
