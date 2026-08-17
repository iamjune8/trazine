"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

/**
 * FAQ accordion — progressive disclosure rather than a wall of text.
 *
 * Built on real <button> elements inside headings, so keyboard and screen
 * reader behaviour comes for free: Tab to reach, Enter/Space to toggle,
 * `aria-expanded` announcing state. The height animation uses AnimatePresence
 * on a grid-rows trick so it stays smooth without animating `height` directly.
 */

export type AccordionItem = { question: string; answer: string };

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;

        return (
          <div key={item.question} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  "group flex w-full cursor-pointer items-start justify-between gap-6",
                  "py-6 text-left transition-colors duration-200 hover:text-brass-deep",
                  isOpen && "text-brass-deep",
                )}
              >
                <span className="font-display text-lg leading-snug sm:text-xl">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "mt-1 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isOpen && "rotate-180",
                  )}
                >
                  <Icon name="chevron-down" size={20} />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.34, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.22 },
                  }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 text-ink-2">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
