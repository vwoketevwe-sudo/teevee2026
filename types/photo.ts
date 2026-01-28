// types/photo.ts
export interface GalleryImageUpload {
  url: string;
  caption: string;
  mediaType?: "image" | "video"; // Optional for backward compatibility, defaults to 'image'
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
}

export interface GalleryImage extends GalleryImageUpload {
  id: string;
  mediaType: "image" | "video"; // Required in the database model
  uploadedAt: Date | string;
  updatedAt: Date | string;
}

// Helper type for API responses
export interface GalleryImageResponse {
  id: string;
  url: string;
  caption: string;
  mediaType: "image" | "video";
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  uploadedAt: string;
  updatedAt: string;
}

// Type guard to check if media is a video
export function isVideo(media: GalleryImage): boolean {
  return media.mediaType === "video";
}

// Type guard to check if media is an image
export function isImage(media: GalleryImage): boolean {
  return media.mediaType === "image";
}
