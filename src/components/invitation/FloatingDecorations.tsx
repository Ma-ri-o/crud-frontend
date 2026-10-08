"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInvitationTheme } from "@/components/invitation/ThemeProvider";
import { themes } from "@/lib/themes";

export function FloatingDecorations({ confetti = false, count = 45 }: { confetti?: boolean; count?: number }) {
  const theme = useInvitationTheme();
  const reduced = useReducedMotion();
  const symbols = themes[theme].decoration;
  if (reduced) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {symbols.map((symbol, index) => <motion.span key={`${symbol}-${index}`} className="decoration-spark" style={{ left: `${9 + index * 37}%`, top: `${13 + (index % 3) * 31}%` }} animate={{ y: [0, -9, 0], rotate: [0, 10, 0], opacity: [0.25, 0.75, 0.25] }} transition={{ duration: 5 + index, repeat: Infinity, delay: index * 0.45 }}>{symbol}</motion.span>)}
      {confetti && Array.from({ length: Math.min(Math.max(count, 0), 120) }, (_, index) => <motion.i key={index} className="confetti-piece" style={{ left: `${(index * 37) % 100}%`, backgroundColor: ["var(--event-primary)", "var(--event-accent)", "#e8a8a8"][index % 3] }} initial={{ y: -24, opacity: 0, rotate: 0 }} animate={{ y: ["0vh", "110vh"], opacity: [0, 1, 0.85, 0], rotate: [0, 240 + index * 11] }} transition={{ duration: 5 + (index % 4), delay: (index % 22) * 0.13 }} />)}
    </div>
  );
}
