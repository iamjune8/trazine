import type { Metadata } from "next";
import Link from "next/link";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { logIn } from "../actions";

export const metadata: Metadata = { title: "Log in" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string; message?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error, message } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="eyebrow">Travel Magazine</p>
        <h1 className="font-display mt-3 text-3xl text-ink">Admin log in</h1>

        {message ? (
          <p className="mt-6 border-l-2 border-brass bg-paper-2 px-4 py-3 text-sm text-ink-2">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-6 border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <form action={logIn} className="mt-8 space-y-6">
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
          <Button type="submit" size="lg" className="w-full">
            Log in
          </Button>
        </form>

        <p className="mt-8 text-sm text-ink-3">
          No account yet?{" "}
          <Link href="/admin/signup" className="link-underline text-brass-deep">
            Create the admin account
          </Link>
        </p>
      </div>
    </div>
  );
}
