import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRealtimeActiveUsers } from "@/lib/analytics/ga4";

/**
 * Polled by the live-users badge on /admin/analytics. The proxy (src/proxy.ts)
 * only gates /admin page routes, not /api — this route checks the session
 * itself so realtime traffic numbers can't be scraped by a signed-out visitor.
 */
export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activeUsers = await getRealtimeActiveUsers();
  return NextResponse.json({ activeUsers });
}
