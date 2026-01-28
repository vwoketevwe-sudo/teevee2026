// components/gallery/gallery-page-client.tsx
"use client";

import { GalleryClient } from "@/components/gallery/gallery-client";
import { AnimatedButton } from "@/components/ui/animated-button";
import Link from "next/link";
import type { GalleryImage } from "@/types/photo";
import {
  Heart,
  Upload,
  AlertCircle,
  Video,
  Image as ImageIcon,
} from "lucide-react";

interface GalleryPageClientProps {
  initialImages: GalleryImage[];
}

export function GalleryPageClient({ initialImages }: GalleryPageClientProps) {
  const hasDbError = initialImages.length === 0;
  const defaultImages = ["/assets/images/teevee.jpeg"];

  // Count media types
  const imageCount = initialImages.filter(
    (m) => m.mediaType === "image",
  ).length;
  const videoCount = initialImages.filter(
    (m) => m.mediaType === "video",
  ).length;
  const totalCount = initialImages.length + defaultImages.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-roseLight/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-regalWine rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-dustyPink rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-roseDark rounded-full blur-3xl" />
      </div>

      {/* Floating Hearts */}
      <div className="absolute top-20 right-20 opacity-10">
        <Heart
          className="w-24 h-24 animate-float"
          fill="currentColor"
          style={{ color: "#6d1e3e" }}
        />
      </div>
      <div className="absolute bottom-40 left-10 opacity-10">
        <Heart
          className="w-32 h-32 animate-float-slow"
          fill="currentColor"
          style={{ color: "#d4a5a5" }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div
              className="h-px w-12"
              style={{
                background:
                  "linear-gradient(to right, transparent, #d4a5a5, #6d1e3e)",
              }}
            />
            <Heart
              className="w-6 h-6"
              fill="currentColor"
              style={{ color: "#8b3a4f" }}
            />
            <div
              className="h-px w-12"
              style={{
                background:
                  "linear-gradient(to left, transparent, #d4a5a5, #6d1e3e)",
              }}
            />
          </div>

          <h1
            className="text-6xl md:text-7xl font-cormorant font-bold mb-4"
            style={{ color: "#6d1e3e" }}
          >
            Our Gallery
          </h1>

          <p className="text-xl text-gray-600 mb-8 font-montserrat max-w-2xl mx-auto">
            Every moment, every smile, every memory—captured forever in time
          </p>

          {/* Database Error Notice */}
          {hasDbError && (
            <div
              className="max-w-2xl mx-auto mb-8 p-4 rounded-xl border-2"
              style={{
                backgroundColor: "rgba(212, 165, 165, 0.1)",
                borderColor: "#d4a5a5",
              }}
            >
              <div className="flex items-center justify-center gap-2 text-roseDark">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm font-montserrat">
                  Unable to load uploaded media. Showing default gallery images.
                </p>
              </div>
            </div>
          )}

          {/* Media Count and Upload Button Container */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <div
              className="rounded-2xl px-8 py-4 shadow-lg border-2"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(8px)",
                borderColor: "#d4a5a5",
              }}
            >
              <p
                className="font-cormorant text-lg"
                style={{ color: "#6d1e3e" }}
              >
                <span className="font-bold">{totalCount}</span> beautiful
                moments
              </p>
              {(imageCount > 0 || videoCount > 0) && (
                <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-600 font-montserrat">
                  {imageCount > 0 && (
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      {imageCount} {imageCount === 1 ? "photo" : "photos"}
                    </span>
                  )}
                  {videoCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      {videoCount} {videoCount === 1 ? "video" : "videos"}
                    </span>
                  )}
                </div>
              )}
            </div>

            <Link href="/upload">
              <AnimatedButton size="lg" variant="primary" animation="slide">
                <Upload className="w-5 h-5" />
                Share Memories
              </AnimatedButton>
            </Link>
          </div>
        </div>

        {/* Gallery Grid */}
        <GalleryClient
          initialImages={initialImages}
          defaultImages={defaultImages}
        />
      </div>
    </div>
  );
}
