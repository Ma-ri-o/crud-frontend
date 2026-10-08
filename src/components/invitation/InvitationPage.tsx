"use client";

import type { EventConfig } from "@/types/event";
import { ThemeProvider } from "@/components/invitation/ThemeProvider";
import { FloatingDecorations } from "@/components/invitation/FloatingDecorations";
import { CountdownSection } from "@/components/invitation/CountdownSection";
import { GallerySection } from "@/components/invitation/GallerySection";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { RSVPSection } from "@/components/invitation/RSVPSection";
import { ShareTools } from "@/components/invitation/ShareTools";
import { EventDetailsSection, FooterSection, GiftSection, HeroSection, MapSection, StorySection, TimelineSection } from "@/components/invitation/Sections";

export function InvitationPage({ initialEvent }: { initialEvent: EventConfig }) {
  const event = initialEvent;
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
