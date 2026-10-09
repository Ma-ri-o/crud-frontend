import type { Metadata } from "next";
import { InvitationServerRenderer } from "@/components/invitation/InvitationServerRenderer";
import { EventConfigProvider } from "@/components/invitation/EventConfigProvider";
import { eventConfig } from "@/config/event";

export function generateMetadata(): Metadata {
  const description = eventConfig.description || `${eventConfig.title}, una celebración especial.`;
  return {
    title: `${eventConfig.title} | Invitación de cumpleaños`,
    description,
    applicationName: eventConfig.title,
    openGraph: { title: eventConfig.title, description, type: "website", locale: "es_MX" },
    twitter: { card: "summary_large_image", title: eventConfig.title, description },
    robots: { index: true, follow: true },
  };
}

export default function HomePage() {
  return <EventConfigProvider fallback={<InvitationServerRenderer event={eventConfig} />} />;
}
