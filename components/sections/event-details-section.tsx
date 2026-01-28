// components/sections/event-details-section.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Heart } from "lucide-react";
import { VENUE, COLOR_SCHEME, FAMILIES, TOAST } from "@/lib/constants";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Link from "next/link";
import Image from "next/image";

export function EventDetailsSection() {
  const ref = useScrollAnimation<HTMLElement>();

  return (
    <section
      id="events"
      ref={ref}
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Floral SVG Background Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/flowers1.svg"
          alt=""
          fill
          className="object-cover opacity-[0.08]"
          style={{
            mixBlendMode: "multiply",
          }}
          priority
        />
      </div>

      {/* Decorative Background Blurs */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-[1]">
        <div className="absolute top-20 left-20 w-72 h-72 bg-regalWine rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-dustyPink rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-5xl md:text-6xl font-cormorant font-bold mb-4"
            style={{ color: "#6d1e3e" }}
          >
            Event Details
          </h2>
        </div>

        {/* Family Invitation Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div
            className="bg-gradient-to-br from-cream via-white to-roseLight/20 rounded-3xl p-8 md:p-12 border-2 shadow-xl backdrop-blur-sm"
            style={{ borderColor: "#d4a5a5" }}
          >
            <div className="text-center space-y-6">
              {/* Decorative Line */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div
                  className="h-px w-16"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, #6d1e3e)",
                  }}
                />
                <Heart
                  className="w-5 h-5"
                  fill="currentColor"
                  style={{ color: "#8b3a4f" }}
                />
                <div
                  className="h-px w-16"
                  style={{
                    background:
                      "linear-gradient(to left, transparent, #6d1e3e)",
                  }}
                />
              </div>

              {/* Invitation Text */}
              <div className="space-y-4">
                <p
                  className="text-lg md:text-xl font-cormorant"
                  style={{ color: "#2d1810" }}
                >
                  {FAMILIES.bride.name}
                </p>
                <h3
                  className="text-2xl md:text-3xl font-cormorant font-bold"
                  style={{ color: "#6d1e3e" }}
                >
                  {FAMILIES.bride.detail}
                </h3>
                <p
                  className="text-base md:text-lg font-montserrat leading-relaxed whitespace-pre-line"
                  style={{ color: "#6b5d55" }}
                >
                  {FAMILIES.bride.location}
                </p>
              </div>

              {/* Divider */}
              <div className="py-4">
                <div
                  className="h-px w-32 mx-auto"
                  style={{ backgroundColor: "#d4a5a5" }}
                />
              </div>

              {/* Groom's Family */}
              <div className="space-y-4">
                <h3
                  className="text-2xl md:text-3xl font-cormorant font-bold"
                  style={{ color: "#6d1e3e" }}
                >
                  {FAMILIES.groom.name}
                </h3>
                <p
                  className="text-base md:text-lg font-montserrat leading-relaxed whitespace-pre-line"
                  style={{ color: "#6b5d55" }}
                >
                  {FAMILIES.groom.location}
                </p>
              </div>

              {/* Cordially Invites */}
              <div className="pt-6">
                <p
                  className="text-2xl md:text-3xl font-great-vibes mb-2"
                  style={{ color: "#8b3a4f" }}
                >
                  Cordially invite you to
                </p>
                <p
                  className="text-xl md:text-2xl font-cormorant"
                  style={{ color: "#2d1810" }}
                >
                  the wedding ceremony of their children
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <Link href="/venue" className="no-underline">
            <Card
              className="bg-gradient-to-br from-cream via-roseLight/20 to-dustyPink/20 border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm"
              style={{ borderColor: "#d4a5a5" }}
            >
              <CardHeader>
                <div
                  className="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md"
                  style={{ backgroundColor: "#6d1e3e" }}
                >
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle
                  className="text-3xl font-cormorant font-bold text-center"
                  style={{ color: "#6d1e3e" }}
                >
                  Be Our Guest
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Calendar className="w-6 h-6" style={{ color: "#6d1e3e" }} />
                  <span className="font-medium text-lg">March 07, 2026</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Clock className="w-6 h-6" style={{ color: "#6d1e3e" }} />
                  <span className="font-medium text-lg">{VENUE.time}</span>
                </div>
                <div
                  className="bg-white/80 rounded-xl p-6 border backdrop-blur-sm"
                  style={{ borderColor: "#d4a5a5" }}
                >
                  <div className="flex items-start justify-center gap-3 text-gray-700">
                    <MapPin
                      className="w-6 h-6 mt-1 flex-shrink-0"
                      style={{ color: "#6d1e3e" }}
                    />
                    <div className="text-left">
                      <p
                        className="font-bold text-xl mb-2"
                        style={{ color: "#6d1e3e" }}
                      >
                        {VENUE.title}
                      </p>
                      <p className="text-base leading-relaxed">
                        {VENUE.address}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Toast Section - Made Bigger and More Prominent */}
        <div className="mt-16 mb-16 px-4">
          <div
            className="max-w-3xl mx-auto rounded-3xl px-8 md:px-12 py-12 md:py-16 shadow-2xl backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, #6d1e3e 0%, #8b3a4f 100%)",
            }}
          >
            <div className="text-center space-y-6">
              <h3
                className="text-4xl md:text-5xl font-cormorant font-bold text-white mb-8"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Toast
              </h3>
              <p
                className="text-2xl md:text-4xl font-cormorant leading-relaxed text-white whitespace-pre-line"
                style={{
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                {TOAST.text}
              </p>
              <div className="pt-6">
                <p
                  className="text-2xl md:text-3xl font-great-vibes text-roseLight"
                  style={{
                    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {TOAST.attribution}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Colours of the Day Section - Made Smaller */}
        <div className="mt-16">
          <h3
            className="text-2xl md:text-3xl font-cormorant font-bold text-center mb-8"
            style={{ color: "#6d1e3e" }}
          >
            Colours of the Day
          </h3>

          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* Family - Regal Wine */}
            <div
              className="bg-white rounded-xl p-4 border-2 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
              style={{ borderColor: COLOR_SCHEME.family.color }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 shadow-md"
                style={{ backgroundColor: COLOR_SCHEME.family.color }}
              />
              <h4
                className="text-sm md:text-base font-cormorant font-bold text-center mb-1"
                style={{ color: COLOR_SCHEME.family.color }}
              >
                {COLOR_SCHEME.family.name}
              </h4>
              <p className="text-xs text-center text-gray-600 font-medium">
                {COLOR_SCHEME.family.label}
              </p>
            </div>

            {/* Bridal Party - Dusty Pink */}
            <div
              className="bg-white rounded-xl p-4 border-2 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
              style={{ borderColor: COLOR_SCHEME.bridalParty.color }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 shadow-md"
                style={{ backgroundColor: COLOR_SCHEME.bridalParty.color }}
              />
              <h4
                className="text-sm md:text-base font-cormorant font-bold text-center mb-1"
                style={{ color: COLOR_SCHEME.bridalParty.color }}
              >
                {COLOR_SCHEME.bridalParty.name}
              </h4>
              <p className="text-xs text-center text-gray-600 font-medium">
                {COLOR_SCHEME.bridalParty.label}
              </p>
            </div>

            {/* Asoebi - Chocolate Brown */}
            <div
              className="bg-white rounded-xl p-4 border-2 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
              style={{ borderColor: COLOR_SCHEME.asoebi.color }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 shadow-md"
                style={{ backgroundColor: COLOR_SCHEME.asoebi.color }}
              />
              <h4
                className="text-sm md:text-base font-cormorant font-bold text-center mb-1"
                style={{ color: COLOR_SCHEME.asoebi.color }}
              >
                {COLOR_SCHEME.asoebi.name}
              </h4>
              <p className="text-xs text-center text-gray-600 font-medium">
                {COLOR_SCHEME.asoebi.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
