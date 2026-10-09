import type { Metadata, Viewport } from "next";
import "./globals.css";
const title = "Mariachi Mexicanísimo | Serenatas y Eventos en el Estado de México";
const description = "La voz de tus mejores momentos. Serenatas, bodas, cumpleaños, XV años y eventos en la Zona Oriente del Estado de México. Cotiza por WhatsApp.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "Mariachi Mexicanísimo",
  keywords: ["mariachi en Estado de México", "mariachi en Nezahualcóyotl", "serenatas", "mariachi para bodas", "mariachi para XV años", "mariachi en Zona Oriente"],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "es_MX",
    siteName: "Mariachi Mexicanísimo"
  },
  twitter: { card: "summary", title, description },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F5E6C8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
