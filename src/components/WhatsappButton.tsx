"use client";

import { motion, useReducedMotion } from "framer-motion";

const WHATSAPP_NUMBER = "5215515333499";
const WHATSAPP_MESSAGE = "Hola, quiero confirmar mi asistencia al cumpleaños de Emiliano Ulises.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export function WhatsappButton() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.38)] focus-visible:outline-white md:bottom-7 md:right-7 md:h-16 md:w-16"
      aria-label="Confirmar asistencia por WhatsApp"
      title="Confirmar por WhatsApp"
      whileHover={reducedMotion ? undefined : { scale: 1.08, y: -2 }}
      whileTap={reducedMotion ? undefined : { scale: 0.94 }}
    >
      {!reducedMotion && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#25D366]"
          animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          aria-hidden="true"
        />
      )}
      <svg
        className="relative h-7 w-7 md:h-8 md:w-8"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.04 3A12.89 12.89 0 0 0 5 22.56L3.18 29l6.6-1.73A12.94 12.94 0 1 0 16.04 3Zm0 23.7c-1.91 0-3.79-.51-5.42-1.48l-.39-.23-3.92 1.03 1.05-3.82-.25-.4a10.7 10.7 0 1 1 8.93 4.9Zm5.87-8.02c-.32-.16-1.9-.94-2.2-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.58a9.62 9.62 0 0 1-1.78-2.21c-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67 0 1.58 1.15 3.1 1.31 3.31.16.21 2.26 3.45 5.48 4.84.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </motion.a>
  );
}
