"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { playGiggle } from "./sound";
import { getSoundPreference } from "./soundPreference";

const confetti = Array.from({ length: 48 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  delay: (index % 9) * 0.18,
  color: ["#FFD500", "#165DAB", "#FF9E00", "#FFFFFF"][index % 4],
  rotate: (index * 43) % 180,
}));

export function HeroDecor() {
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();
  const cloudX = useTransform(scrollY, [0, 700], [0, 100]);
  const balloonY = useTransform(scrollY, [0, 700], [0, -130]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.72),transparent_28%),linear-gradient(135deg,rgba(255,213,0,0.18),transparent_45%,rgba(22,93,171,0.2))]" />
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,rgba(22,93,171,0.45)_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      <motion.div className="cloud -left-20 top-28 scale-75 md:left-[7%]" style={{ x: cloudX }} />
      <motion.div className="cloud right-[-50px] top-44 scale-50 md:right-[10%]" style={{ x: cloudX }} />
      {[
        { position: "left-[2%] top-[12%] md:left-[7%]", balloons: "🎈🎈" },
        { position: "right-[2%] top-[8%] md:right-[8%]", balloons: "🎈🎈🎈" },
        { position: "left-[3%] bottom-[15%] hidden md:block", balloons: "🎈" },
        { position: "right-[3%] bottom-[18%] hidden md:block", balloons: "🎈🎈" },
      ].map((cluster, index) => (
        <motion.div
          key={cluster.position}
          className={`absolute text-5xl drop-shadow-lg md:text-7xl ${cluster.position}`}
          style={{ y: balloonY }}
          animate={reducedMotion ? undefined : { rotate: index % 2 ? [5, -5, 5] : [-5, 5, -5] }}
          transition={{ duration: 3.4 + index * 0.35, repeat: Infinity }}
        >
          {cluster.balloons}
        </motion.div>
      ))}
      {["🍌", "🍌", "⭐", "🍌"].map((item, index) => (
        <motion.span
          key={`${item}-${index}`}
          className={`absolute text-4xl drop-shadow-md md:text-5xl ${index > 1 ? "hidden md:block" : ""}`}
          style={{ left: `${15 + index * 23}%`, top: `${10 + (index % 2) * 62}%` }}
          animate={reducedMotion ? undefined : { y: [-8, 10, -8], rotate: [-12, 12, -12] }}
          transition={{ duration: 3.8 + index * 0.4, repeat: Infinity }}
        >
          {item}
        </motion.span>
      ))}
      {confetti.map((piece) => (
        <motion.span
          key={piece.id}
          className={`absolute top-[-20px] h-3 w-2 rounded-sm ${piece.id > 23 ? "hidden md:block" : "block"}`}
          style={{ left: piece.left, backgroundColor: piece.color }}
          initial={{ y: -20, rotate: piece.rotate, opacity: 1 }}
          animate={reducedMotion ? undefined : { y: ["0vh", "105vh"], rotate: piece.rotate + 560, opacity: [1, 1, 0] }}
          transition={{ duration: 5 + (piece.id % 4), delay: piece.delay, ease: "linear", repeat: Infinity }}
        />
      ))}
      {["12%", "32%", "66%", "86%"].map((left, index) => (
        <motion.span
          key={left}
          className="absolute bottom-[-30px] h-5 w-5 rounded-full border-2 border-white/50 bg-white/15"
          style={{ left }}
          animate={reducedMotion ? undefined : { y: [0, -800], x: [0, index % 2 ? 28 : -20], opacity: [0, 0.8, 0] }}
          transition={{ duration: 8 + index, repeat: Infinity, delay: index * 1.3 }}
        />
      ))}
    </div>
  );
}

const BANANA_PHRASES = ["¡Encontraste una banana secreta! 🍌", "¡Bananaaa!", "Energía de agente +10"];

export function BananaFloat({ className = "" }: { className?: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const handleClick = () => {
    if (getSoundPreference()) playGiggle();
    setMessage(BANANA_PHRASES[Math.floor(Math.random() * BANANA_PHRASES.length)]);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setMessage(null), 1700);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={`absolute cursor-pointer text-5xl drop-shadow-lg ${className}`}
      animate={{ y: [-10, 12, -10], rotate: [-12, 10, -12] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      aria-label="Easter egg: banana secreta"
    >
      🍌
      <AnimatePresence>
        {message && (
          <motion.span
            className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-2xl border-2 border-ink bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-[3px_3px_0_#333]"
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            {message}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
