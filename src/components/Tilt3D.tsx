"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

/**
 * Lightweight 3D tilt wrapper: follows the pointer with a subtle
 * perspective rotation. No-ops when the user prefers reduced motion.
 */
export function Tilt3D({
  children,
  className = "",
  strength = 10,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [strength, -strength]), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-strength, strength]), { stiffness: 220, damping: 20 });

  if (reduceMotion) {
    return <div className={`h-full ${className}`}>{children}</div>;
  }

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div
      className={`h-full ${className}`}
      style={{ perspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div className="h-full" style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </div>
  );
}
