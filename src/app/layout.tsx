import type { Metadata, Viewport } from "next";
import "./globals.css";
import { eventConfig } from "@/config/event";
const title = `${eventConfig.title} | Invitación de cumpleaños`;
const description = eventConfig.description || `Acompáñanos a celebrar a ${eventConfig.title}.`;

export const metadata: Metadata = {
  title,
  description,
  applicationName: eventConfig.title,
  keywords: ["cumpleaños infantil", "invitación de cumpleaños", eventConfig.title, eventConfig.location],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "es_MX",
    siteName: eventConfig.title
  },
  twitter: { card: "summary", title, description },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fffbea" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
