// components/navigation.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COUPLE } from "@/lib/constants";

interface NavigationProps {
  fadeOnScroll?: boolean; // New prop to control scroll behavior
}

export function Navigation({ fadeOnScroll = false }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(!fadeOnScroll); // Start visible if not fading

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      if (fadeOnScroll) {
        // Show nav when scrolled down, hide at top
        setIsVisible(scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fadeOnScroll]);

  const navLinks = [
    { href: "/#story", label: "Our Story" },
    { href: "/#events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/#rsvp", label: "RSVP" },
    { href: "/venue", label: "Find Venue" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white/80 backdrop-blur-sm"
      } ${
        fadeOnScroll && !isVisible
          ? "opacity-0 -translate-y-full pointer-events-none"
          : "opacity-100 translate-y-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Heart
              className={`w-6 h-6 transition-colors ${
                isScrolled ? "text-regalWine" : "text-roseDark"
              } group-hover:text-dustyPink`}
              fill="currentColor"
            />
            <span
              className="text-2xl md:text-3xl font-great-vibes group-hover:opacity-80 transition-opacity"
              style={{ color: "#6d1e3e" }}
            >
              {COUPLE.hashtag}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 transition-colors font-medium font-montserrat relative group"
                style={{
                  color: isScrolled ? "#2d1810" : "#6b5d55",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6d1e3e")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isScrolled
                    ? "#2d1810"
                    : "#6b5d55")
                }
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{
                    background: "linear-gradient(to right, #6d1e3e, #d4a5a5)",
                  }}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-roseLight/20"
            style={{ color: "#6d1e3e" }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block transition-colors font-medium font-montserrat py-2 px-4 rounded-lg"
                style={{ color: "#2d1810" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#6d1e3e";
                  e.currentTarget.style.backgroundColor = "#e8c5c5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#2d1810";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
