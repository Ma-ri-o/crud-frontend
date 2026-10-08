"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const BLOBS = [
  { className: "left-[-10%] top-[-10%] h-72 w-72 md:h-96 md:w-96", color: "rgba(255,255,255,0.28)", duration: 11 },
  { className: "right-[-12%] top-[20%] h-64 w-64 md:h-[26rem] md:w-[26rem]", color: "rgba(22,93,171,0.22)", duration: 14 },
  { className: "left-[20%] bottom-[-18%] h-72 w-72 md:h-80 md:w-80", color: "rgba(255,158,0,0.2)", duration: 16 },
];

/**
 * Soft, continuously drifting blurred blobs used to give sections a
 * premium "alive" background instead of a static flat color.
 */
export function AnimatedBackground({ className = "" }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const animateBlobs = !reducedMotion && !isMobile;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {BLOBS.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          style={{ backgroundColor: blob.color }}
          animate={
            animateBlobs
              ? {
                  x: [0, index % 2 ? 40 : -40, 0],
                  y: [0, index % 2 ? -30 : 30, 0],
                  scale: [1, 1.08, 1],
                }
              : { x: 0, y: 0, scale: 1 }
          }
          transition={animateBlobs ? { duration: blob.duration, repeat: Infinity, ease: "easeInOut" } : { duration: 0.01 }}
        />
      ))}
    </div>
  );
}
