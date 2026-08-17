import type { Metadata } from "next";
import Link from "next/link";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { signUp } from "../actions";

export const metadata: Metadata = { title: "Create admin account" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminSignupPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="eyebrow">Travel Magazine</p>
        <h1 className="font-display mt-3 text-3xl text-ink">
          Create the admin account
        </h1>
        <p className="mt-3 text-sm text-ink-2">
          This works once, for the one address authorised to manage this
          site. Everyone else who submits this form is turned away.
        </p>

        {error ? (
          <p className="mt-6 border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <form action={signUp} className="mt-8 space-y-6">
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
            autoComplete="new-password"
            hint="At least 8 characters."
          />
          <TextField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
          />
          <Button type="submit" size="lg" className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-8 text-sm text-ink-3">
          Already have an account?{" "}
          <Link href="/admin/login" className="link-underline text-brass-deep">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
