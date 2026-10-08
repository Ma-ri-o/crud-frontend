"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Banana = {
  id: number;
  left: string;
  delay: number;
  duration: number;
  size: number;
  sway: number;
};

/** Continuous banana rain used to close the celebration in style. */
export function BananaRain({ count = 22 }: { count?: number }) {
  const bananas = useMemo<Banana[]>(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: `${(index / count) * 100 + Math.random() * 4}%`,
        delay: Math.random() * 5,
        duration: 4.5 + Math.random() * 3.5,
        size: 1.6 + Math.random() * 1.6,
        sway: 18 + Math.random() * 24,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {bananas.map((banana) => (
        <motion.span
          key={banana.id}
          className="absolute top-[-10%] block drop-shadow-lg"
          style={{ left: banana.left, fontSize: `${banana.size}rem` }}
          animate={{
            y: ["0vh", "120vh"],
            x: [0, banana.sway, -banana.sway, 0],
            rotate: [0, 180, 360, 520],
          }}
          transition={{ duration: banana.duration, delay: banana.delay, repeat: Infinity, ease: "linear" }}
        >
          🍌
        </motion.span>
      ))}
    </div>
  );
}
