import type { Metadata, Viewport } from "next";
import "./globals.css";
import eventData from "../../data/event.json";
import type { EventConfig } from "@/types/event";
import { themes } from "@/lib/themes";

const event = eventData as EventConfig;
const description = event.description || `${event.title}. ${event.subtitle || "Conoce todos los detalles y confirma tu asistencia."}`;

export const metadata: Metadata = {
  title: { default: event.title, template: `%s · ${event.title}` },
  description,
  applicationName: "Event Invitation Studio",
  openGraph: {
    title: event.title,
    description,
    type: "website",
    locale: "es_MX",
    ...(event.heroImage ? { images: [{ url: event.heroImage, alt: event.title }] } : {})
  },
  twitter: { card: event.heroImage ? "summary_large_image" : "summary", title: event.title, description, ...(event.heroImage ? { images: [event.heroImage] } : {}) },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: themes[event.theme].colors.background };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
