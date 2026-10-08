"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { playGiggle } from "./sound";
import { getSoundPreference } from "./soundPreference";

const EYE_PHRASES = ["¡Bananaaa! 🍌", "Poopaye! 👋", "¡Me viste parpadear!", "Bee-do bee-do! 🚨"];

export function AgentCharacter({
  className = "",
  delay = 0,
  variant = "one",
  pointing = false,
}: {
  className?: string;
  delay?: number;
  variant?: "one" | "two";
  pointing?: boolean;
}) {
  const [wink, setWink] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  const handleEyeClick = () => {
    if (getSoundPreference()) playGiggle();
    setWink(EYE_PHRASES[Math.floor(Math.random() * EYE_PHRASES.length)]);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setWink(null), 1600);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ y: 90, opacity: 0, rotate: variant === "one" ? -8 : 8 }}
      animate={reducedMotion ? { y: 0, opacity: 1, rotate: variant === "one" ? -3 : 3 } : { y: [0, -10, 0], opacity: 1, rotate: variant === "one" ? -3 : 3 }}
      transition={{
        opacity: { duration: reducedMotion ? 0.01 : 0.5, delay },
        y: { duration: reducedMotion ? 0.01 : 3.5, repeat: reducedMotion ? 0 : Infinity, delay },
        rotate: { duration: reducedMotion ? 0.01 : 0.7, delay },
      }}
    >
      <div className="relative h-52 w-32 md:h-72 md:w-44">
        <span className="absolute left-1/2 top-[-8px] h-8 w-1 -translate-x-4 -rotate-12 rounded-full bg-ink" />
        <span className="absolute left-1/2 top-[-10px] h-9 w-1 rotate-6 rounded-full bg-ink" />
        <span className="absolute left-1/2 top-[-7px] h-7 w-1 translate-x-4 rotate-12 rounded-full bg-ink" />
        <div className="absolute inset-x-2 top-0 h-[82%] rounded-[48%_48%_38%_38%] border-4 border-ink bg-banana shadow-[0_24px_45px_rgba(22,93,171,0.28)]">
          <div className="absolute left-0 right-0 top-[25%] h-5 bg-ink" />
          <button
            type="button"
            onClick={handleEyeClick}
            className={`absolute left-1/2 top-[16%] z-10 flex -translate-x-1/2 cursor-pointer items-center justify-center ${
              variant === "two" ? "h-14 w-24 gap-0 md:h-[4.5rem] md:w-32" : "h-16 w-16 md:h-20 md:w-20"
            }`}
            aria-label="Easter egg: toca el ojo del Minion"
          >
            {Array.from({ length: variant === "two" ? 2 : 1 }).map((_, eye) => (
              <span
                key={eye}
                className="relative aspect-square h-full rounded-full border-[6px] border-slate-500 bg-slate-200 shadow-[inset_0_0_0_3px_#94a3b8,0_3px_0_rgba(51,51,51,0.35)]"
              >
                <span className="absolute inset-[15%] rounded-full bg-white">
                  <span className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-800 bg-[#7A4B21]">
                    <span className="absolute inset-[24%] rounded-full bg-ink">
                      <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                  </span>
                </span>
              </span>
            ))}
            <AnimatePresence>
              {wink && (
                <motion.span
                  className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-2xl border-2 border-ink bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-[3px_3px_0_#333]"
                  initial={{ opacity: 0, y: 8, scale: 0.8 }}
                  animate={{ opacity: 1, y: -8, scale: 1 }}
                  exit={{ opacity: 0, y: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  {wink}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <div className="absolute left-1/2 top-[54%] h-5 w-10 -translate-x-1/2 overflow-hidden rounded-b-full border-b-4 border-ink bg-white">
            <span className="absolute inset-x-0 top-0 h-1 bg-ink/20" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[38%] rounded-b-[35%] border-t-4 border-ink bg-overall">
            <div className="absolute left-1/2 top-3 flex h-10 w-14 -translate-x-1/2 items-center justify-center rounded-md border-2 border-white/30 bg-overall">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink/50 bg-banana text-[9px] font-black text-overall">
                B
              </span>
            </div>
            <div className="absolute bottom-2 left-2 h-5 w-4 rounded border-2 border-white/30" />
            <div className="absolute bottom-2 right-2 h-5 w-4 rounded border-2 border-white/30" />
            <div className="absolute -top-7 left-2 h-10 w-5 rotate-[-24deg] rounded-full bg-overall" />
            <div className="absolute -top-7 right-2 h-10 w-5 rotate-[24deg] rounded-full bg-overall" />
          </div>
        </div>
        <div className="absolute -left-3 top-[58%] h-5 w-14 rotate-[25deg] rounded-full border-4 border-ink bg-banana">
          <span className="absolute -left-3 -top-2 h-8 w-7 rounded-full bg-ink" />
        </div>
        <motion.div
          className="absolute -right-3 top-[55%] h-5 w-14 rounded-full border-4 border-ink bg-banana"
          animate={pointing ? { rotate: [-30, 45, 35], x: [0, 8, 6], y: [0, 10, 8] } : { rotate: -30, x: 0, y: 0 }}
          transition={pointing ? { duration: 0.55, ease: "easeOut" } : { duration: 0.2 }}
        >
          <span className="absolute -right-3 -top-2 h-8 w-7 rounded-full bg-ink" />
        </motion.div>
        <div className="absolute bottom-0 left-5 h-12 w-8 rounded-b-xl bg-ink">
          <span className="absolute -left-2 bottom-0 h-4 w-10 rounded-full bg-ink" />
        </div>
        <div className="absolute bottom-0 right-5 h-12 w-8 rounded-b-xl bg-ink">
          <span className="absolute bottom-0 right-[-8px] h-4 w-10 rounded-full bg-ink" />
        </div>
      </div>
    </motion.div>
  );
}
