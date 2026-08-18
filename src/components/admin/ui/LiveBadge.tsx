"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const POLL_MS = 20_000;

/**
 * Polls /api/admin/analytics/realtime (GA4's realtime report) so the
 * dashboard has one number that's actually moving — everything else on
 * this page is a historical report, refetched only on navigation.
 */
export function LiveBadge({ initialActiveUsers }: { initialActiveUsers: number | null }) {
  const [activeUsers, setActiveUsers] = useState(initialActiveUsers);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/admin/analytics/realtime", { cache: "no-store" });
        if (cancelled || !res.ok) return;
        const data = (await res.json()) as { activeUsers: number | null };
        setActiveUsers((prev) => {
          if (prev !== null && data.activeUsers !== null && data.activeUsers !== prev) {
            setPulse(true);
            setTimeout(() => setPulse(false), 600);
          }
          return data.activeUsers;
        });
      } catch {
        // Silent — this is a background refresh, not worth surfacing an error for.
      }
    }

    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (activeUsers === null) return null;

  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-admin-success/25 bg-admin-success/10 px-4 py-2">
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full bg-admin-success opacity-75",
            "animate-ping",
          )}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-admin-success" />
      </span>
      <span
        className={cn(
          "text-sm font-medium tabular-nums text-admin-success transition-transform duration-300",
          pulse && "scale-110",
        )}
      >
        {activeUsers}
      </span>
      <span className="flex items-center gap-1 text-xs text-admin-text-3">
        <Icon name="activity" size={12} />
        on site right now
      </span>
    </div>
  );
}
