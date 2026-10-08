export type EventType =
  | "birthday"
  | "wedding"
  | "baby-shower"
  | "graduation"
  | "anniversary"
  | "other";

export type ThemeName =
  | "elegant"
  | "luxury"
  | "floral"
  | "kids"
  | "minions"
  | "superheroes"
  | "princess"
  | "space"
  | "safari";

export interface StoryItem {
  title: string;
  body: string;
  date?: string;
  image?: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface TimelineItem {
  time: string;
  title: string;
  description?: string;
}

export interface GiftLink {
  label: string;
  url: string;
}

export interface EventSections {
  countdown: boolean;
  story: boolean;
  details: boolean;
  gallery: boolean;
  map: boolean;
  gifts: boolean;
  rsvp: boolean;
  timeline: boolean;
  music: boolean;
}

export interface EventConfig {
  eventType: EventType;
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  address?: string;
  mapUrl?: string;
  theme: ThemeName;
  customColors?: { primary?: string; accent?: string; background?: string; text?: string };
  heroImage?: string;
  hostName?: string;
  sections: EventSections;
  story: StoryItem[];
  gallery: GalleryItem[];
  timeline: TimelineItem[];
  gifts: { title?: string; message?: string; links: GiftLink[] };
  rsvp: {
    enabled: boolean;
    deadline?: string;
    email?: string;
    endpoint?: string;
    phone?: string;
  };
  music?: { src: string; title?: string };
  confetti?: { enabled: boolean; count?: number };
}
