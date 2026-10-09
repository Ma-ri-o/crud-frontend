"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, MessageCircle, Music2, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { whatsappHref } from "./WhatsappButton";

const municipalities = ["Nezahualcóyotl", "Chimalhuacán", "Los Reyes La Paz", "Ixtapaluca", "Chalco", "Valle de Chalco", "Texcoco", "Ecatepec"];
const eventTypes = ["Serenata", "Boda", "XV años", "Cumpleaños", "Bautizo", "Aniversario", "Evento empresarial", "Pedida de mano", "Graduación", "Otro"];
const schema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre (mínimo 2 caracteres)."),
  phone: z.string().trim().regex(/^[\d\s()+-]{10,18}$/, "Escribe un teléfono válido.").refine(value => value.replace(/\D/g, "").length === 10, "Incluye los 10 dígitos de tu teléfono."),
  date: z.string().min(1, "Selecciona la fecha del evento.").refine(value => value >= new Date().toLocaleDateString("en-CA"), "La fecha no puede estar en el pasado."),
  time: z.string().min(1, "Selecciona una hora aproximada."),
  municipality: z.string().min(1, "Selecciona tu municipio."),
  eventType: z.string().min(1, "Selecciona el tipo de evento."),
  address: z.string().trim().min(5, "Comparte una dirección o referencia (mínimo 5 caracteres)."),
  comments: z.string().trim().max(500, "Máximo 500 caracteres.").optional(),
});
type FormData = z.infer<typeof schema>;

export function BookingForm() {
  const [open, setOpen] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const fieldClass = "booking-input";
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);
  const onSubmit = (data: FormData) => {
    const message = ["Hola, me interesa cotizar una presentación del Mariachi Mexicanísimo.", "", `Nombre: ${data.name}`, `Teléfono: ${data.phone}`, `Fecha: ${data.date}`, `Hora: ${data.time}`, `Municipio: ${data.municipality}`, `Tipo de evento: ${data.eventType}`, `Dirección: ${data.address}`, `Comentarios: ${data.comments || "Sin comentarios"}`, "", "¿Podrían confirmarme disponibilidad y brindarme una cotización?"] .join("\n");
    setWhatsappLink(whatsappHref(message));
  };
  return <>
    <button className="compact-action action-book" type="button" onClick={() => { setWhatsappLink(""); setOpen(true); }}><Music2 size={19} />Reservar y cotizar</button>
    {open && <div className="booking-overlay" onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-title" ref={dialogRef}>
        <button className="booking-close" type="button" aria-label="Cerrar formulario" onClick={() => setOpen(false)}><X size={20} /></button>
        <form className="booking-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-heading"><div><span>COTIZACIÓN SIN COMPROMISO</span><h2 id="booking-title">Cuéntanos tu plan</h2></div><Send size={19}/></div>
          <div className="form-grid">
            <label>Tu nombre<input className={fieldClass} autoComplete="name" placeholder="Nombre y apellido" {...register("name")}/>{errors.name&&<small className="field-error">{errors.name.message}</small>}</label>
            <label>Teléfono<input className={fieldClass} type="tel" autoComplete="tel" inputMode="tel" placeholder="55 1234 5678" {...register("phone")}/>{errors.phone&&<small className="field-error">{errors.phone.message}</small>}</label>
            <label>Fecha del evento<input className={fieldClass} type="date" min={new Date().toLocaleDateString("en-CA")} {...register("date")}/>{errors.date&&<small className="field-error">{errors.date.message}</small>}</label>
            <label>Hora aproximada<input className={fieldClass} type="time" {...register("time")}/>{errors.time&&<small className="field-error">{errors.time.message}</small>}</label>
            <label>Municipio<select className={fieldClass} defaultValue="" {...register("municipality")}><option value="" disabled>Elige tu municipio</option>{municipalities.map(value=><option key={value}>{value}</option>)}</select>{errors.municipality&&<small className="field-error">{errors.municipality.message}</small>}</label>
            <label>Tipo de evento<select className={fieldClass} defaultValue="" {...register("eventType")}><option value="" disabled>¿Qué celebramos?</option>{eventTypes.map(value=><option key={value}>{value}</option>)}</select>{errors.eventType&&<small className="field-error">{errors.eventType.message}</small>}</label>
            <label className="form-wide">Dirección o punto de referencia<input className={fieldClass} autoComplete="street-address" placeholder="Calle, colonia y referencia" {...register("address")}/>{errors.address&&<small className="field-error">{errors.address.message}</small>}</label>
            <label className="form-wide">Detalles adicionales <span>(opcional)</span><textarea className={fieldClass} rows={2} maxLength={500} placeholder="Duración, canciones especiales…" {...register("comments")}/>{errors.comments&&<small className="field-error">{errors.comments.message}</small>}</label>
          </div>
          {whatsappLink
            ? <div className="form-success"><CheckCircle2 size={18}/><div><p>Listo. Abre WhatsApp para revisar y enviar tu solicitud.</p><a className="button button-red form-submit" href={whatsappLink} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Continuar a WhatsApp <ArrowRight size={17}/></a></div></div>
            : <button className="button button-red form-submit" disabled={isSubmitting} type="submit">{isSubmitting?"Preparando…":"Preparar mensaje de WhatsApp"}<ArrowRight size={17}/></button>}
          <p className="form-privacy">Tus datos se incluirán en el mensaje de WhatsApp. La fecha queda pendiente de confirmación.</p>
        </form>
      </div>
    </div>}
  </>;
}
