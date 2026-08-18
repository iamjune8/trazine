import type { Metadata } from "next";
import Link from "next/link";
import { AdminTextField } from "@/components/admin/ui/AdminField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Icon } from "@/components/ui/Icon";
import { signUp } from "../actions";

export const metadata: Metadata = { title: "Create admin account" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminSignupPage({ searchParams }: Props) {
  const { error } = await searchParams;

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
          <h1 className="text-2xl font-semibold text-admin-text">Create the admin account</h1>
          <p className="mt-2 text-sm leading-relaxed text-admin-text-3">
            This works once, for the one address authorised to manage this site. Everyone else
            who submits this form is turned away.
          </p>

          {error ? (
            <p className="mt-6 rounded-xl border border-admin-danger/25 bg-admin-danger/10 px-4 py-3 text-sm text-admin-danger">
              {error}
            </p>
          ) : null}

          <form action={signUp} className="mt-7 space-y-5">
            <AdminTextField label="Email" name="email" type="email" required autoComplete="email" />
            <AdminTextField
              label="Password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              hint="At least 8 characters."
            />
            <AdminTextField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
            />
            <AdminButton type="submit" size="lg" className="w-full" withArrow>
              Create account
            </AdminButton>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-admin-text-3">
          Already have an account?{" "}
          <Link href="/admin/login" className="font-medium text-admin-violet hover:text-admin-pink">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
