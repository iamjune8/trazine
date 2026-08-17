import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

/**
 * Refreshes the Supabase session cookie on every request and gates every
 * /admin route behind a logged-in user. Runs in src/proxy.ts (Next.js 16
 * renamed `middleware` to `proxy` — see AGENTS.md).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Don't hoist this into a module-level singleton — with Fluid compute a
  // shared client can leak session state across requests. Create a fresh
  // one per request instead.
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not add code between createServerClient and getClaims() — anything
  // here risks skipping the token refresh and randomly logging users out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/admin/login") ||
    request.nextUrl.pathname.startsWith("/admin/signup");

  if (isAdminRoute && !isAuthRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Already signed in — no reason to see the login/signup screens again.
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
