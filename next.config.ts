import type { NextConfig } from "next";
import type { EventConfig } from "./src/types/event";
import eventData from "./data/event.json";

const configuredEvent = eventData as EventConfig;
const imageSources = [configuredEvent.heroImage, ...configuredEvent.gallery.map((image) => image.src), ...configuredEvent.story.map((item) => item.image)].filter((source): source is string => Boolean(source));
const remoteHosts = new Set(imageSources.flatMap((source) => {
  try { const url = new URL(source); return url.protocol === "https:" ? [url.hostname] : []; }
  catch { return []; }
}));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: Array.from(remoteHosts, (hostname) => ({ protocol: "https" as const, hostname })) },
};

export default nextConfig;
