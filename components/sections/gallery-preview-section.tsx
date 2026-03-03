// components/sections/gallery-preview-section.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { AnimatedButton } from "../ui/animated-button";
import { ArrowRight, Heart } from "lucide-react";

export function GalleryPreviewSection() {
  const ref = useScrollAnimation<HTMLElement>();

  const previewImages = [
    "/assets/images/teevee.jpeg",
    "/assets/images/photo1.jpeg",
    "/assets/images/photo2.jpeg",
    "/assets/images/photo3.jpeg",
  ];

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-b from-cream via-roseLight/30 to-white relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 opacity-10">
        <Heart className="w-32 h-32 text-regalWine" fill="currentColor" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-10">
        <Heart className="w-32 h-32 text-dustyPink" fill="currentColor" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-cormorant font-bold mb-4 text-regalWine">
            Our Gallery
          </h2>
          <p className="text-lg text-gray-600 font-montserrat">
            Memories captured in time
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto mb-12">
          {previewImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group border-4 border-white"
            >
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-regalWine/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        <div className="text-center">
          <AnimatedButton
            variant="primary"
            size="lg"
            className="font-semibold"
            animation="slide"
          >
            <Link href="/gallery" className="flex items-center gap-2">
              View Full Gallery
              <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}
