// app/admin/dashboard/rsvps/page.tsx
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

interface RSVP {
  id: string;
  name: string;
  email: string;
  attending: boolean;
  guestCount: number;
  message?: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 15;

export default function AdminRSVPPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
      fetchRSVPs();
    }
  }, [session]);

  const fetchRSVPs = async () => {
    try {
      const response = await fetch("/api/rsvp");
      const data = await response.json();
      if (data.success) {
        setRsvps(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch RSVPs");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Attending",
      "Guest Count",
      "Message",
      "Date",
    ];
    const rows = rsvps.map((rsvp) => [
      rsvp.name,
      rsvp.email,
      rsvp.attending ? "Yes" : "No",
      rsvp.guestCount,
      rsvp.message || "",
      new Date(rsvp.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rsvps.csv";
    a.click();

    toast.success("RSVPs exported successfully!");
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

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#6d1e3e" }}
          ></div>
          <p className="text-gray-600">Loading RSVPs...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const attendingCount = rsvps.filter((r) => r.attending).length;
  const totalGuests = rsvps.reduce(
    (sum, r) => sum + (r.attending ? r.guestCount : 0),
    0,
  );

  // Pagination
  const totalPages = Math.ceil(rsvps.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRsvps = rsvps.slice(startIndex, endIndex);

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
                RSVP Responses
              </h1>
              <p className="text-gray-600 mt-1 font-montserrat">
                {attendingCount} attending • {totalGuests} total guests
              </p>
            </div>
          </div>

          <AnimatedButton
            onClick={exportToCSV}
            variant="outline"
            animation="slide"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </AnimatedButton>
        </div>

        <div
          className="rounded-2xl shadow-xl overflow-hidden border-2"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderColor: "#d4a5a5",
          }}
        >
          {rsvps.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow
                      style={{ backgroundColor: "rgba(212, 165, 165, 0.1)" }}
                    >
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRsvps.map((rsvp) => (
                      <TableRow key={rsvp.id} className="hover:bg-roseLight/10">
                        <TableCell className="font-medium">
                          {rsvp.name}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {rsvp.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={rsvp.attending ? "default" : "secondary"}
                            style={{
                              backgroundColor: rsvp.attending
                                ? "#5d3a29"
                                : "#d4a5a5",
                              color: "white",
                            }}
                          >
                            {rsvp.attending ? "Attending" : "Not Attending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {rsvp.attending ? rsvp.guestCount : "-"}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-sm">
                            {rsvp.message || "-"}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(rsvp.createdAt)}
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
                {paginatedRsvps.map((rsvp) => (
                  <div key={rsvp.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{rsvp.name}</p>
                        <p className="text-sm text-gray-600">{rsvp.email}</p>
                      </div>
                      <Badge
                        style={{
                          backgroundColor: rsvp.attending
                            ? "#5d3a29"
                            : "#d4a5a5",
                          color: "white",
                        }}
                      >
                        {rsvp.attending ? "Yes" : "No"}
                      </Badge>
                    </div>
                    {rsvp.attending && (
                      <p className="text-sm text-gray-600">
                        <Users className="w-3 h-3 inline mr-1" />
                        {rsvp.guestCount}{" "}
                        {rsvp.guestCount === 1 ? "guest" : "guests"}
                      </p>
                    )}
                    {rsvp.message && (
                      <p className="text-sm text-gray-600 italic">
                        &quot;{rsvp.message}&quot;
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {formatDate(rsvp.createdAt)}
                    </p>
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
                <Users className="w-8 h-8" style={{ color: "#6d1e3e" }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cormorant">
                No RSVPs yet
              </h3>
              <p className="text-gray-500 font-montserrat">
                Responses will appear here as guests confirm their attendance
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
