// components/sections/rsvp-section.tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatedButton } from "../ui/animated-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Image from "next/image";
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  Lock,
  ExternalLink,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import { IoLogoWhatsapp } from "react-icons/io5";
import { COUPLE, VENUE, WEDDING_DATE } from "@/lib/constants";
import Link from "next/link";

// Calculate end of reception (next day)
const getReceptionEndDate = () => {
  const receptionDate = new Date(WEDDING_DATE); // Wedding starts at 12:00 PM
  const endDate = new Date(receptionDate);
  endDate.setDate(endDate.getDate() + 1); // Next day
  endDate.setHours(0, 0, 0, 0); // Midnight of next day
  return endDate;
};

export function RSVPSection() {
  const ref = useScrollAnimation<HTMLElement>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEventOver, setIsEventOver] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attending: "yes",
    guestCount: 1,
    message: "",
  });

  useEffect(() => {
    const checkEventStatus = () => {
      const now = new Date();
      const receptionEnd = getReceptionEndDate();
      setIsEventOver(now > receptionEnd);
    };

    checkEventStatus();
    // Check every minute
    const interval = setInterval(checkEventStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          attending: formData.attending === "yes",
          guestCount: Number(formData.guestCount),
        }),
      });

      if (response.ok) {
        toast.success("RSVP submitted successfully! 🎉", {
          description: "We can't wait to celebrate with you!",
          duration: 5000,
        });
        setFormData({
          name: "",
          email: "",
          attending: "yes",
          guestCount: 1,
          message: "",
        });
      } else {
        toast.error("Failed to submit RSVP. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      ref={ref}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/teevee.jpeg"
          alt="Wedding background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-regalWine/95 via-roseDark/90 to-regalWine/98" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-white/30 rounded-tl-3xl" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-white/30 rounded-br-3xl" />

      {/* Floating Hearts */}
      <div className="absolute top-1/4 left-10 animate-float">
        <Heart className="w-8 h-8 text-dustyPink/40" fill="currentColor" />
      </div>
      <div className="absolute top-1/3 right-20 animate-float-delayed">
        <Heart className="w-6 h-6 text-roseLight/40" fill="currentColor" />
      </div>
      <div className="absolute bottom-1/4 left-20 animate-float-slow">
        <Heart className="w-7 h-7 text-dustyPink/30" fill="currentColor" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/50" />
              <Heart className="w-6 h-6 text-dustyPink" fill="currentColor" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/50" />
            </div>

            <h2 className="text-5xl md:text-6xl font-cormorant font-bold mb-4 text-white">
              {isEventOver
                ? "Thank You for Celebrating!"
                : "Join Our Celebration"}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-montserrat">
              {isEventOver
                ? "Our special day was made perfect by your presence and love"
                : "We would be honored to have you share in our special day"}
            </p>

            {/* Event Details Cards */}
            {!isEventOver && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <Calendar className="w-8 h-8 text-dustyPink mx-auto mb-2" />
                  <p className="text-white font-medium">March 07, 2026</p>
                  <p className="text-white/70 text-sm">Saturday</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <Clock className="w-8 h-8 text-dustyPink mx-auto mb-2" />
                  <p className="text-white font-medium">{VENUE.time}</p>
                  <p className="text-white/70 text-sm">Ceremony Begins</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <MapPin className="w-8 h-8 text-dustyPink mx-auto mb-2" />
                  <p className="text-white font-medium">Effurun Warri</p>
                  <p className="text-white/70 text-sm">Delta State</p>
                </div>
              </div>
            )}
          </div>

          {/* RSVP Form or Gallery Redirect */}
          {isEventOver ? (
            // Post-Event Gallery Card
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 space-y-6 border border-white/50 mb-16">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-regalWine to-dustyPink rounded-full mb-4">
                  <ImageIcon className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-cormorant font-bold text-gray-800 mb-2">
                  Relive Our Beautiful Memories
                </h3>

                <p className="text-gray-600 font-montserrat max-w-xl mx-auto leading-relaxed">
                  Our wedding day was filled with love, laughter, and
                  unforgettable moments. Browse through our wedding gallery to
                  see the beautiful memories we created together and the joyful
                  moments we shared with family and friends.
                </p>

                <div className="bg-roseLight/20 border-2 border-dustyPink rounded-2xl p-6 space-y-3">
                  <p className="text-regalWine font-semibold text-lg">
                    📸 Explore Our Wedding Gallery
                  </p>
                  <p className="text-roseDark text-sm">
                    View stunning photos from our ceremony, reception, and
                    special moments. Share your favorite memories with us!
                  </p>
                </div>
                <AnimatedButton
                  asChild
                  size="lg"
                  variant="primary"
                  animation="slide"
                >
                  <Link
                    href="/gallery"
                    className="flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-5 h-5" />
                    View Our Wedding Gallery
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </AnimatedButton>

                <p className="text-sm text-gray-500 mt-4">
                  Thank you for being part of our special day! 💕
                </p>
              </div>
            </div>
          ) : (
            // Pre-Event RSVP Form
            <form
              onSubmit={handleSubmit}
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 space-y-6 border border-white/50 mb-16"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-cormorant font-bold text-gray-800 mb-2">
                  We Hope You Can Join Us
                </h3>
                <p className="text-gray-600 font-montserrat">
                  Please confirm your attendance
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-base font-medium text-gray-700"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="h-12 border-gray-300 focus:border-regalWine focus:ring-regalWine"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-base font-medium text-gray-700"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    className="h-12 border-gray-300 focus:border-regalWine focus:ring-regalWine"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium text-gray-700">
                  Will you be attending? *
                </Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.attending === "yes"
                        ? "border-regalWine bg-roseLight/20"
                        : "border-gray-300 hover:border-dustyPink"
                    }`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={formData.attending === "yes"}
                      onChange={(e) =>
                        setFormData({ ...formData, attending: e.target.value })
                      }
                      className="w-5 h-5 text-regalWine"
                    />
                    <div>
                      <span className="font-medium text-gray-800">
                        Yes, I&apos;ll be there!
                      </span>
                      <p className="text-sm text-gray-500">
                        Can&apos;t wait to celebrate
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.attending === "no"
                        ? "border-regalWine bg-roseLight/20"
                        : "border-gray-300 hover:border-dustyPink"
                    }`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={formData.attending === "no"}
                      onChange={(e) =>
                        setFormData({ ...formData, attending: e.target.value })
                      }
                      className="w-5 h-5 text-regalWine"
                    />
                    <div>
                      <span className="font-medium text-gray-800">
                        Sorry, I can&apos;t make it
                      </span>
                      <p className="text-sm text-gray-500">
                        Will be there in spirit
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {formData.attending === "yes" && (
                <div className="space-y-2 animate-fade-in">
                  <Label
                    htmlFor="guestCount"
                    className="text-base font-medium text-gray-700"
                  >
                    Number of Guests *
                  </Label>
                  <Input
                    id="guestCount"
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.guestCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guestCount: Number(e.target.value),
                      })
                    }
                    className="h-12 border-gray-300 focus:border-regalWine focus:ring-regalWine"
                  />
                  <p className="text-sm text-gray-500">Including yourself</p>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-base font-medium text-gray-700"
                >
                  Special Message{" "}
                  <span className="text-gray-400 text-sm">(Optional)</span>
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Dietary requirements, song requests, or warm wishes for the couple..."
                  rows={4}
                  className="resize-none border-gray-300 focus:border-regalWine focus:ring-regalWine"
                />
              </div>
              <AnimatedButton
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full h-14 text-lg"
                size="lg"
                variant="primary"
                animation="slide"
              >
                <Heart className="w-5 h-5" fill="currentColor" />
                Confirm Your Presence
              </AnimatedButton>

              <p className="text-center text-sm text-gray-500 mt-4">
                We look forward to celebrating with you! 💕
              </p>
            </form>
          )}

          {/* Footer Content with Couple Info */}
          <div className="text-center space-y-6 pb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Heart className="w-6 h-6 fill-current text-dustyPink animate-pulse-soft" />
              <h3 className="text-4xl font-great-vibes text-dustyPink">
                {COUPLE.bride.name} & {COUPLE.groom.name}
              </h3>
              <Heart className="w-6 h-6 fill-current text-dustyPink animate-pulse-soft" />
            </div>

            <p className="text-white/90 mb-2 font-cormorant text-xl">
              March 07, 2026
            </p>
            <p className="text-white/70 mb-8 font-montserrat">
              Effurun Warri, Delta State, Nigeria
            </p>

            {/* Calstins Ltd Branding */}
            <div className="border-t border-white/20 pt-8 mt-8">
              <div className="flex flex-col items-center gap-4 mb-6">
                <p className="text-white/70 text-sm font-montserrat">
                  Powered By
                </p>

                {/* Calstins Logo */}
                <Link
                  href="https://calstins.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="relative transition-transform duration-300 group-hover:scale-105">
                    <h3 className="text-4xl md:text-5xl font-bold text-white">
                      <span className="text-dustyPink">Cal</span>stins{" "}
                      <small>Ltd</small>
                      <span className="text-dustyPink">.</span>
                    </h3>
                    <p className="text-white/60 text-xs tracking-wider uppercase text-center mt-1">
                      Software Solutions
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                </Link>

                {/* Brand Description */}
                <div className="max-w-md mx-auto space-y-3">
                  <p className="text-white/80 text-sm font-montserrat leading-relaxed">
                    Creating beautiful, memorable digital experiences for your
                    special day
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-6">
                    <Link
                      href="https://wa.me/message/CG3LAD7E3C2VL1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 text-sm group"
                    >
                      <IoLogoWhatsapp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>WhatsApp Us</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    <Link
                      href="https://calstins.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 text-sm group"
                    >
                      <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>Visit Website</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/20 pt-6 mt-6 space-y-4">
              <p className="text-sm text-white/70 font-montserrat">
                © 2026 {COUPLE.hashtag}. All rights reserved. Made with{" "}
                <Heart className="w-4 h-4 inline fill-current text-dustyPink animate-pulse-soft" />{" "}
                and joy.
              </p>

              {/* Admin Login Link */}
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors duration-300"
              >
                <Lock className="w-3 h-3" />
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
