"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ArrowLeft, Download, Eye, Save, SlidersHorizontal } from "lucide-react";
import type { EventConfig, ThemeName } from "@/types/event";
import { eventConfig } from "@/config/event";
import { themes } from "@/lib/themes";
import { EVENT_CONFIG_STORAGE_KEY } from "@/lib/event-config";

const baseEvent: EventConfig = eventConfig;

export default function StudioPage() {
  const defaults = useMemo(() => ({ ...baseEvent, customColors: { primary: themes[baseEvent.theme].colors.primary, accent: themes[baseEvent.theme].colors.accent, background: themes[baseEvent.theme].colors.background, text: themes[baseEvent.theme].colors.text } }), []);
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<EventConfig>({ defaultValues: defaults });
  const selectedTheme = watch("theme") as ThemeName;
  const useThemeColors = () => {
    const colors = themes[selectedTheme].colors;
    setValue("customColors.primary", colors.primary); setValue("customColors.accent", colors.accent); setValue("customColors.background", colors.background); setValue("customColors.text", colors.text);
  };
  const saveConfig = (values: EventConfig) => {
    try { localStorage.setItem(EVENT_CONFIG_STORAGE_KEY, JSON.stringify(values)); setSaved(true); window.setTimeout(() => setSaved(false), 3000); }
    catch { setSaved(false); }
  };
  const downloadConfig = handleSubmit((values) => {
    const blob = new Blob([JSON.stringify(values, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "event.json"; anchor.click(); URL.revokeObjectURL(url);
  });
  return <main className="studio-page"><header className="studio-topbar"><Link href="/" className="studio-back"><ArrowLeft size={16} /> Volver a la invitación</Link><span className="studio-mark"><SlidersHorizontal size={16} /> Event Studio</span></header>
    <div className="studio-layout"><section className="studio-intro"><p className="eyebrow">Editor de plantilla</p><h1>Personaliza tu evento.</h1><p>Actualiza el contenido, el tema y el estilo sin editar componentes. Los cambios se guardan en este navegador; descarga el archivo para desplegar la configuración.</p><Link href="/" className="button-secondary"><Eye size={16} /> Ver invitación</Link></section>
      <form className="studio-form" onSubmit={handleSubmit(saveConfig)}>
        <div className="studio-form-heading"><div><p className="eyebrow">Contenido</p><h2>Información del evento</h2></div><span>01 / 03</span></div>
        <div className="studio-fields"><label>Título<input {...register("title", { required: true })} /></label><label>Edad<input type="number" min={1} max={120} {...register("age", { valueAsNumber: true })} /></label><label>Subtítulo<input {...register("subtitle")} /></label><label>Fecha<input type="date" {...register("date")} /></label><label>Hora<input type="time" {...register("time")} /></label><label className="studio-wide">Ubicación<input {...register("location", { required: true })} /></label><label className="studio-wide">Dirección<input {...register("address")} /></label><label className="studio-wide">Vestimenta<input {...register("dressCode")} /></label><label className="studio-wide">Enlace de Google Maps<input type="url" placeholder="https://maps.google.com/…" {...register("mapUrl")} /></label><label className="studio-wide">Imagen principal (URL)<input type="url" placeholder="https://…" {...register("heroImage")} /></label></div>
        <div className="studio-form-heading"><div><p className="eyebrow">Identidad visual</p><h2>Tema y colores</h2></div><span>02 / 03</span></div>
        <div className="studio-fields"><label>Tema<select {...register("theme")} onChange={(event) => { setValue("theme", event.target.value as ThemeName); const colors = themes[event.target.value as ThemeName].colors; setValue("customColors.primary", colors.primary); setValue("customColors.accent", colors.accent); setValue("customColors.background", colors.background); setValue("customColors.text", colors.text); }}>{Object.entries(themes).map(([key, theme]) => <option key={key} value={key}>{theme.label}</option>)}</select></label><label>Nombre anfitrión<input {...register("hostName")} /></label><label>Color principal<input type="color" {...register("customColors.primary")} /></label><label>Color de acento<input type="color" {...register("customColors.accent")} /></label><label>Color de fondo<input type="color" {...register("customColors.background")} /></label><label>Color de texto<input type="color" {...register("customColors.text")} /></label><button className="studio-reset" type="button" onClick={useThemeColors}>Restaurar colores del tema</button></div>
        <div className="studio-form-heading"><div><p className="eyebrow">Experiencia</p><h2>Medios y confirmación</h2></div><span>03 / 03</span></div>
        <div className="studio-fields"><label className="studio-wide">Música (URL de audio)<input type="url" placeholder="https://…/cancion.mp3" {...register("music.src")} /></label><label>Título de la música<input {...register("music.title")} /></label><label>WhatsApp RSVP<input type="tel" placeholder="525512345678" {...register("rsvp.phone")} /></label><label className="studio-wide">Mensaje RSVP<input {...register("rsvp.message")} /></label><label>Fecha límite RSVP<input type="date" {...register("rsvp.deadline")} /></label><label>Correo RSVP<input type="email" {...register("rsvp.email")} /></label><label className="studio-wide">Endpoint RSVP<input type="url" placeholder="https://tu-servicio.com/api/rsvp" {...register("rsvp.endpoint")} /></label><label className="studio-check"><input type="checkbox" {...register("rsvp.enabled")} /> Activar confirmación</label><label className="studio-check"><input type="checkbox" {...register("confetti.enabled")} /> Decoración animada</label></div>
        <div className="studio-actions"><button className="button-primary" type="submit"><Save size={16} />{saved ? "Guardado en este navegador" : "Guardar cambios"}</button><button className="button-secondary" type="button" onClick={downloadConfig}><Download size={16} /> Descargar event.json</button></div>
        <p className="studio-footnote">Para registrar respuestas en producción, conecta un endpoint en <code>rsvp.endpoint</code>. El editor no crea ni almacena datos de invitados en un servidor.</p>
      </form>
    </div>
  </main>;
}
