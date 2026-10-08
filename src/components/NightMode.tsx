"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "invitacion-modo-nocturno";
const NIGHT_START_HOUR = 19;
const NIGHT_END_HOUR = 7;

function isNightTime(date = new Date()) {
  const hour = date.getHours();
  return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;
}

/**
 * Detects the time of day automatically and applies a soft night tint
 * (stars + moon + a navy overlay) to the whole page. Guests can still
 * tap the toggle to override the automatic choice.
 */
export function NightMode() {
  const [night, setNight] = useState<boolean | null>(null);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "1" || stored === "0") {
      setAuto(false);
      setNight(stored === "1");
    } else {
      setAuto(true);
      setNight(isNightTime());
    }
  }, []);

  useEffect(() => {
    if (!auto) return;
    const interval = window.setInterval(() => setNight(isNightTime()), 60_000);
    return () => window.clearInterval(interval);
  }, [auto]);

  useEffect(() => {
    if (night === null) return;
    document.documentElement.classList.toggle("dark", night);
  }, [night]);

  const stars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        top: `${Math.random() * 70}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 3,
        size: 1 + Math.random() * 2,
      })),
    [],
  );

  if (night === null) return null;

  const toggle = () => {
    const next = !night;
    setAuto(false);
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    setNight(next);
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="fixed right-4 top-20 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-ink text-white shadow-lg transition-transform hover:scale-110 md:right-6 md:top-[4.75rem]"
        aria-label={night ? "Activar modo día" : "Activar modo noche"}
        title={night ? "Modo noche · toca para modo día" : "Modo día · toca para modo noche"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={night ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            className="flex"
          >
            {night ? <Moon size={20} /> : <Sun size={20} />}
          </motion.span>
        </AnimatePresence>
      </button>

      <div
        className={`pointer-events-none fixed inset-0 z-[6] bg-[radial-gradient(circle_at_top,rgba(11,21,54,0.05),rgba(4,8,22,0.55))] mix-blend-multiply transition-opacity duration-[1500ms] ${
          night ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{ duration: 2.4 + star.delay, repeat: Infinity, delay: star.delay }}
          />
        ))}
        <motion.span
          className="absolute right-[8%] top-[6%] text-4xl md:text-5xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          🌙
        </motion.span>
      </div>
    </>
  );
}
