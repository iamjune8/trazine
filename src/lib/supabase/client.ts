import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/** For Client Components — the admin panel's interactive forms. */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
