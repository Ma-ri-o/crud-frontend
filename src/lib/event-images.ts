import { eventConfig } from "@/config/event";

const imageSources = [eventConfig.heroImage, ...eventConfig.gallery.map((image) => image.src), ...eventConfig.story.map((item) => item.image)].filter((source): source is string => Boolean(source));
const optimizedHosts = new Set(imageSources.flatMap((source) => {
  try { const url = new URL(source); return url.protocol === "https:" ? [url.hostname] : []; }
  catch { return []; }
}));

export function canOptimizeEventImage(source: string) {
  if (source.startsWith("/")) return true;
  try { const url = new URL(source); return url.protocol === "https:" && optimizedHosts.has(url.hostname); }
  catch { return false; }
}
