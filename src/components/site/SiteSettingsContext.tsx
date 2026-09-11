"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteSettings } from "@/lib/content/siteSettings";

/**
 * Lets client components (Header, the enquiry form/modal, the sticky
 * mobile bar) read the admin-editable phone/email/address without each one
 * fetching it — the root layout fetches once per request and passes it
 * down here. Server components should call `getSiteSettings()` directly
 * instead of this context.
 */
const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  const settings = useContext(SiteSettingsContext);
  if (!settings) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return settings;
}
