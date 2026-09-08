"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { AdminButton, AdminButtonLink } from "@/components/admin/ui/AdminButton";

/**
 * Covers /admin/login and /admin/signup, which sit outside the (dashboard)
 * route group and so aren't covered by its own error.tsx. Same reasoning as
 * that one: an unhandled throw here previously fell through to Next's
 * generic crash screen instead of a readable message.
 */
export default function AdminRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-admin-danger/10">
        <Icon name="close" size={22} className="text-admin-danger" />
      </div>
      <h1 className="text-xl font-semibold text-admin-text">Something went wrong</h1>
      <p className="max-w-sm whitespace-pre-line text-sm text-admin-text-3">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="mt-2 flex items-center gap-3">
        <AdminButton onClick={reset} variant="outline">
          Try again
        </AdminButton>
        <AdminButtonLink href="/admin/login" variant="ghost">
          Back to login
        </AdminButtonLink>
      </div>
    </div>
  );
}
