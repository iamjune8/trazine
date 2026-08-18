"use client";

import { Icon } from "@/components/ui/Icon";

export function AdminDeleteButton({
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
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-admin-danger/30 px-4 py-2.5 text-sm font-medium text-admin-danger transition-colors duration-200 hover:bg-admin-danger/10"
    >
      <Icon name="close" size={14} />
      {children}
    </button>
  );
}
