"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin banana-colored progress bar that fills as the guest scrolls through the invitation. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[90] h-1.5 w-full origin-left bg-gradient-to-r from-banana via-orange to-overall"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
