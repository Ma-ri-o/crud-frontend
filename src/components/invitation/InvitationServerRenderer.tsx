import dynamic from "next/dynamic";
import type { EventConfig } from "@/types/event";
import { ThemeProvider } from "@/components/invitation/ThemeProvider";
import { EventDetailsSection, FooterSection, GiftSection, HeroSection, MapSection, StorySection, TimelineSection } from "@/components/invitation/Sections";

const FloatingDecorations = dynamic(() => import("@/components/invitation/FloatingDecorations").then((module) => module.FloatingDecorations));
const CountdownSection = dynamic(() => import("@/components/invitation/CountdownSection").then((module) => module.CountdownSection));
const GallerySection = dynamic(() => import("@/components/invitation/GallerySection").then((module) => module.GallerySection));
const MusicPlayer = dynamic(() => import("@/components/invitation/MusicPlayer").then((module) => module.MusicPlayer));
const RSVPSection = dynamic(() => import("@/components/invitation/RSVPSection").then((module) => module.RSVPSection));
const ShareTools = dynamic(() => import("@/components/invitation/ShareTools").then((module) => module.ShareTools));

export function InvitationServerRenderer({ event }: { event: EventConfig }) {
  const { sections } = event;
  return <ThemeProvider theme={event.theme} customColors={event.customColors}>
    <FloatingDecorations confetti={event.confetti?.enabled} count={event.confetti?.count} />
    {sections.music && event.music?.src && <MusicPlayer src={event.music.src} title={event.music.title} />}
    <ShareTools title={event.title} />
    <main>
      <HeroSection event={event} />
      {sections.countdown && <CountdownSection date={event.date} time={event.time} />}
      {sections.story && event.story.length > 0 && <StorySection story={event.story} hostName={event.hostName} />}
      {sections.details && <EventDetailsSection event={event} />}
      {sections.gallery && event.gallery.length > 0 && <GallerySection images={event.gallery} />}
      {sections.timeline && event.timeline.length > 0 && <TimelineSection timeline={event.timeline} />}
      {sections.map && <MapSection event={event} />}
      {sections.gifts && <GiftSection gifts={event.gifts} />}
      {sections.rsvp && event.rsvp.enabled && <RSVPSection event={event} config={event.rsvp} />}
      <FooterSection event={event} />
    </main>
  </ThemeProvider>;
}
