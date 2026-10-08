import type { EventConfig, ThemeName } from "@/types/event";
import { themes } from "@/lib/themes";

const sectionKeys = ["countdown", "story", "details", "gallery", "map", "gifts", "rsvp", "timeline", "music"] as const;
export const EVENT_CONFIG_STORAGE_KEY = "event-invitation-config-v1";

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === "string" && value in themes;
}

export function parseEventConfig(value: unknown): EventConfig | null {
  if (!value || typeof value !== "object") return null;
  const event = value as Partial<EventConfig>;
  if (typeof event.title !== "string" || typeof event.date !== "string" || typeof event.location !== "string" || !isThemeName(event.theme)) return null;
  if (!event.sections || !sectionKeys.every((key) => typeof event.sections?.[key] === "boolean")) return null;
  if (!Array.isArray(event.gallery) || !Array.isArray(event.story) || !Array.isArray(event.timeline)) return null;
  if (!event.rsvp || typeof event.rsvp.enabled !== "boolean" || !event.gifts || !Array.isArray(event.gifts.links)) return null;
  return event as EventConfig;
}
