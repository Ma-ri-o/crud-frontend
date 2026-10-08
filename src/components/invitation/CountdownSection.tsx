"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/invitation/Animations";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };
const zero: Remaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function CountdownSection({ date, time = "18:00" }: { date: string; time?: string }) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  useEffect(() => {
    const target = new Date(`${date}T${time}:00`).getTime();
    const update = () => {
      const distance = Math.max(0, target - Date.now());
      setRemaining({ days: Math.floor(distance / 86_400_000), hours: Math.floor((distance / 3_600_000) % 24), minutes: Math.floor((distance / 60_000) % 60), seconds: Math.floor((distance / 1_000) % 60) });
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [date, time]);

  const units: [keyof Remaining, string][] = [["days", "días"], ["hours", "horas"], ["minutes", "minutos"], ["seconds", "segundos"]];
  return <section className="countdown-wrap" aria-label="Cuenta regresiva"><ScrollReveal><p className="eyebrow">La cuenta regresiva comienza</p><div className="countdown-grid">{units.map(([key, label]) => <div className="countdown-unit" key={key}><strong>{String((remaining ?? zero)[key]).padStart(2, "0")}</strong><span>{label}</span></div>)}</div></ScrollReveal></section>;
}
