// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Mail, Heart, Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";
import { COUPLE } from "@/lib/constants";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        toast.error("Invalid credentials", {
          description: "Please check your email and password",
        });
      } else {
        toast.success("Welcome back! 🎉", {
          description: "Redirecting to dashboard...",
        });
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-roseLight/20 to-white relative overflow-hidden flex items-center justify-center p-4">
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

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{
              background: "linear-gradient(to bottom right, #6d1e3e, #d4a5a5)",
            }}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>

          <h1
            className="text-4xl md:text-5xl font-cormorant font-bold mb-2"
            style={{ color: "#6d1e3e" }}
          >
            Admin Access
          </h1>
          <p className="text-gray-600 font-montserrat mb-2">
            {COUPLE.hashtag} Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-3xl shadow-2xl p-8 md:p-10 border-2"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderColor: "#d4a5a5",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-base font-medium text-gray-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" style={{ color: "#6d1e3e" }} />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="h-12 border-gray-300 focus:border-regalWine focus:ring-regalWine"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-base font-medium text-gray-700 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" style={{ color: "#6d1e3e" }} />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 border-gray-300 focus:border-regalWine focus:ring-regalWine pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-regalWine transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <AnimatedButton
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              className="w-full h-14 text-lg"
              size="lg"
              variant="primary"
              animation="slide"
            >
              <Shield className="w-5 h-5" />
              Sign In
            </AnimatedButton>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-4">
            <p className="text-center text-sm text-gray-500">
              Secured access for authorized personnel only
            </p>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need an account?{" "}
                <Link
                  href="/admin/signup"
                  className="font-semibold hover:underline"
                  style={{ color: "#6d1e3e" }}
                >
                  Create admin account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-regalWine transition-colors"
          >
            <Heart className="w-4 h-4" fill="currentColor" />
            Back to Wedding Site
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
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
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
