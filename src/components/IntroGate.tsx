"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Rocket, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AgentCharacter } from "./AgentCharacter";
import { playBananaJingle } from "./sound";
import { getSoundPreference, setSoundPreference } from "./soundPreference";

/**
 * Full-screen animated gate: a Minion stands over a giant glowing button.
 * Tapping it plays an optional "Banana" jingle, runs a short press
 * animation, then hands control back to the parent via `onStart`.
 */
export function IntroGate({ onStart }: { onStart: () => void }) {
  const [soundOn, setSoundOn] = useState(true);
  const [pressed, setPressed] = useState(false);
  const [pointing, setPointing] = useState(false);
  const reducedMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        x: `${(index * 37) % 100}%`,
        y: `${20 + ((index * 23) % 65)}%`,
        color: index % 2 ? "#FFD500" : "#7DD3FC",
        size: 4 + (index % 4) * 2,
        drift: (index % 2 ? 1 : -1) * (30 + (index % 5) * 12),
      })),
    [],
  );

  useEffect(() => {
    setSoundOn(getSoundPreference());
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setPointing(true);
      return;
    }

    const timer = window.setTimeout(() => setPointing(true), 2_400);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundPreference(next);
  };

  const handlePress = () => {
    if (pressed) return;
    setPressed(true);
    if (soundOn) playBananaJingle();
    window.setTimeout(onStart, 950);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #87CEEB 0%, #FFD500 55%, #165DAB 100%)",
        backgroundSize: "220% 220%",
      }}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1, backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        backgroundPosition: { duration: 14, repeat: Infinity, ease: "linear" },
      }}
      exit={{
        opacity: 0,
        scale: 1.16,
        filter: "blur(10px)",
        transition: { duration: reducedMotion ? 0.01 : 0.85, ease: [0.76, 0, 0.24, 1] },
      }}
    >
      {/* slow drifting blobs for continuous background movement */}
      <motion.div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/25 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-overall/25 blur-3xl"
        animate={{ x: [0, -35, 0], y: [0, -25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={toggleSound}
        className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-ink/80 text-white shadow-lg transition-transform hover:scale-110 md:right-8 md:top-8"
        aria-label={soundOn ? "Desactivar sonido de bienvenida" : "Activar sonido de bienvenida"}
        title={soundOn ? "Sonido activado" : "Sonido desactivado"}
      >
        {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      <motion.div
        className="mb-2 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-overall shadow-[4px_4px_0_#333]"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <Rocket size={15} />
        Misión Cumple Emiliano Ulises
      </motion.div>

      <motion.div
        initial={reducedMotion ? { x: 0 } : { x: "-110vw" }}
        animate={pressed ? { x: 0, y: [-2, -28, 0], scale: [1, 1.05, 1] } : { x: 0, y: [0, -4, 0] }}
        transition={
          pressed
            ? { duration: reducedMotion ? 0.01 : 0.5, ease: "easeOut" }
            : { x: { duration: reducedMotion ? 0.01 : 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }, y: { duration: 2.4, repeat: Infinity, delay: 3.4 } }
        }
      >
        <AgentCharacter className="mx-auto scale-90 md:scale-125" delay={0.15} variant="one" pointing={pointing} />
      </motion.div>

      <motion.button
        type="button"
        onClick={handlePress}
        disabled={pressed}
        className="relative z-10 mt-2 flex h-36 w-36 items-center justify-center rounded-full border-4 border-ink bg-banana font-display text-lg font-bold text-ink shadow-[0_12px_0_#C67800] md:h-44 md:w-44 md:text-xl"
        whileHover={pressed ? undefined : { scale: 1.06 }}
        whileTap={{ scale: 0.92, boxShadow: "0 2px 0 #C67800" }}
        animate={pressed ? { scale: [1, 1.18, 0.95] } : undefined}
        transition={{ duration: 0.5 }}
        aria-label="Tocar para iniciar la invitación"
      >
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full border-4 border-white/70"
          animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        {pressed ? "¡Vamos!" : "Toca aquí"}
      </motion.button>

      <motion.p
        className="mt-6 max-w-xs font-display text-2xl font-bold leading-tight text-white text-stroke md:max-w-sm md:text-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Toca el botón para iniciar la misión
      </motion.p>
      <motion.p
        className="mt-2 text-sm font-semibold text-overall/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        🎉 Cumpleaños de Emiliano Ulises
      </motion.p>

      {pressed && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden bg-overall"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.95, 1] }}
          transition={{ duration: reducedMotion ? 0.01 : 0.85, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-[-15%] bg-[radial-gradient(circle_at_center,rgba(255,213,0,0.9),transparent_45%)]"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.8, opacity: [0, 1, 0] }}
            transition={{ duration: reducedMotion ? 0.01 : 0.85 }}
          />
          {!reducedMotion &&
            particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ x: particle.drift, y: -120 - particle.id * 3, scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 0.85, delay: (particle.id % 7) * 0.025, ease: "easeOut" }}
              />
            ))}
        </motion.div>
      )}
    </motion.div>
  );
}
