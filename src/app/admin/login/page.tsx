import type { Metadata } from "next";
import Link from "next/link";
import { AdminTextField } from "@/components/admin/ui/AdminField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Icon } from "@/components/ui/Icon";
import { logIn } from "../actions";

export const metadata: Metadata = { title: "Log in" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string; message?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error, message } = await searchParams;

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
          <h1 className="text-2xl font-semibold text-admin-text">Welcome back</h1>
          <p className="mt-2 text-sm text-admin-text-3">Sign in to manage the live site.</p>

          {message ? (
            <p className="mt-6 rounded-xl border border-admin-cyan/25 bg-admin-cyan/10 px-4 py-3 text-sm text-admin-cyan">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="mt-6 rounded-xl border border-admin-danger/25 bg-admin-danger/10 px-4 py-3 text-sm text-admin-danger">
              {error}
            </p>
          ) : null}

          <form action={logIn} className="mt-7 space-y-5">
            <AdminTextField label="Email" name="email" type="email" required autoComplete="email" />
            <AdminTextField
              label="Password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
            <AdminButton type="submit" size="lg" className="w-full" withArrow>
              Log in
            </AdminButton>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-admin-text-3">
          No account yet?{" "}
          <Link href="/admin/signup" className="font-medium text-admin-violet hover:text-admin-pink">
            Create the admin account
          </Link>
        </p>
      </div>
    </div>
  );
}
