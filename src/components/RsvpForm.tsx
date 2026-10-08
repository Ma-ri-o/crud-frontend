"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Send, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().trim().min(2, "Escribe tu nombre completo"),
    guests: z.number().int().min(1, "Mínimo 1 asistente").max(10, "Máximo 10 asistentes"),
    attendance: z.enum(["yes", "no"], { error: "Selecciona una opción" }),
    comments: z.string().trim().max(300, "Máximo 300 caracteres").optional(),
  })
  .refine((data) => data.attendance !== "no" || data.guests === 1, {
    path: ["guests"],
    message: "Si no asistirás, deja 1 en este campo",
  });

type FormData = z.infer<typeof schema>;

const WHATSAPP_NUMBER = "5215515333499";

export function RsvpForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { guests: 1, attendance: "yes", comments: "" },
  });

  const onSubmit = (data: FormData) => {
    const message = [
      `Nombre: ${data.name}`,
      `Número de invitados: ${data.guests}`,
      `Asistirá: ${data.attendance === "yes" ? "Sí" : "No"}`,
      `Comentarios: ${data.comments || "Sin comentarios"}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.localStorage.setItem(
      "emiliano-ulises-rsvp",
      JSON.stringify({ ...data, createdAt: new Date().toISOString() }),
    );
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        className="flex min-h-[450px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, -12, 12, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8 }}
          className="text-8xl"
        >
          🍌
        </motion.div>
        <CheckCircle2 className="mt-5 text-green-500" size={42} />
        <h3 className="mt-4 font-display text-3xl font-bold text-overall md:text-5xl">
          ¡Banana!
        </h3>
        <p className="mt-3 max-w-sm text-lg text-ink/70">
          Tu asistencia fue registrada y abrimos WhatsApp para que envíes la confirmación.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-7 font-bold text-overall underline decoration-banana decoration-4 underline-offset-4"
        >
          Editar respuesta
        </button>
      </motion.div>
    );
  }

  const fieldClass =
    "mt-2 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 text-ink transition focus:border-overall focus:bg-white focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[2.5rem] bg-white p-6 shadow-card md:p-10"
      noValidate
    >
      <div className="mb-8 flex items-center gap-4">
        <span className="rounded-2xl bg-banana p-3 text-overall"><Users size={28} /></span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-overall">Confidencial</p>
          <h3 className="font-display text-2xl font-bold md:text-3xl">Registro de agentes</h3>
        </div>
      </div>

      <div className="space-y-5">
        <label className="block text-sm font-bold">
          Nombre completo
          <input {...register("name")} className={fieldClass} placeholder="Ej. Familia García" autoComplete="name" />
          {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
        </label>

        <label className="block text-sm font-bold">
          Número de asistentes
          <input {...register("guests", { valueAsNumber: true })} type="number" min="1" max="10" className={fieldClass} inputMode="numeric" />
          {errors.guests && <span className="mt-1 block text-xs text-red-600">{errors.guests.message}</span>}
        </label>

        <fieldset>
          <legend className="mb-2 text-sm font-bold">Confirmación</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="cursor-pointer">
              <input {...register("attendance")} type="radio" value="yes" className="peer sr-only" />
              <span className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-slate-200 px-3 text-center text-sm font-bold transition peer-checked:border-overall peer-checked:bg-overall peer-checked:text-white">
                Sí asistiré
              </span>
            </label>
            <label className="cursor-pointer">
              <input {...register("attendance")} type="radio" value="no" className="peer sr-only" />
              <span className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-slate-200 px-3 text-center text-sm font-bold transition peer-checked:border-overall peer-checked:bg-overall peer-checked:text-white">
                No podré asistir
              </span>
            </label>
          </div>
          {errors.attendance && <span className="mt-1 block text-xs text-red-600">{errors.attendance.message}</span>}
        </fieldset>

        <label className="block text-sm font-bold">
          Comentarios <span className="font-normal text-ink/45">(opcional)</span>
          <textarea {...register("comments")} rows={3} className={`${fieldClass} resize-none`} placeholder="Alergias, dudas o un mensaje para Emiliano Ulises..." />
          {errors.comments && <span className="mt-1 block text-xs text-red-600">{errors.comments.message}</span>}
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange px-6 py-4 font-display text-lg font-bold text-ink shadow-[0_7px_0_#C67800] transition hover:-translate-y-1 active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {isSubmitting ? "Preparando confirmación..." : "Confirmar asistencia"}
        <Send size={19} />
      </button>
      <p className="mt-4 text-center text-xs text-ink/45">
        Al confirmar, se abrirá WhatsApp con los datos capturados.
      </p>
    </form>
  );
}
