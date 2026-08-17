"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Lets any button anywhere on the site open the enquiry modal, optionally
 * pre-selecting a destination — so "Plan a Dubai journey" on a destination
 * page opens the form with Dubai already chosen.
 */

type OpenOptions = { destination?: string; source?: string };

type EnquiryContextValue = {
  isOpen: boolean;
  destination?: string;
  source?: string;
  open: (options?: OpenOptions) => void;
  close: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [destination, setDestination] = useState<string | undefined>();
  const [source, setSource] = useState<string | undefined>();

  const open = useCallback((options?: OpenOptions) => {
    setDestination(options?.destination);
    setSource(options?.source);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, destination, source, open, close }),
    [isOpen, destination, source, open, close],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry(): EnquiryContextValue {
  const ctx = useContext(EnquiryContext);
  if (!ctx) {
    throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  }
  return ctx;
}
