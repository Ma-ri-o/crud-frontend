import Image from "next/image";
import { ArrowDown, CalendarDays, Clock3, ExternalLink, Gift, MapPin, Sparkles } from "lucide-react";
import type { EventConfig, StoryItem, TimelineItem } from "@/types/event";
import { ScrollReveal, Parallax } from "@/components/invitation/Animations";
import { canOptimizeEventImage } from "@/lib/event-images";

export function HeroSection({ event }: { event: EventConfig }) {
  const date = new Date(`${event.date}T12:00:00`);
  const formatted = new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
  return (
    <section className="hero-section relative isolate flex min-h-[88svh] items-center overflow-hidden px-5 py-24 md:min-h-[94svh] md:px-10">
      <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <div className="relative z-10 py-12">
          <ScrollReveal><p className="eyebrow"><Sparkles size={14} /> Una invitación para ti</p></ScrollReveal>
          <ScrollReveal delay={0.08}><h1 className="hero-title">{event.title}</h1></ScrollReveal>
          {event.subtitle && <ScrollReveal delay={0.14}><p className="hero-subtitle">{event.subtitle}</p></ScrollReveal>}
          <ScrollReveal delay={0.2}>
            <div className="hero-meta mt-9">
              <span><CalendarDays size={18} />{formatted}</span>
              {event.time && <span><Clock3 size={18} />{event.time}</span>}
            </div>
            <a href="#rsvp" className="button-primary mt-9">Confirmar asistencia <ArrowDown size={16} /></a>
          </ScrollReveal>
        </div>
        <ScrollReveal preset="zoomIn" delay={0.12} className="relative mx-auto w-full max-w-[520px]">
          <Parallax className="hero-art-frame" distance={24}>
            {event.heroImage ? <Image src={event.heroImage} alt="" fill priority sizes="(max-width: 768px) 90vw, 40vw" className="object-cover" unoptimized={!canOptimizeEventImage(event.heroImage)} /> : <div className="hero-art-placeholder"><span>{event.eventType === "wedding" ? "♡" : "✧"}</span><small>{event.hostName || "Un día para recordar"}</small></div>}
          </Parallax>
          <div className="hero-photo-label">{event.location}</div>
        </ScrollReveal>
      </div>
      <div className="hero-bottom-fade" />
    </section>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <ScrollReveal className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description && <p>{description}</p>}</ScrollReveal>;
}

export function StorySection({ story, hostName }: { story: StoryItem[]; hostName?: string }) {
  if (!story.length) return null;
  return <section className="section-wrap" id="historia"><div className="section-container"><SectionHeading eyebrow="Nuestra historia" title="Un capítulo especial" description="Algunos momentos que nos trajeron hasta aquí." />
    <div className="story-grid">{story.map((item, index) => <ScrollReveal key={`${item.title}-${index}`} delay={index * 0.07}><article className="story-card">{item.image && <div className="story-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 90vw, 40vw" className="object-cover" unoptimized={!canOptimizeEventImage(item.image)} /></div>}<span className="story-number">{String(index + 1).padStart(2, "0")}</span>{item.date && <p className="eyebrow">{item.date}</p>}<h3>{item.title}</h3><p>{item.body}</p>{hostName && index === story.length - 1 && <span className="story-signature">— {hostName}</span>}</article></ScrollReveal>)}</div>
  </div></section>;
}

export function EventDetailsSection({ event }: { event: EventConfig }) {
  return <section className="section-wrap section-tinted" id="detalles"><div className="section-container"><SectionHeading eyebrow="Guarda la fecha" title="Los detalles" description="Todo lo que necesitas para acompañarnos." />
    <div className="details-grid"><ScrollReveal><article className="detail-card"><span className="detail-icon"><CalendarDays /></span><p>Fecha</p><h3>{new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${event.date}T12:00:00`))}</h3></article></ScrollReveal>
      {event.time && <ScrollReveal delay={0.06}><article className="detail-card"><span className="detail-icon"><Clock3 /></span><p>Hora</p><h3>{event.time}</h3></article></ScrollReveal>}
      <ScrollReveal delay={0.12}><article className="detail-card"><span className="detail-icon"><MapPin /></span><p>Lugar</p><h3>{event.location}</h3>{event.address && <small>{event.address}</small>}</article></ScrollReveal>
    </div>
  </div></section>;
}

export function MapSection({ event }: { event: EventConfig }) {
  const query = encodeURIComponent([event.location, event.address].filter(Boolean).join(", "));
  const mapUrl = event.mapUrl || `https://www.google.com/maps/search/?api=1&query=${query}`;
  return <section className="section-wrap" id="ubicacion"><div className="section-container"><SectionHeading eyebrow="Cómo llegar" title="Nos encontramos aquí" description={event.address || event.location} />
    <ScrollReveal><div className="map-card"><div className="map-copy"><span className="detail-icon"><MapPin /></span><h3>{event.location}</h3>{event.address && <p>{event.address}</p>}<a className="button-secondary" href={mapUrl} target="_blank" rel="noreferrer">Abrir en Google Maps <ExternalLink size={15} /></a></div><iframe title={`Mapa: ${event.location}`} src={`https://www.google.com/maps?q=${query}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div></ScrollReveal>
  </div></section>;
}

export function GiftSection({ gifts }: { gifts: EventConfig["gifts"] }) {
  return <section className="section-wrap section-tinted" id="regalos"><div className="section-container"><ScrollReveal className="gift-card"><span className="gift-icon"><Gift /></span><p className="eyebrow">Con cariño</p><h2>{gifts.title || "Un detalle"}</h2><p>{gifts.message || "Tu compañía es el mejor regalo."}</p>{gifts.links.length > 0 && <div className="gift-links">{gifts.links.map((link) => <a key={link.url} className="button-secondary" href={link.url} target="_blank" rel="noreferrer">{link.label}<ExternalLink size={15} /></a>)}</div>}</ScrollReveal></div></section>;
}

export function TimelineSection({ timeline }: { timeline: TimelineItem[] }) {
  if (!timeline.length) return null;
  return <section className="section-wrap" id="itinerario"><div className="section-container"><SectionHeading eyebrow="El plan" title="Así viviremos el día" /><div className="timeline">{timeline.map((item, index) => <ScrollReveal key={`${item.time}-${item.title}`} delay={index * 0.06}><article className="timeline-item"><time>{item.time}</time><span className="timeline-dot" /><div><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</div></article></ScrollReveal>)}</div></div></section>;
}

export function FooterSection({ event }: { event: EventConfig }) {
  return <footer className="event-footer"><span aria-hidden="true">✧</span><p>Con cariño, {event.hostName || "la familia anfitriona"}</p><small>Una celebración para recordar · {event.date.slice(0, 4)}</small></footer>;
}
