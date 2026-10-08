import eventData from "../../data/event.json";

const configuredEvent = eventData as { heroImage?: string; gallery?: { src: string }[]; story?: { image?: string }[] };
const imageSources = [configuredEvent.heroImage, ...(configuredEvent.gallery || []).map((image) => image.src), ...(configuredEvent.story || []).map((item) => item.image)].filter((source): source is string => Boolean(source));
const optimizedHosts = new Set(imageSources.flatMap((source) => {
  try { const url = new URL(source); return url.protocol === "https:" ? [url.hostname] : []; }
  catch { return []; }
}));

export function canOptimizeEventImage(source: string) {
  if (source.startsWith("/")) return true;
  try { const url = new URL(source); return url.protocol === "https:" && optimizedHosts.has(url.hostname); }
  catch { return false; }
}
