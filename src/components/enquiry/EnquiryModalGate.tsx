"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useEnquiry } from "./EnquiryContext";

const EnquiryModal = dynamic(
  () => import("./EnquiryModal").then((mod) => mod.EnquiryModal),
  { ssr: false },
);

/**
 * The modal itself (form + motion/react) is closed on every page load, so
 * there's no reason to ship its JS on every page load either. This defers
 * that bundle until a visitor actually opens the modal for the first time,
 * then leaves it mounted so its own close animation still plays.
 */
export function EnquiryModalGate() {
  const { isOpen } = useEnquiry();
  const [everOpened, setEverOpened] = useState(false);

  useEffect(() => {
    if (isOpen) setEverOpened(true);
  }, [isOpen]);

  if (!everOpened) return null;
  return <EnquiryModal />;
}
