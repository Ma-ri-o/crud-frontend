"use client";

import { Pause, Play, Volume2 } from "lucide-react";
import { useRef, useState } from "react";

export function MusicPlayer({ src, title = "Música del evento" }: { src: string; title?: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = async () => {
    if (!audio.current) return;
    if (playing) { audio.current.pause(); setPlaying(false); }
    else { try { await audio.current.play(); setPlaying(true); } catch { setPlaying(false); } }
  };
  return <div className="music-player"><audio ref={audio} src={src} loop preload="none" onEnded={() => setPlaying(false)} /><button type="button" onClick={toggle} aria-label={playing ? "Pausar música" : "Reproducir música"}>{playing ? <Pause size={17} /> : <Play size={17} />}</button><Volume2 size={16} /><span>{title}</span></div>;
}
