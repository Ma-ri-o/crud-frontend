"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { GalleryItem } from "@/types/event";
import { ScrollReveal } from "@/components/invitation/Animations";

export function GallerySection({ images }: { images: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  const move = useCallback((direction: number) => setActive((current) => current === null ? null : (current + direction + images.length) % images.length), [images.length]);
  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [active, close, move]);
  if (!images.length) return null;
  return <section className="section-wrap section-tinted" id="galeria"><div className="section-container"><ScrollReveal className="section-heading"><p className="eyebrow">Momentos</p><h2>Una pequeña galería</h2><p>Recuerdos que queremos compartir contigo.</p></ScrollReveal><div className="gallery-grid">{images.map((image, index) => <ScrollReveal key={`${image.src}-${index}`} delay={index * 0.04}><button className="gallery-tile" onClick={() => setActive(index)} aria-label={`Abrir imagen: ${image.alt}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" className="object-cover transition duration-500 hover:scale-105" unoptimized />{image.caption && <span>{image.caption}</span>}</button></ScrollReveal>)}</div></div>
    <AnimatePresence>{active !== null && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Galería de fotos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}><button className="lightbox-close" onClick={close} aria-label="Cerrar galería"><X /></button><button className="lightbox-arrow left" onClick={(event) => { event.stopPropagation(); move(-1); }} aria-label="Imagen anterior"><ChevronLeft /></button><motion.figure key={images[active].src} className="lightbox-figure" initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(event) => event.stopPropagation()}><div className="lightbox-image"><Image src={images[active].src} alt={images[active].alt} fill sizes="90vw" className="object-contain" unoptimized /></div>{images[active].caption && <figcaption>{images[active].caption}</figcaption>}</motion.figure><button className="lightbox-arrow right" onClick={(event) => { event.stopPropagation(); move(1); }} aria-label="Imagen siguiente"><ChevronRight /></button></motion.div>}</AnimatePresence>
  </section>;
}
