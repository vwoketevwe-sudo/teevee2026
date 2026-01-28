// app/upload/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CustomUploadZone } from "@/components/upload/custom-upload-zone";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toast } from "sonner";
import {
  Send,
  ArrowLeft,
  Info,
  Heart,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UploadPage() {
  const router = useRouter();
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [formData, setFormData] = useState({
    caption: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    videoUrl: "",
  });
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on media type
    if (mediaType === "image" && uploadedUrls.length === 0) {
      toast.error("Please upload at least one image first");
      return;
    }

    if (mediaType === "video" && !formData.videoUrl.trim()) {
      toast.error("Please enter a video URL");
      return;
    }

    if (!formData.caption.trim()) {
      toast.error("Please add a caption");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mediaType === "image") {
        // Submit each image with the same form data
        const promises = uploadedUrls.map((url) =>
          fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url,
              caption: formData.caption,
              mediaType: "image",
              guestName: formData.guestName || undefined,
              guestEmail: formData.guestEmail || undefined,
              guestPhone: formData.guestPhone || undefined,
            }),
          }),
        );

        const results = await Promise.all(promises);
        const allSuccessful = results.every((r) => r.ok);

        if (allSuccessful) {
          toast.success(
            `${uploadedUrls.length} photo${uploadedUrls.length > 1 ? "s" : ""} uploaded successfully! 🎉`,
            {
              description: "Your photos are now live in the gallery!",
              duration: 5000,
            },
          );
        } else {
          toast.error("Some photos failed to upload. Please try again.");
          setIsSubmitting(false);
          return;
        }
      } else {
        // Submit video URL
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: formData.videoUrl,
            caption: formData.caption,
            mediaType: "video",
            guestName: formData.guestName || undefined,
            guestEmail: formData.guestEmail || undefined,
            guestPhone: formData.guestPhone || undefined,
          }),
        });

        if (response.ok) {
          toast.success("Video uploaded successfully! 🎥", {
            description: "Your video is now live in the gallery!",
            duration: 5000,
          });
        } else {
          toast.error("Failed to upload video. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      // Send email notification toast
      if (formData.guestEmail) {
        toast.success(`Confirmation email sent to ${formData.guestEmail}`, {
          duration: 4000,
        });
      }

      // Reset form
      setFormData({
        caption: "",
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        videoUrl: "",
      });
      setUploadedUrls([]);

      // Navigate to gallery immediately
      setTimeout(() => {
        router.push("/gallery");
      }, 1500);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred while submitting");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-cream via-roseLight/20 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-regalWine rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-dustyPink rounded-full blur-3xl" />
      </div>

      {/* Floating Hearts */}
      <div className="absolute top-20 right-20 opacity-10">
        <Heart
          className="w-24 h-24 animate-float"
          fill="currentColor"
          style={{ color: "#6d1e3e" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-4 transition-colors hover:opacity-70"
              style={{ color: "#6d1e3e" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1
              className="text-4xl md:text-5xl font-cormorant font-bold mb-4"
              style={{ color: "#6d1e3e" }}
            >
              Share Your Memories
            </h1>
            <p className="text-lg text-gray-600 font-montserrat">
              Upload photos or videos from the wedding to our gallery
            </p>
          </div>

          {/* Instructions Alert */}
          <Alert
            className="mb-6"
            style={{
              borderColor: "#d4a5a5",
              backgroundColor: "rgba(212, 165, 165, 0.1)",
            }}
          >
            <Info className="h-4 w-4" style={{ color: "#6d1e3e" }} />
            <AlertDescription className="text-gray-700 font-montserrat">
              <strong className="font-semibold">How to upload:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                <li>Choose between uploading images or adding video URLs</li>
                <li>For images: Upload files and wait for completion</li>
                <li>For videos: Paste YouTube or Vimeo URL</li>
                <li>Add a required caption describing your media</li>
                <li>Optionally, add your contact details</li>
                <li>Click &quot;Submit&quot; to publish instantly</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl shadow-2xl p-6 md:p-10 space-y-8 border-2"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderColor: "#d4a5a5",
            }}
          >
            {/* Media Type Selection */}
            <div className="space-y-4">
              <Label
                className="text-lg font-medium"
                style={{ color: "#6d1e3e" }}
              >
                Step 1: Choose Media Type *
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMediaType("image")}
                  className="p-4 rounded-xl border-2 transition-all font-montserrat flex flex-col items-center gap-2"
                  style={{
                    backgroundColor:
                      mediaType === "image" ? "#6d1e3e" : "white",
                    color: mediaType === "image" ? "white" : "#2d1810",
                    borderColor: "#d4a5a5",
                    transform:
                      mediaType === "image" ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <ImageIcon className="w-6 h-6" />
                  <span className="font-semibold">Upload Photos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType("video")}
                  className="p-4 rounded-xl border-2 transition-all font-montserrat flex flex-col items-center gap-2"
                  style={{
                    backgroundColor:
                      mediaType === "video" ? "#6d1e3e" : "white",
                    color: mediaType === "video" ? "white" : "#2d1810",
                    borderColor: "#d4a5a5",
                    transform:
                      mediaType === "video" ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <Video className="w-6 h-6" />
                  <span className="font-semibold">Add Video URL</span>
                </button>
              </div>
            </div>

            {/* Upload Zone for Images */}
            {mediaType === "image" && (
              <div className="space-y-2">
                <Label
                  className="text-lg font-medium"
                  style={{ color: "#6d1e3e" }}
                >
                  Step 2: Upload Images *
                </Label>
                <p className="text-sm text-gray-500 mb-4 font-montserrat">
                  You can upload up to 5 images at once. Please wait for uploads
                  to complete.
                </p>
                <CustomUploadZone
                  onUploadComplete={setUploadedUrls}
                  maxFiles={5}
                />
              </div>
            )}

            {/* Video URL Input */}
            {mediaType === "video" && (
              <div className="space-y-2">
                <Label
                  htmlFor="videoUrl"
                  className="text-lg font-medium"
                  style={{ color: "#6d1e3e" }}
                >
                  Step 2: Enter Video URL *
                </Label>
                <p className="text-sm text-gray-500 mb-2 font-montserrat">
                  Paste a YouTube or Vimeo video URL
                </p>
                <Input
                  id="videoUrl"
                  required={mediaType === "video"}
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                  className="h-12 border-gray-300 focus:border-regalWine focus:ring-regalWine"
                />
                <p className="text-xs text-gray-500 font-montserrat">
                  Examples: YouTube, Vimeo, or other video platform URLs
                </p>
              </div>
            )}

            {/* Caption Field */}
            <div className="space-y-2">
              <Label
                htmlFor="caption"
                className="text-lg font-medium"
                style={{ color: "#6d1e3e" }}
              >
                Step 3: Add Caption *
              </Label>
              <p className="text-sm text-gray-500 mb-2 font-montserrat">
                Tell us about these beautiful moments
              </p>
              <Textarea
                id="caption"
                required
                value={formData.caption}
                onChange={(e) =>
                  setFormData({ ...formData, caption: e.target.value })
                }
                placeholder="Share the story behind these beautiful moments..."
                rows={4}
                className="resize-none border-gray-300 focus:border-regalWine focus:ring-regalWine"
              />
            </div>

            {/* Optional Details */}
            <div className="space-y-4">
              <Label
                className="text-lg font-medium"
                style={{ color: "#6d1e3e" }}
              >
                Step 4: Add Your Details (Optional)
              </Label>

              {/* Guest Name & Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="guestName"
                    className="text-base font-medium text-gray-700"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="guestName"
                    value={formData.guestName}
                    onChange={(e) =>
                      setFormData({ ...formData, guestName: e.target.value })
                    }
                    placeholder="John Doe"
                    className="h-11 border-gray-300 focus:border-regalWine focus:ring-regalWine"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="guestPhone"
                    className="text-base font-medium text-gray-700"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="guestPhone"
                    type="tel"
                    value={formData.guestPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, guestPhone: e.target.value })
                    }
                    placeholder="+234 800 000 0000"
                    className="h-11 border-gray-300 focus:border-regalWine focus:ring-regalWine"
                  />
                </div>
              </div>

              {/* Guest Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="guestEmail"
                  className="text-base font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={formData.guestEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, guestEmail: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="h-11 border-gray-300 focus:border-regalWine focus:ring-regalWine"
                />
                <p className="text-xs text-gray-500 font-montserrat">
                  We&apos;ll send you a confirmation email when your media is
                  published
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <AnimatedButton
              type="submit"
              disabled={
                isSubmitting ||
                (mediaType === "image" && uploadedUrls.length === 0) ||
                !formData.caption.trim()
              }
              loading={isSubmitting}
              className="w-full h-14 text-lg"
              size="lg"
              variant="primary"
              animation="slide"
            >
              <Send className="w-5 h-5" />
              {mediaType === "image"
                ? `Publish ${uploadedUrls.length || ""} ${uploadedUrls.length === 1 ? "Photo" : "Photos"} to Gallery`
                : "Publish Video to Gallery"}
            </AnimatedButton>

            {mediaType === "image" && uploadedUrls.length === 0 && (
              <p className="text-center text-sm text-gray-500 font-montserrat">
                📸 Upload at least one image to enable submission
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
