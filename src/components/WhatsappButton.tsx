"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import mariachi from "../../data/mariachi.json";

export function whatsappHref(message = mariachi.whatsappMessage) {
  return `https://wa.me/${mariachi.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function WhatsappButton() {
  const reducedMotion = useReducedMotion();
  return <motion.a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Solicitar información por WhatsApp" title="Escríbenos por WhatsApp" whileHover={reducedMotion ? undefined : { scale: 1.06, y: -2 }} whileTap={reducedMotion ? undefined : { scale: .96 }}><MessageCircle size={25}/><span>WhatsApp</span></motion.a>;
}
