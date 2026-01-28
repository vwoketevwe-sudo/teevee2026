// app/page.tsx
import { HeroSection } from "@/components/sections/hero-section";
import { StorySection } from "@/components/sections/story-section";
import { EventDetailsSection } from "@/components/sections/event-details-section";
import { RSVPSection } from "@/components/sections/rsvp-section";
import { GalleryPreviewSection as GalleryPreview } from "@/components/sections/gallery-preview-section";
import { Navigation } from "@/components/navigation";

export default function Home() {
  return (
    <>
      {/* Navigation with scroll fade effect - only on homepage */}
      <Navigation fadeOnScroll={true} />

      <main className="min-h-screen">
        <HeroSection />
        <StorySection />
        <EventDetailsSection />
        <GalleryPreview />
        <RSVPSection />
      </main>
    </>
  );
}
