// app/(main)/gallery/page.tsx
import { GalleryPageClient } from "@/components/gallery/gallery-page-client";
import { prisma } from "@/lib/db/prisma";
import type { GalleryImage } from "@/types/photo";

async function getInitialGalleryImages(): Promise<GalleryImage[]> {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { uploadedAt: "desc" },
      take: 12,
    });
    return images.map(img => ({
      ...img,
      mediaType: img.mediaType as "image" | "video",
    }));
  } catch (error) {
    console.error("Failed to fetch gallery images:", error);
    return [];
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function GalleryPage() {
  const initialImages = await getInitialGalleryImages();
  return <GalleryPageClient initialImages={initialImages} />;
}
