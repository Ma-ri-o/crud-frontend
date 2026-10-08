"use client";

import Image from "next/image";
import { Check, Copy, Facebook, MessageCircle, QrCode, X } from "lucide-react";
import { useState } from "react";

export function ShareTools({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const encodedUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const encodedTitle = encodeURIComponent(title);
  const copyLink = async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 2200); } catch { window.prompt("Copia el enlace de la invitación:", window.location.href); } };
  return <>
    <div className="share-tools" aria-label="Compartir invitación"><a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noreferrer" aria-label="Compartir por WhatsApp"><MessageCircle size={17} /></a><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer" aria-label="Compartir por Facebook"><Facebook size={17} /></a><button onClick={copyLink} aria-label="Copiar enlace"><span>{copied ? <Check size={17} /> : <Copy size={17} />}</span></button><button onClick={() => setShowQr(true)} aria-label="Mostrar código QR"><QrCode size={17} /></button></div>
    {copied && <span className="copy-tooltip" role="status">Enlace copiado</span>}
    {showQr && <div className="qr-backdrop" role="presentation" onClick={() => setShowQr(false)}><div className="qr-modal" role="dialog" aria-modal="true" aria-labelledby="qr-title" onClick={(event) => event.stopPropagation()}><button className="qr-close" onClick={() => setShowQr(false)} aria-label="Cerrar"><X size={18} /></button><p className="eyebrow">Comparte en persona</p><h2 id="qr-title">Escanea la invitación</h2><Image src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodedUrl}`} width={240} height={240} unoptimized alt="Código QR para abrir la invitación" /><p>El código QR enlaza a esta página.</p></div></div>}
  </>;
}
