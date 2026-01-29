"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/countdown-timer";
import { Button } from "@/components/ui/button";
import { COUPLE, WEDDING_DATE } from "@/lib/constants";
import { Heart, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

type FloatingHeart = {
  id: number;
  x: number;
  duration: number;
  delay: number;
  size: number;
  color: string;
};

export function HeroSection() {
  const isPastWedding = new Date() > WEDDING_DATE;

  // Heart colors gradient from pink to burgundy
  const heartColors = ["#e8c5c5", "#d4a5a5", "#c08a8a", "#8b3a4f", "#6d1e3e"];

  const [floatingHearts] = useState<FloatingHeart[]>(() => {
    if (typeof window === "undefined") return [];

    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      duration: 8 + Math.random() * 4,
      delay: Math.random() * 5,
      size: 20 + Math.random() * 30,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
    }));
  });

  if (floatingHearts.length === 0) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/couple-pouring-dring.png"
          alt="Wedding couple"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-regalWine/80 via-dustyPink/60 to-cream/95" />
      </div>

      {/* Faded Floral Decorations - Top Left */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 opacity-20 pointer-events-none z-5">
        <div className="relative w-full h-full">
          {/* Rose clusters */}
          <div className="absolute top-8 left-8 w-20 h-20 rounded-full bg-gradient-to-br from-regalWine to-roseDark opacity-60 blur-sm" />
          <div className="absolute top-16 left-24 w-16 h-16 rounded-full bg-gradient-to-br from-dustyPink to-roseLight opacity-50 blur-sm" />
          <div className="absolute top-4 left-20 w-14 h-14 rounded-full bg-gradient-to-br from-roseDark to-regalWine opacity-40 blur-sm" />
          {/* Leaves */}
          <div className="absolute top-20 left-12 w-12 h-8 rounded-full bg-gradient-to-br from-green-800/30 to-green-600/20 rotate-45 blur-sm" />
          <div className="absolute top-12 left-32 w-10 h-6 rounded-full bg-gradient-to-br from-green-700/30 to-green-500/20 -rotate-45 blur-sm" />
        </div>
      </div>

      {/* Faded Floral Decorations - Top Right */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-20 pointer-events-none z-5">
        <div className="relative w-full h-full">
          {/* Rose clusters */}
          <div className="absolute top-12 right-8 w-18 h-18 rounded-full bg-gradient-to-br from-regalWine to-roseDark opacity-60 blur-sm" />
          <div className="absolute top-8 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-dustyPink to-roseLight opacity-50 blur-sm" />
          <div className="absolute top-20 right-16 w-14 h-14 rounded-full bg-gradient-to-br from-roseLight to-dustyPink opacity-40 blur-sm" />
          {/* Leaves */}
          <div className="absolute top-16 right-28 w-12 h-8 rounded-full bg-gradient-to-br from-green-800/30 to-green-600/20 -rotate-45 blur-sm" />
        </div>
      </div>

      {/* Faded Floral Decorations - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-80 md:h-80 opacity-20 pointer-events-none z-5">
        <div className="relative w-full h-full">
          {/* Rose clusters */}
          <div className="absolute bottom-8 left-12 w-20 h-20 rounded-full bg-gradient-to-br from-regalWine to-roseDark opacity-60 blur-sm" />
          <div className="absolute bottom-16 left-24 w-16 h-16 rounded-full bg-gradient-to-br from-dustyPink to-roseLight opacity-50 blur-sm" />
          <div className="absolute bottom-12 left-8 w-14 h-14 rounded-full bg-gradient-to-br from-roseDark to-regalWine opacity-40 blur-sm" />
        </div>
      </div>

      {/* Faded Floral Decorations - Bottom Right */}
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-80 md:h-80 opacity-20 pointer-events-none z-5">
        <div className="relative w-full h-full">
          {/* Rose clusters */}
          <div className="absolute bottom-12 right-8 w-18 h-18 rounded-full bg-gradient-to-br from-regalWine to-roseDark opacity-60 blur-sm" />
          <div className="absolute bottom-8 right-24 w-16 h-16 rounded-full bg-gradient-to-br from-dustyPink to-roseLight opacity-50 blur-sm" />
          <div className="absolute bottom-20 right-16 w-14 h-14 rounded-full bg-gradient-to-br from-roseLight to-dustyPink opacity-40 blur-sm" />
        </div>
      </div>

      {/* Floating Hearts with Gradient Colors */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute"
            initial={{
              x: heart.x,
              y: window.innerHeight + 100,
              opacity: 0,
            }}
            animate={{
              y: -100,
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: "linear",
            }}
          >
            <Heart
              style={{ color: heart.color }}
              fill="currentColor"
              size={heart.size}
            />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Wedding Theme */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mb-8"
          >
            <div className="inline-block">
              <div className="flex items-center gap-4 mb-2">
                <div
                  className="h-px w-12"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, #d4a5a5, #6d1e3e)",
                  }}
                />
                <Heart
                  className="w-6 h-6 animate-pulse-soft"
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
              <h2
                className="font-great-vibes text-6xl md:text-8xl lg:text-9xl mb-2"
                style={{
                  color: "#ffffff",
                  textShadow:
                    "2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(109, 30, 62, 0.5)",
                }}
              >
                {/* {COUPLE.hashtag} */}
                #TV2026
              </h2>
              <p
                className="text-sm md:text-base font-semibold tracking-[0.3em] uppercase"
                style={{
                  color: "#e8c5c5",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                Our Love Story
              </p>
            </div>
          </motion.div>

          {/* Couple Names */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <h1 className="font-cormorant text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span
                style={{
                  color: "#ffffff",
                  textShadow:
                    "3px 3px 6px rgba(0,0,0,0.4), 0 0 30px rgba(109, 30, 62, 0.6)",
                }}
              >
                {COUPLE.bride.name}
              </span>
              <span
                className="block text-3xl md:text-4xl my-4 font-great-vibes"
                style={{
                  color: "#d4a5a5",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                &
              </span>
              <span
                style={{
                  color: "#ffffff",
                  textShadow:
                    "3px 3px 6px rgba(0,0,0,0.4), 0 0 30px rgba(109, 30, 62, 0.6)",
                }}
              >
                {COUPLE.groom.name}
              </span>
            </h1>
          </motion.div>

          {/* Date with Background for Better Visibility */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Calendar className="w-5 h-5" style={{ color: "#d4a5a5" }} />
              <p
                className="text-xl md:text-2xl font-cormorant font-semibold"
                style={{
                  color: "#ffffff",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                {isPastWedding ? "Married on March 07, 2026" : "March 07, 2026"}
              </p>
            </div>
          </motion.div>

          {/* Countdown / Gallery */}
          {!isPastWedding ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-12"
            >
              <CountdownTimer />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-12 space-y-4"
            >
              <div
                className="rounded-2xl p-8 max-w-md mx-auto shadow-2xl border-2"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(12px)",
                  borderColor: "#d4a5a5",
                }}
              >
                <Heart
                  className="w-16 h-16 mx-auto mb-4 animate-pulse-soft"
                  fill="currentColor"
                  style={{ color: "#6d1e3e" }}
                />
                <h3
                  className="text-3xl font-cormorant font-bold mb-2"
                  style={{ color: "#2d1810" }}
                >
                  We&apos;re Married! 🎉
                </h3>
                <p className="mb-6" style={{ color: "#6b5d55" }}>
                  Thank you for celebrating with us. Relive our special day in
                  our gallery.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="w-full font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{
                    background: "linear-gradient(to right, #6d1e3e, #d4a5a5)",
                    color: "#ffffff",
                  }}
                >
                  <Link
                    href="/gallery"
                    className="flex items-center justify-center gap-2"
                  >
                    View Our Gallery
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
