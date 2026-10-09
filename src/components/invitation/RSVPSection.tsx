"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, LoaderCircle, MessageCircle, Send } from "lucide-react";
import type { EventConfig } from "@/types/event";
import { ScrollReveal } from "@/components/invitation/Animations";

type RSVPValues = { name: string; email: string; guests: number; note: string };

export function RSVPSection({ event, config }: { event: EventConfig; config: EventConfig["rsvp"] }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [notice, setNotice] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<RSVPValues>({ defaultValues: { guests: 1 } });

  const submit = async (values: RSVPValues) => {
    setStatus("sending"); setNotice("");
    if (config.endpoint) {
      try {
        const response = await fetch(config.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, eventTitle: event.title }) });
        if (!response.ok) throw new Error("No se pudo enviar la respuesta.");
        setStatus("sent"); setNotice("¡Gracias! Tu respuesta quedó registrada.");
      } catch { setStatus("error"); setNotice("No fue posible enviar tu respuesta. Inténtalo de nuevo más tarde."); }
      return;
    }
    if (config.email) {
      const subject = encodeURIComponent(`RSVP · ${event.title}`);
      const body = encodeURIComponent(`Nombre: ${values.name}\nCorreo: ${values.email || "No proporcionado"}\nPersonas: ${values.guests}\nMensaje: ${values.note || "—"}`);
      window.location.href = `mailto:${config.email}?subject=${subject}&body=${body}`;
      setStatus("sent"); setNotice("Abrimos tu correo para enviar la confirmación.");
      return;
    }
    setStatus("error"); setNotice("Para recibir respuestas, configura rsvp.endpoint o rsvp.email en data/event.json.");
  };

  const whatsappNumber = config.phone?.replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(config.message || `Hola, confirmo mi asistencia a ${event.title}.`);

  return <>{whatsappNumber && <a className="invitation-whatsapp-float" href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" aria-label="Confirmar asistencia por WhatsApp" title="Confirmar asistencia por WhatsApp"><MessageCircle size={24} /></a>}<section className="section-wrap rsvp-wrap" id="rsvp"><div className="section-container rsvp-layout"><ScrollReveal><p className="eyebrow">Nos encantará verte</p><h2>¿Nos acompañas?</h2><p>Confirma tu asistencia y ayúdanos a preparar cada detalle.</p>{config.deadline && <small>Confirma antes del {new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long" }).format(new Date(`${config.deadline}T12:00:00`))}.</small>}</ScrollReveal>
    <ScrollReveal delay={0.1}>{whatsappNumber ? <div className="rsvp-form rsvp-whatsapp"><p>Avísanos directamente por WhatsApp. ¡Nos dará mucho gusto contar contigo!</p><a className="button-primary" href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Confirmar asistencia</a></div> : <form className="rsvp-form" onSubmit={handleSubmit(submit)} noValidate><label>Tu nombre<input autoComplete="name" placeholder="Nombre completo" {...register("name", { required: "Escribe tu nombre." })} />{errors.name && <small className="form-error">{errors.name.message}</small>}</label><label>Correo electrónico <span>(opcional)</span><input type="email" autoComplete="email" placeholder="tu@correo.com" {...register("email", { pattern: { value: /^\S+@\S+\.\S+$/, message: "Revisa el formato del correo." } })} />{errors.email && <small className="form-error">{errors.email.message}</small>}</label><label>Personas que asistirán<input type="number" min={1} max={12} {...register("guests", { valueAsNumber: true, min: { value: 1, message: "Selecciona al menos una persona." }, max: { value: 12, message: "El máximo es 12 personas." } })} />{errors.guests && <small className="form-error">{errors.guests.message}</small>}</label><label>Mensaje <span>(opcional)</span><textarea rows={3} placeholder="¿Quieres contarnos algo?" {...register("note")} /></label><button className="button-primary w-full" type="submit" disabled={status === "sending"}>{status === "sending" ? <LoaderCircle className="animate-spin" size={17} /> : status === "sent" ? <Check size={17} /> : <Send size={17} />}{status === "sending" ? "Enviando…" : "Confirmar asistencia"}</button>{notice && <p className={`form-notice ${status}`} role="status">{notice}</p>}</form>}</ScrollReveal>
  </div></section></>;
}
