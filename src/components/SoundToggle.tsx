"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SoundToggle() {
  const [playing, setPlaying] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      void contextRef.current?.close();
    },
    [],
  );

  const stop = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setPlaying(false);
  };

  const playNote = (context: AudioContext, frequency: number) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.24);
  };

  const toggle = () => {
    if (playing) {
      stop();
      return;
    }

    const AudioContextClass = window.AudioContext;
    const context = contextRef.current ?? new AudioContextClass();
    contextRef.current = context;
    void context.resume();
    const melody = [523.25, 659.25, 783.99, 659.25, 880, 783.99];
    let step = 0;
    playNote(context, melody[step]);
    timerRef.current = window.setInterval(() => {
      step = (step + 1) % melody.length;
      playNote(context, melody[step]);
    }, 360);
    setPlaying(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-ink text-white shadow-lg transition-transform hover:scale-110 md:right-6 md:top-6"
      aria-label={playing ? "Desactivar música" : "Activar música"}
      title={playing ? "Desactivar música" : "Activar música"}
    >
      {playing ? <Volume2 size={21} /> : <VolumeX size={21} />}
    </button>
  );
}
