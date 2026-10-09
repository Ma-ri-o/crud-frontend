import Image from "next/image";
import { ArrowRight, Facebook, MapPin, MessageCircle, Phone } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { WhatsappButton } from "@/components/WhatsappButton";
import mariachi from "../../data/mariachi.json";

const phoneHref = `tel:+52${mariachi.phone}`;
const whatsappHref = `https://wa.me/${mariachi.whatsappNumber}?text=${encodeURIComponent(mariachi.whatsappMessage)}`;
const facebookHref = "https://www.facebook.com/search/top/?q=Mariachi%20Mexican%C3%ADsimo";
const qrHref = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(whatsappHref)}`;

export default function HomePage() {
  return (
    <main className="compact-landing">
      <header className="compact-header">
        <a className="brand" href="#inicio" aria-label="Mariachi Mexicanísimo, inicio">
          <span className="brand-mark">M<span>✦</span></span>
          <span>MARIACHI <b>MEXICANÍSIMO</b></span>
        </a>
        <a className="header-phone" href={phoneHref}><Phone size={16} /> {mariachi.phone.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3")}</a>
      </header>

      <section className="compact-hero" id="inicio">
        <div className="compact-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> MÚSICA MEXICANA PARA CELEBRAR</p>
          <h1>Mariachi<br /><em>Mexicanísimo</em></h1>
          <p className="compact-tagline">La voz de tus mejores momentos</p>
          <p className="compact-description">Serenatas, bodas, cumpleaños, XV años y más. Atención profesional en toda la Zona Oriente del Estado de México.</p>
          <p className="compact-contact">Atención con el <strong>Sr. Ray S.</strong></p>
          <div className="compact-actions" aria-label="Contacta o reserva tu mariachi">
            <a className="compact-action action-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={19} />Enviar mensaje</a>
            <a className="compact-action action-call" href={phoneHref}><Phone size={18} />Llamar ahora</a>
            <BookingForm />
            <a className="compact-action action-facebook" href={facebookHref} target="_blank" rel="noreferrer"><Facebook size={19} />Ir a Facebook</a>
          </div>
          <p className="compact-location"><MapPin size={15} /> Zona Oriente, Estado de México</p>
        </div>
        <div className="compact-art" aria-hidden="true">
          <div className="compact-sun" />
          <div className="compact-arch" />
          <div className="guitar-art"><div className="guitar-neck" /><div className="guitar-body"><div className="guitar-hole" /><div className="guitar-bridge" /></div></div>
          <span className="compact-art-caption">TRADICIÓN · ALEGRÍA · FAMILIA</span>
        </div>
      </section>

      <footer className="compact-footer">
        <p>Solicita tu cotización sin compromiso.</p>
        <a href={whatsappHref} target="_blank" rel="noreferrer">Cotizar por WhatsApp <ArrowRight size={15} /></a>
        <div className="compact-qr">
          <span>Escanea para cotizar por WhatsApp</span>
          <Image src={qrHref} width={72} height={72} unoptimized alt="Código QR para cotizar por WhatsApp" />
        </div>
        <small>© {new Date().getFullYear()} Mariachi Mexicanísimo</small>
      </footer>
      <WhatsappButton />
    </main>
  );
}
