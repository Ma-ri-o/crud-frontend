"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import type { EventConfig } from "@/types/event";
import { EVENT_CONFIG_STORAGE_KEY, parseEventConfig } from "@/lib/event-config";

const ClientInvitation = dynamic(() => import("@/components/invitation/InvitationPage").then((module) => module.InvitationPage), { ssr: false });

export function EventConfigProvider({ fallback }: { fallback: ReactNode }) {
  const [customEvent, setCustomEvent] = useState<EventConfig | null>(null);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(EVENT_CONFIG_STORAGE_KEY);
      if (!stored) return;
      setCustomEvent(parseEventConfig(JSON.parse(stored)));
    } catch { window.localStorage.removeItem(EVENT_CONFIG_STORAGE_KEY); }
  }, []);
  return customEvent ? <ClientInvitation initialEvent={customEvent} /> : fallback;
}
