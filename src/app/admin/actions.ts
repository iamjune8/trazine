"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

/**
 * Self-service signup, restricted to a single pre-agreed address. Anyone
 * else who finds this URL is rejected before Supabase is even called —
 * ADMIN_EMAIL is the only account this form will ever create.
 */
export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!adminEmail) {
    fail("/admin/signup", "Admin signup isn't configured yet — set ADMIN_EMAIL.");
  }
  if (email !== adminEmail) {
    fail("/admin/signup", "That email isn't authorised to create an admin account.");
  }
  if (password.length < 8) {
    fail("/admin/signup", "Password must be at least 8 characters.");
  }
  if (password !== confirmPassword) {
    fail("/admin/signup", "Passwords don't match.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    fail("/admin/signup", error.message);
  }

  if (data.session) {
    redirect("/admin");
  }

  // Email confirmation is on for this project — signUp succeeded but there's
  // no session yet.
  redirect(
    `/admin/login?message=${encodeURIComponent(
      "Check your inbox to confirm your email, then log in.",
    )}`,
  );
}

export async function logIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    fail("/admin/login", "Incorrect email or password.");
  }

  redirect("/admin");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
