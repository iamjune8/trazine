"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { AdminButton } from "@/components/admin/ui/AdminButton";

/**
 * Catches errors thrown by admin pages and server actions (e.g. a duplicate
 * slug or a Supabase constraint violation from createPackage/updatePackage)
 * so the admin sees the actual message instead of Next.js's generic
 * unhandled-error screen.
 */
export default function AdminError({
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
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-admin-danger/10">
        <Icon name="close" size={22} className="text-admin-danger" />
      </div>
      <h1 className="text-xl font-semibold text-admin-text">Something went wrong</h1>
      <p className="whitespace-pre-line text-sm text-admin-text-3">
        {error.message || "An unexpected error occurred."}
      </p>
      <AdminButton onClick={reset} variant="outline">
        Try again
      </AdminButton>
    </div>
  );
}
