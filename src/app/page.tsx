import eventData from "../../data/event.json";
import type { EventConfig } from "@/types/event";
import { EventConfigProvider } from "@/components/invitation/EventConfigProvider";
import { InvitationServerRenderer } from "@/components/invitation/InvitationServerRenderer";

export default function HomePage() {
  const event = eventData as EventConfig;
  return <EventConfigProvider fallback={<InvitationServerRenderer event={event} />} />;
}
