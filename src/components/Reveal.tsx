"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
};

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = direction === "up" ? { y: 40 } : { x: direction === "left" ? -40 : 40 };

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, filter: "blur(8px)", ...offset }}
      whileInView={{ opacity: 1, filter: "blur(0px)", x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  light = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  light?: boolean;
}) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
      <span
        className={`mb-3 inline-flex rounded-full px-4 py-2 font-body text-xs font-bold uppercase tracking-[0.2em] ${
          light ? "bg-white/15 text-banana" : "bg-banana/25 text-overall"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`font-display text-4xl font-bold leading-[1.05] md:text-6xl ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {copy && (
        <p className={`mt-4 text-base leading-relaxed md:text-lg ${light ? "text-white/75" : "text-ink/65"}`}>
          {copy}
        </p>
      )}
    </Reveal>
  );
}
