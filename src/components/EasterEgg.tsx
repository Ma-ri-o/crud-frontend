"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useRef, useState } from "react";
import { getSoundPreference } from "./soundPreference";
import { playGiggle } from "./sound";

const DEFAULT_PHRASES = [
  "¡Bananaaa! 🍌",
  "Poopaye! 👋",
  "Tulaliloo ti amo 💛",
  "¡Encontraste un secreto de agente!",
  "Bee-do bee-do! 🚨",
];

/**
 * Wraps any element with a hidden surprise: clicking it pops a speech
 * bubble with a silly phrase (and an optional giggle sound).
 */
export function EasterEgg({
  children,
  phrases = DEFAULT_PHRASES,
  className = "",
}: {
  children: ReactNode;
  phrases?: string[];
  className?: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const handleClick = () => {
    if (getSoundPreference()) playGiggle();
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    setMessage(phrase);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setMessage(null), 1800);
  };

  return (
    <span
      className={`relative inline-block cursor-pointer select-none ${className}`}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {children}
      <AnimatePresence>
        {message && (
          <motion.span
            className="pointer-events-none absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-2xl border-2 border-ink bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-[3px_3px_0_#333]"
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            {message}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
