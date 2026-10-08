"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeading } from "./Reveal";

const scenes = [
  { emoji: "🎂", title: "Pastel de misión", colors: "from-banana to-orange" },
  { emoji: "🎈", title: "Globos al cielo", colors: "from-sky to-overall" },
  { emoji: "🎁", title: "Sorpresas secretas", colors: "from-orange to-red-400" },
  { emoji: "🍌", title: "Bananas de energía", colors: "from-yellow-200 to-banana" },
  { emoji: "📸", title: "Sonrisas épicas", colors: "from-blue-200 to-sky" },
  { emoji: "🎉", title: "Fiesta total", colors: "from-purple-300 to-pink-400" },
];

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (selected === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight") setSelected((selected + 1) % scenes.length);
      if (event.key === "ArrowLeft") setSelected((selected - 1 + scenes.length) % scenes.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  const move = (direction: number) => {
    if (selected === null) return;
    setSelected((selected + direction + scenes.length) % scenes.length);
  };

  return (
    <section className="bg-white px-5 py-20 md:py-28" id="galeria">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Archivo fotográfico"
          title="Momentos de la aventura"
          copy="Un pequeño adelanto de todo lo que nos espera en esta misión."
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {scenes.map((scene, index) => (
            <motion.button
              type="button"
              key={scene.title}
              className={`group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${scene.colors} shadow-card`}
              onClick={() => setSelected(index)}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (index % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              aria-label={`Ampliar ${scene.title}`}
            >
              <div className="dot-pattern absolute inset-0 opacity-40" />
              <motion.span
                className="relative block text-6xl drop-shadow-xl md:text-8xl"
                whileHover={{ scale: 1.2, rotate: 8 }}
              >
                {scene.emoji}
              </motion.span>
              <span className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl bg-white/90 px-3 py-2 text-left text-xs font-bold text-ink backdrop-blur md:text-sm">
                {scene.title}
                <Maximize2 size={15} />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-5 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={scenes[selected].title}
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute right-5 top-5 rounded-full bg-white p-3 text-ink"
              onClick={() => setSelected(null)}
              aria-label="Cerrar galería"
            >
              <X />
            </button>
            <button
              className="absolute left-3 rounded-full bg-white/90 p-3 text-ink md:left-8"
              onClick={(event) => {
                event.stopPropagation();
                move(-1);
              }}
              aria-label="Imagen anterior"
            >
              <ChevronLeft />
            </button>
            <motion.div
              key={selected}
              className={`flex aspect-[4/3] w-full max-w-3xl flex-col items-center justify-center rounded-[2.5rem] bg-gradient-to-br ${scenes[selected].colors}`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <span className="text-[8rem] drop-shadow-2xl md:text-[12rem]">{scenes[selected].emoji}</span>
              <h3 className="font-display text-2xl font-bold text-ink md:text-4xl">{scenes[selected].title}</h3>
            </motion.div>
            <button
              className="absolute right-3 rounded-full bg-white/90 p-3 text-ink md:right-8"
              onClick={(event) => {
                event.stopPropagation();
                move(1);
              }}
              aria-label="Imagen siguiente"
            >
              <ChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
