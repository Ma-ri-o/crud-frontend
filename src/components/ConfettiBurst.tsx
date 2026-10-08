"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#FFD500", "#165DAB", "#FF9E00", "#FFFFFF", "#7DD3FC"];

type Piece = {
  id: number;
  left: string;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
  drift: number;
};

/**
 * One-shot confetti burst used right when the guest enters the invitation.
 * Mount with a changing `burstKey` to replay it (e.g. after the intro gate).
 */
export function ConfettiBurst({ count = 70 }: { count?: number }) {
  const reducedMotion = useReducedMotion();
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        color: COLORS[index % COLORS.length],
        size: 6 + Math.random() * 8,
        delay: Math.random() * 0.4,
        duration: 2.4 + Math.random() * 1.6,
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 220,
      })),
    [count],
  );

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-[-5%] block rounded-sm"
          style={{
            left: piece.left,
            width: piece.size,
            height: piece.size * 0.4,
            backgroundColor: piece.color,
          }}
          initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: "110vh",
            x: piece.drift,
            rotate: piece.rotate + 480,
            opacity: [1, 1, 0.9, 0],
          }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
