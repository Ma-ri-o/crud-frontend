"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-11-14T16:00:00-06:00").getTime();

function getTimeLeft() {
  const distance = Math.max(0, EVENT_DATE - Date.now());
  return {
    Días: Math.floor(distance / 86_400_000),
    Horas: Math.floor((distance / 3_600_000) % 24),
    Minutos: Math.floor((distance / 60_000) % 60),
    Segundos: Math.floor((distance / 1_000) % 60),
  };
}

export function Countdown() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const update = () => setTime(getTimeLeft());
    update();
    const interval = window.setInterval(update, 1_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-overall px-5 py-20 text-white md:py-28">
      <div className="grid-pattern absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-5xl text-center">
        <motion.span
          className="mb-3 inline-block text-5xl"
          animate={{ rotate: [-10, 10, -10], scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          aria-hidden="true"
        >
          ⏱️
        </motion.span>
        <p className="font-body text-xs font-bold uppercase tracking-[0.28em] text-banana">
          Prepara tu equipo
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-6xl">
          La diversión comienza en...
        </h2>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 md:gap-5">
          {Object.entries(time ?? { Días: 0, Horas: 0, Minutos: 0, Segundos: 0 }).map(
            ([label, value], index) => (
              <motion.div
                key={label}
                className="rounded-[2rem] border-2 border-white/20 bg-white p-5 text-ink shadow-[0_10px_0_rgba(0,0,0,0.12)] md:p-7"
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, rotate: index % 2 ? 2 : -2 }}
                transition={{ type: "spring", delay: index * 0.08 }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.strong
                    key={value}
                    className="block font-display text-4xl font-bold text-overall md:text-6xl"
                    initial={reducedMotion ? { opacity: 1 } : { y: -14, opacity: 0, scale: 0.92 }}
                    animate={reducedMotion ? { opacity: 1 } : { y: [0, -5, 0], opacity: 1, scale: [1, 1.08, 1] }}
                    exit={reducedMotion ? undefined : { y: 14, opacity: 0, scale: 0.92 }}
                    transition={reducedMotion ? { duration: 0.01 } : { duration: 0.45, ease: "easeOut" }}
                  >
                    {String(value).padStart(2, "0")}
                  </motion.strong>
                </AnimatePresence>
                <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-ink/55 md:text-sm">
                  {label}
                </span>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
