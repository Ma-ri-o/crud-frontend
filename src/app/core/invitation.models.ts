export type EventKind = 'birthday' | 'wedding' | 'anniversary' | 'graduation' | 'custom';
export type ThemeId = 'elegant' | 'luxury' | 'floral' | 'kids' | 'minions' | 'superheroes' | 'princess' | 'space' | 'safari';
export type SectionId = 'countdown' | 'story' | 'details' | 'gallery' | 'map' | 'gifts' | 'rsvp' | 'timeline' | 'music' | 'openData';
export interface EventStory { title: string; body: string; date?: string; image?: string; }
export interface EventPhoto { src: string; alt: string; caption?: string; width?: number; height?: number; }
export interface EventTimelineItem { time: string; title: string; description?: string; }
export interface EventConfig {
  schemaVersion: 1;
  slug: string;
  eventType: EventKind;
  title: string;
  subtitle: string;
  description: string;
  age?: number;
  date: string;
  time: string;
  timezone: string;
  location: string;
  address: string;
  mapUrl: string;
  theme: ThemeId;
  colors?: { primary?: string; accent?: string; background?: string; text?: string; surface?: string };
  heroImage?: string;
  heroImageWidth?: number;
  heroImageHeight?: number;
  heroSecondaryImage?: string;
  hostName: string;
  sections: Record<SectionId, boolean>;
  story: EventStory[];
  gallery: EventPhoto[];
  timeline: EventTimelineItem[];
  music: { enabled: boolean; src: string; title: string };
  gifts: { enabled: boolean; message: string; links: { label: string; url: string }[] };
  rsvp: { enabled: boolean; deadline?: string; whatsappNumber?: string; eventName?: string; fields: string[]; successMessage: string };
  openData: { enabled: boolean; jikan: boolean; pokeApi: boolean };
  seo: { title: string; description: string; image?: string };
}
export interface TemplateSummary { slug: string; title: string; description: string; eventType: EventKind; theme: ThemeId; preview: string; }
