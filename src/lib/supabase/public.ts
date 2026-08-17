import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * For public, read-only content (destinations/services/testimonials/faqs
 * shown on the live site) — no cookies, no session. Works anywhere,
 * including build-time contexts like generateStaticParams and sitemap.ts,
 * where the cookie-aware SSR client (server.ts) can't run at all since
 * there's no request to read cookies from. RLS already allows anonymous
 * SELECT on these tables, so a session was never needed for this path.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
