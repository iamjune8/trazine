"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminTextField } from "@/components/admin/ui/AdminField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Icon } from "@/components/ui/Icon";

/**
 * Where Supabase's password-recovery email link lands. The session token
 * arrives in the URL fragment (#access_token=...&type=recovery), which only
 * client-side JS can read — createClient() picks it up automatically on
 * init (detectSessionInUrl defaults to true) and fires a PASSWORD_RECOVERY
 * auth event once it's exchanged. Until that fires, the visitor doesn't
 * have the temporary session this page's submit needs, so the form stays
 * disabled and shows a status message instead of failing silently.
 */

type Status = "checking" | "ready" | "expired" | "submitting" | "success" | "error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setStatus("ready");
    });

    // The recovery event can fire before this listener attaches, so also
    // check for an already-established session on mount.
    supabase.auth.getSession().then(({ data }) => {
      setStatus((current) => (current === "checking" && data.session ? "ready" : current));
    });

    // Give the SDK a moment to process the URL fragment before concluding
    // there's genuinely no valid recovery link.
    const timeout = setTimeout(() => {
      setStatus((current) => (current === "checking" ? "expired" : current));
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 8) {
      setServerError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setServerError("Passwords don't match.");
      return;
    }

    setStatus("submitting");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setServerError(error.message);
      setStatus("ready");
      return;
    }

    setStatus("success");
    await supabase.auth.signOut();
    router.push(
      `/admin/login?message=${encodeURIComponent("Password updated — log in with your new password.")}`,
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-admin-indigo via-admin-violet to-admin-pink text-white">
            <Icon name="sparkle" size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-admin-text">Travel Magazine</p>
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-admin-text-3">
              Control room
            </p>
          </div>
        </div>

        <div className="admin-glass admin-glow-ring rounded-2xl p-7 sm:p-9">
          <h1 className="text-2xl font-semibold text-admin-text">Set a new password</h1>
          <p className="mt-2 text-sm text-admin-text-3">
            You're here from a password reset link — choose a new password below.
          </p>

          {status === "checking" ? (
            <p className="mt-6 rounded-xl border border-admin-border bg-white/[0.03] px-4 py-3 text-sm text-admin-text-3">
              Verifying your reset link…
            </p>
          ) : null}

          {status === "expired" ? (
            <p className="mt-6 rounded-xl border border-admin-danger/25 bg-admin-danger/10 px-4 py-3 text-sm text-admin-danger">
              This reset link is invalid or has expired. Request a new one from the login page.
            </p>
          ) : null}

          {serverError ? (
            <p className="mt-6 rounded-xl border border-admin-danger/25 bg-admin-danger/10 px-4 py-3 text-sm text-admin-danger">
              {serverError}
            </p>
          ) : null}

          {status === "ready" || status === "submitting" || status === "success" ? (
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <AdminTextField
                label="New password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                minLength={8}
              />
              <AdminTextField
                label="Confirm new password"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                minLength={8}
              />
              <AdminButton
                type="submit"
                size="lg"
                className="w-full"
                withArrow
                disabled={status === "submitting" || status === "success"}
              >
                {status === "submitting" ? "Updating…" : "Update password"}
              </AdminButton>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
