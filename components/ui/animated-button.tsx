// components/ui/animated-button.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

const animatedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold font-montserrat transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        primary:
          "bg-regalWine text-white hover:bg-roseDark shadow-lg hover:shadow-xl hover:scale-105 focus-visible:ring-regalWine",
        secondary:
          "bg-dustyPink text-white hover:bg-roseLight hover:text-regalWine shadow-lg hover:shadow-xl hover:scale-105 focus-visible:ring-dustyPink",
        accent:
          "bg-chocolateBrown text-white hover:bg-roseDark shadow-lg hover:shadow-xl hover:scale-105 focus-visible:ring-chocolateBrown",
        outline:
          "border-2 border-regalWine text-regalWine bg-transparent hover:bg-regalWine hover:text-white shadow-md hover:shadow-lg hover:scale-105 focus-visible:ring-regalWine",
        ghost:
          "text-regalWine hover:bg-roseLight/20 hover:text-roseDark focus-visible:ring-regalWine",
        gradient:
          "bg-gradient-to-r from-regalWine to-dustyPink text-white hover:from-roseDark hover:to-roseLight shadow-lg hover:shadow-xl hover:scale-105 focus-visible:ring-regalWine",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        xl: "h-16 px-10 text-xl",
        icon: "h-11 w-11",
      },
      animation: {
        scale: "", // Default scale animation (already in variants)
        slide: "", // Slide effect
        glow: "", // Glow effect
        ripple: "", // Ripple effect
        shine: "", // Shine effect
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      animation: "scale",
    },
  },
);

export interface AnimatedButtonProps
  extends
    Omit<HTMLMotionProps<"button">, "ref">,
    VariantProps<typeof animatedButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      className,
      variant,
      size,
      animation = "scale",
      loading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <motion.button
        ref={ref}
        type={type}
        className={cn(animatedButtonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={
          animation === "scale"
            ? { scale: 1.05 }
            : animation === "slide"
              ? { y: -2 }
              : {}
        }
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
        {...props}
      >
        {/* Shine effect overlay */}
        {animation === "shine" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "100%" } : { x: "-100%" }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* Glow effect */}
        {animation === "glow" && isHovered && (
          <motion.div
            className="absolute inset-0 rounded-xl opacity-75 blur-xl"
            style={{
              background:
                variant === "primary"
                  ? "#6d1e3e"
                  : variant === "secondary"
                    ? "#d4a5a5"
                    : variant === "accent"
                      ? "#5d3a29"
                      : "#6d1e3e",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Ripple effect */}
        {animation === "ripple" && isHovered && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-white/50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.2, 1.4],
              opacity: [0.5, 0.3, 0],
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}

        {/* Slide underline effect */}
        {animation === "slide" && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
            initial={{ scaleX: 0 }}
            animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}

        {/* Button content */}
        <span className="relative z-10 flex items-center gap-2">
          {children as React.ReactNode}
        </span>
      </motion.button>
    );
  },
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, animatedButtonVariants };
