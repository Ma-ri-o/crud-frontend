"use client";

import { motion, useReducedMotion, useScroll, useTransform, type HTMLMotionProps } from "framer-motion";
import { useRef, type ReactNode } from "react";

export type MotionPreset = "fadeUp" | "fadeDown" | "slideLeft" | "slideRight" | "zoomIn";
const offsets: Record<MotionPreset, { x?: number; y?: number; scale?: number }> = {
  fadeUp: { y: 26 }, fadeDown: { y: -26 }, slideLeft: { x: 28 }, slideRight: { x: -28 }, zoomIn: { scale: 0.94 }
};

export function useReveal(preset: MotionPreset = "fadeUp") {
  const reduced = useReducedMotion();
  return {
    initial: reduced ? { opacity: 0 } : { opacity: 0, ...offsets[preset] },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: reduced ? 0.01 : 0.65, ease: [0.22, 1, 0.36, 1] as const }
  };
}

export function ScrollReveal({ children, className, preset = "fadeUp", delay = 0 }: { children: ReactNode; className?: string; preset?: MotionPreset; delay?: number }) {
  const reveal = useReveal(preset);
  return <motion.div className={className} {...reveal} transition={{ ...reveal.transition, delay }}>{children}</motion.div>;
}

function Preset({ children, ...props }: HTMLMotionProps<"div"> & { preset: MotionPreset }) {
  const { preset, ...motionProps } = props;
  const reveal = useReveal(preset);
  return <motion.div {...reveal} {...motionProps}>{children}</motion.div>;
}

export const FadeUp = (props: Omit<HTMLMotionProps<"div">, "initial" | "animate">) => <Preset {...props} preset="fadeUp" />;
export const FadeDown = (props: Omit<HTMLMotionProps<"div">, "initial" | "animate">) => <Preset {...props} preset="fadeDown" />;
export const SlideLeft = (props: Omit<HTMLMotionProps<"div">, "initial" | "animate">) => <Preset {...props} preset="slideLeft" />;
export const SlideRight = (props: Omit<HTMLMotionProps<"div">, "initial" | "animate">) => <Preset {...props} preset="slideRight" />;
export const ZoomIn = (props: Omit<HTMLMotionProps<"div">, "initial" | "animate">) => <Preset {...props} preset="zoomIn" />;

export function Parallax({ children, className, distance = 50 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const reduced = useReducedMotion();
  return <motion.div ref={ref} className={className} style={{ y: reduced ? 0 : y }}>{children}</motion.div>;
}
