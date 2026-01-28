// app/admin/dashboard/photos/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/auth-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnimatedButton } from "@/components/ui/animated-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Eye,
  Upload,
  ChevronLeft,
  ChevronRight,
  Video,
  ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEmbedUrl } from "@/lib/utils/video";

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  mediaType: "image" | "video";
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  uploadedAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminPhotosPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [media, setMedia] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMedia, setTotalMedia] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/admin/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchMedia();
    }
  }, [session, currentPage]);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      const response = await fetch(
        `/api/photos?skip=${skip}&take=${ITEMS_PER_PAGE}`,
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Failed to fetch media");
      }

      setMedia(data.data);

      // Get total count
      const countResponse = await fetch("/api/photos/count");
      const countData = await countResponse.json();
      if (countData.success) {
        setTotalMedia(countData.count);
      }
    } catch (error) {
      toast.error("Failed to fetch media");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setMediaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mediaToDelete) return;

    try {
      const response = await fetch(`/api/photos?id=${mediaToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete media");

      toast.success("Media deleted successfully");
      fetchMedia();
    } catch (error) {
      toast.error("Failed to delete media");
      console.error("Delete error:", error);
    } finally {
      setDeleteDialogOpen(false);
      setMediaToDelete(null);
    }
  };

  const handleViewMedia = (item: GalleryImage) => {
    if (item.mediaType === "video") {
      const embedUrl = getEmbedUrl(item.url);
      if (embedUrl) {
        window.open(embedUrl, "_blank");
      } else {
        window.open(item.url, "_blank");
      }
    } else {
      window.open(item.url, "_blank");
    }
  };

  const formatDate = (dateString: string) => {
    if (!isMounted) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!isMounted) return "";

    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(totalMedia / ITEMS_PER_PAGE);

  const imageCount = media.filter((m) => m.mediaType === "image").length;
  const videoCount = media.filter((m) => m.mediaType === "video").length;

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#6d1e3e" }}
          ></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-cream via-roseLight/20 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <AnimatedButton variant="ghost" size="icon" animation="scale">
                <ArrowLeft className="w-5 h-5" />
              </AnimatedButton>
            </Link>
            <div>
              <h1
                className="text-2xl md:text-3xl font-cormorant font-bold"
                style={{ color: "#6d1e3e" }}
              >
                Gallery Management
              </h1>
              <p className="text-gray-600 mt-1 font-montserrat">
                {totalMedia} items • {imageCount} photos • {videoCount} videos
              </p>
            </div>
          </div>

          {/* Upload Button */}
          <Link href="/upload" className="w-full sm:w-auto">
            <AnimatedButton
              variant="primary"
              size="lg"
              animation="slide"
              className="w-full"
            >
              <Upload className="w-4 h-4" />
              Upload Media
            </AnimatedButton>
          </Link>
        </div>

        <div
          className="rounded-2xl shadow-xl overflow-hidden border-2"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderColor: "#d4a5a5",
          }}
        >
          {media.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow
                      style={{ backgroundColor: "rgba(212, 165, 165, 0.1)" }}
                    >
                      <TableHead className="w-24">Preview</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Caption</TableHead>
                      <TableHead>Guest Info</TableHead>
                      <TableHead>Date Uploaded</TableHead>
                      <TableHead className="text-right min-w-[120px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {media.map((item) => (
                      <TableRow key={item.id} className="hover:bg-roseLight/10">
                        <TableCell>
                          <div
                            className="relative w-20 h-20 rounded-lg overflow-hidden border-2"
                            style={{ borderColor: "#d4a5a5" }}
                          >
                            {item.mediaType === "video" ? (
                              <div className="w-full h-full bg-gradient-to-br from-regalWine to-dustyPink flex items-center justify-center">
                                <Video className="w-8 h-8 text-white" />
                              </div>
                            ) : (
                              <Image
                                src={item.url}
                                alt={item.caption}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.mediaType === "video"
                                ? "default"
                                : "secondary"
                            }
                            style={{
                              backgroundColor:
                                item.mediaType === "video"
                                  ? "#6d1e3e"
                                  : "#d4a5a5",
                              color: "white",
                            }}
                          >
                            {item.mediaType === "video" ? (
                              <>
                                <Video className="w-3 h-3 mr-1" /> Video
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-3 h-3 mr-1" /> Photo
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="line-clamp-2 text-sm">{item.caption}</p>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">
                              {item.guestName || "Anonymous"}
                            </p>
                            {item.guestEmail && (
                              <p className="text-gray-500 text-xs">
                                {item.guestEmail}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">
                              {formatDate(item.uploadedAt)}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {formatTime(item.uploadedAt)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px] whitespace-nowrap">
                          <div className="flex gap-2 justify-end items-center">
                            <AnimatedButton
                              size="icon"
                              variant="outline"
                              animation="scale"
                              onClick={() => handleViewMedia(item)}
                              className="h-9 w-9 flex-shrink-0"
                            >
                              <Eye className="w-4 h-4" />
                            </AnimatedButton>
                            <AnimatedButton
                              size="icon"
                              variant="accent"
                              animation="scale"
                              onClick={() => handleDeleteClick(item.id)}
                              className="h-9 w-9 flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </AnimatedButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div
                className="md:hidden divide-y"
                style={{ borderColor: "#d4a5a5" }}
              >
                {media.map((item) => (
                  <div key={item.id} className="p-4 space-y-3">
                    <div className="flex gap-3">
                      <div
                        className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2"
                        style={{ borderColor: "#d4a5a5" }}
                      >
                        {item.mediaType === "video" ? (
                          <div className="w-full h-full bg-gradient-to-br from-regalWine to-dustyPink flex items-center justify-center">
                            <Video className="w-8 h-8 text-white" />
                          </div>
                        ) : (
                          <Image
                            src={item.url}
                            alt={item.caption}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge
                          className="mb-2"
                          style={{
                            backgroundColor:
                              item.mediaType === "video"
                                ? "#6d1e3e"
                                : "#d4a5a5",
                            color: "white",
                          }}
                        >
                          {item.mediaType}
                        </Badge>
                        <p className="text-sm font-medium line-clamp-2 mb-1">
                          {item.caption}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.guestName || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(item.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <AnimatedButton
                        size="sm"
                        variant="outline"
                        animation="scale"
                        onClick={() => handleViewMedia(item)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </AnimatedButton>
                      <AnimatedButton
                        size="sm"
                        variant="accent"
                        animation="scale"
                        onClick={() => handleDeleteClick(item.id)}
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </AnimatedButton>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  className="flex items-center justify-between px-4 py-4 border-t"
                  style={{ borderColor: "#d4a5a5" }}
                >
                  <div className="text-sm text-gray-600 font-montserrat">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <AnimatedButton
                      variant="outline"
                      size="sm"
                      animation="scale"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Previous</span>
                    </AnimatedButton>
                    <AnimatedButton
                      variant="outline"
                      size="sm"
                      animation="scale"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <span className="hidden sm:inline mr-1">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </AnimatedButton>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: "rgba(109, 30, 62, 0.1)" }}
              >
                <Upload className="w-8 h-8" style={{ color: "#6d1e3e" }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cormorant">
                No media yet
              </h3>
              <p className="text-gray-500 mb-6 font-montserrat">
                Upload photos or videos from the wedding to share with guests
              </p>
              <Link href="/upload">
                <AnimatedButton variant="primary" size="lg" animation="slide">
                  <Upload className="w-4 h-4" />
                  Upload Your First Media
                </AnimatedButton>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              media from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              style={{ backgroundColor: "#6d1e3e" }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
