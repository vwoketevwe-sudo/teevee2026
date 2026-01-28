// app/(main)/layout.tsx
import { Navigation } from "@/components/navigation";
import { RSVPSection } from "@/components/sections/rsvp-section";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navigation without fade effect for all pages except homepage */}
      <Navigation fadeOnScroll={false} />
      <main>{children}</main>
      <RSVPSection />
    </>
  );
}
