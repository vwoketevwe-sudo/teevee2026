// app/venue/page.tsx (Enhanced version with environment variables)
"use client";

import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Navigation,
  MapPin,
  Car,
  PersonStanding,
  Bike,
  Info,
  Clock,
  ArrowLeft,
  Locate,
  Route,
  Share2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VENUE, COUPLE } from "@/lib/constants";

// Wedding venue coordinates - Updated to ODJEGBA HALL location
const VENUE_COORDINATES = {
  lng: Number(process.env.NEXT_PUBLIC_VENUE_LNG) || 5.7764,
  lat: Number(process.env.NEXT_PUBLIC_VENUE_LAT) || 5.5691,
  name: VENUE.title,
  address: VENUE.address,
};

// OpenRouteService API key
const ORS_API_KEY =
  process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY ||
  "5b3ce3597851110001cf6248c5eb9e68f6da406cb4056e76b4e6d3a5";

type RouteProfile = "driving-car" | "foot-walking" | "cycling-regular";

interface RouteInfo {
  distance: number;
  duration: number;
  profile: RouteProfile;
}

const TRANSPORT_MODES = [
  {
    profile: "driving-car" as RouteProfile,
    label: "Driving",
    icon: Car,
    color: "#6d1e3e",
    description: "Fastest route by car",
  },
  {
    profile: "foot-walking" as RouteProfile,
    label: "Walking",
    icon: PersonStanding,
    color: "#5d3a29",
    description: "Pedestrian-friendly path",
  },
  {
    profile: "cycling-regular" as RouteProfile,
    label: "Cycling",
    icon: Bike,
    color: "#8b3a4f",
    description: "Best cycling route",
  },
];

export default function VenueNavigationPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const userMarker = useRef<maplibregl.Marker | null>(null);
  const venueMarker = useRef<maplibregl.Marker | null>(null);
  const routeSource = useRef<string>("route");

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedProfile, setSelectedProfile] =
    useState<RouteProfile>("driving-car");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [VENUE_COORDINATES.lng, VENUE_COORDINATES.lat],
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add fullscreen control
    map.current.addControl(new maplibregl.FullscreenControl(), "top-right");

    // Add venue marker with wedding color scheme
    const venueEl = document.createElement("div");
    venueEl.className = "venue-marker";
    venueEl.innerHTML = `
      <div style="
        position: relative;
        width: 48px;
        height: 48px;
      ">
        <div style="
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6d1e3e, #8b3a4f);
          border: 4px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 6px 20px rgba(109, 30, 62, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        ">
          <svg style="transform: rotate(45deg); width: 24px; height: 24px; fill: white;" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 8px;
          background: radial-gradient(ellipse, rgba(109, 30, 62, 0.3), transparent);
          border-radius: 50%;
        "></div>
      </div>
    `;

    venueMarker.current = new maplibregl.Marker({ element: venueEl })
      .setLngLat([VENUE_COORDINATES.lng, VENUE_COORDINATES.lat])
      .setPopup(
        new maplibregl.Popup({ offset: 25, className: "venue-popup" }).setHTML(`
            <div style="padding: 12px; font-family: var(--font-montserrat); min-width: 200px;">
              <h3 style="
                font-weight: 700; 
                color: #6d1e3e; 
                margin-bottom: 8px;
                font-size: 16px;
                font-family: var(--font-cormorant);
              ">
                ${VENUE_COORDINATES.name}
              </h3>
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
                ${VENUE_COORDINATES.address}
              </p>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=${VENUE_COORDINATES.lat},${VENUE_COORDINATES.lng}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                  color: #6d1e3e;
                  font-size: 13px;
                  font-weight: 600;
                  text-decoration: none;
                  margin-top: 4px;
                "
              >
                Open in Google Maps
                <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24">
                  <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/>
                </svg>
              </a>
            </div>
          `),
      )
      .addTo(map.current);

    // Add hover effect to marker
    venueEl.addEventListener("mouseenter", () => {
      venueEl.style.transform = "scale(1.1)";
    });
    venueEl.addEventListener("mouseleave", () => {
      venueEl.style.transform = "scale(1)";
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        setUserLocation(coords);

        // Add/update user location marker with pulsing effect
        if (userMarker.current) {
          userMarker.current.setLngLat(coords);
        } else if (map.current) {
          const userEl = document.createElement("div");
          userEl.innerHTML = `
            <div style="position: relative; width: 30px; height: 30px;">
              <div style="
                position: absolute;
                width: 30px;
                height: 30px;
                background: rgba(139, 58, 79, 0.2);
                border-radius: 50%;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
              <div style="
                position: absolute;
                width: 20px;
                height: 20px;
                top: 5px;
                left: 5px;
                background: #8b3a4f;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 12px rgba(139, 58, 79, 0.6);
              "></div>
            </div>
          `;

          const style = document.createElement("style");
          style.textContent = `
            @keyframes ping {
              0% {
                transform: scale(1);
                opacity: 1;
              }
              75%, 100% {
                transform: scale(2);
                opacity: 0;
              }
            }
          `;
          document.head.appendChild(style);

          userMarker.current = new maplibregl.Marker({ element: userEl })
            .setLngLat(coords)
            .setPopup(
              new maplibregl.Popup({ offset: 15 }).setHTML(
                '<p style="padding: 8px; font-family: var(--font-montserrat); font-weight: 600; color: #8b3a4f;">You are here</p>',
              ),
            )
            .addTo(map.current);
        }

        // Fit bounds to show both markers
        if (map.current) {
          const bounds = new maplibregl.LngLatBounds();
          bounds.extend(coords);
          bounds.extend([VENUE_COORDINATES.lng, VENUE_COORDINATES.lat]);
          map.current.fitBounds(bounds, {
            padding: { top: 100, bottom: 100, left: 100, right: 100 },
            maxZoom: 15,
          });
        }

        setIsLoadingLocation(false);
        toast.success("Location found! 📍", {
          description: "You can now calculate the route to the venue",
        });
      },
      (error) => {
        setIsLoadingLocation(false);
        let errorMessage = "Unable to get your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        toast.error(errorMessage);
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // Get route from OpenRouteService
  const getRoute = async () => {
    if (!userLocation) {
      toast.error("Please get your location first");
      return;
    }

    setIsLoadingRoute(true);

    try {
      const url = `https://api.openrouteservice.org/v2/directions/${selectedProfile}?api_key=${ORS_API_KEY}&start=${userLocation[0]},${userLocation[1]}&end=${VENUE_COORDINATES.lng},${VENUE_COORDINATES.lat}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const route = data.features[0];
        const coordinates = route.geometry.coordinates;
        const { distance, duration } = route.properties.segments[0];

        setRouteInfo({
          distance,
          duration,
          profile: selectedProfile,
        });

        // Add route to map
        if (map.current) {
          // Remove existing route if any
          if (map.current.getSource(routeSource.current)) {
            map.current.removeLayer("route-line");
            map.current.removeLayer("route-outline");
            map.current.removeSource(routeSource.current);
          }

          // Add new route with outline for better visibility
          map.current.addSource(routeSource.current, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates,
              },
            },
          });

          // Route outline (for contrast)
          map.current.addLayer({
            id: "route-outline",
            type: "line",
            source: routeSource.current,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#ffffff",
              "line-width": 8,
              "line-opacity": 0.8,
            },
          });

          // Main route line
          map.current.addLayer({
            id: "route-line",
            type: "line",
            source: routeSource.current,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color":
                selectedProfile === "driving-car"
                  ? "#6d1e3e"
                  : selectedProfile === "foot-walking"
                    ? "#5d3a29"
                    : "#8b3a4f",
              "line-width": 5,
              "line-opacity": 0.9,
            },
          });

          // Fit bounds to show full route
          const bounds = new maplibregl.LngLatBounds();
          coordinates.forEach((coord: [number, number]) =>
            bounds.extend(coord),
          );
          map.current.fitBounds(bounds, {
            padding: { top: 80, bottom: 80, left: 80, right: 80 },
            maxZoom: 15,
          });
        }

        toast.success("Route calculated! 🗺️", {
          description: `${formatDistance(distance)} • ${formatDuration(
            duration,
          )}`,
        });
      } else {
        throw new Error("No route found");
      }
    } catch (error) {
      console.error("Route error:", error);
      toast.error("Unable to calculate route", {
        description: "Please check your internet connection and try again",
      });
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Format distance
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  // Share location
  const shareLocation = async () => {
    const shareData = {
      title: `${COUPLE.bride.name} & ${COUPLE.groom.name}'s Wedding Venue`,
      text: `${VENUE_COORDINATES.name} - ${VENUE_COORDINATES.address}`,
      url: `https://www.google.com/maps/dir/?api=1&destination=${VENUE_COORDINATES.lat},${VENUE_COORDINATES.lng}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-roseLight/20 to-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:opacity-70 mb-4 transition-opacity font-montserrat"
            style={{ color: "#6d1e3e" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-6">
            <h1
              className="text-5xl md:text-6xl font-cormorant font-bold mb-3"
              style={{
                background:
                  "linear-gradient(to right, #6d1e3e, #8b3a4f, #d4a5a5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Find Your Way
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-montserrat">
              Navigate to our wedding venue with ease
            </p>
          </div>
        </div>

        {/* Info Alert */}
        <Alert
          className="mb-6 backdrop-blur-sm max-w-4xl mx-auto"
          style={{
            borderColor: "#d4a5a5",
            backgroundColor: "rgba(232, 197, 197, 0.2)",
          }}
        >
          <Info className="h-5 w-5" style={{ color: "#6d1e3e" }} />
          <AlertDescription className="text-gray-700 font-montserrat">
            <strong className="font-semibold">How to navigate:</strong> Enable
            your location, choose your travel mode, and get step-by-step
            directions to the venue. Works with Google Maps too!
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Location Card */}
            <Card
              className="p-6 backdrop-blur-sm border-2 shadow-xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "#d4a5a5",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(to bottom right, #e8c5c5, #d4a5a5)",
                  }}
                >
                  <Locate className="w-6 h-6" style={{ color: "#6d1e3e" }} />
                </div>
                <h2 className="text-xl font-cormorant font-bold text-gray-800">
                  Your Location
                </h2>
              </div>
              <AnimatedButton
                onClick={getUserLocation}
                disabled={isLoadingLocation}
                loading={isLoadingLocation}
                variant="primary"
                animation="slide"
              >
                {isLoadingLocation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <Navigation className="w-5 h-5 mr-2" />
                    Get My Location
                  </>
                )}
              </AnimatedButton>

              {userLocation && (
                <div
                  className="mt-4 p-3 border rounded-lg"
                  style={{
                    backgroundColor: "rgba(93, 58, 41, 0.05)",
                    borderColor: "#5d3a29",
                  }}
                >
                  <p
                    className="text-sm font-montserrat flex items-center gap-2"
                    style={{ color: "#5d3a29" }}
                  >
                    <MapPin className="w-4 h-4" />
                    Location found successfully!
                  </p>
                </div>
              )}
            </Card>

            {/* Transportation Mode Card */}
            <Card
              className="p-6 backdrop-blur-sm border-2 shadow-xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "#d4a5a5",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(to bottom right, #e8c5c5, #d4a5a5)",
                  }}
                >
                  <Route className="w-6 h-6" style={{ color: "#6d1e3e" }} />
                </div>
                <h2 className="text-xl font-cormorant font-bold text-gray-800">
                  Travel Mode
                </h2>
              </div>

              <div className="space-y-2">
                {TRANSPORT_MODES.map(
                  ({ profile, label, icon: Icon, description, color }) => (
                    <button
                      key={profile}
                      onClick={() => setSelectedProfile(profile)}
                      className="w-full p-4 rounded-xl border-2 transition-all font-montserrat flex flex-col items-start gap-1"
                      style={{
                        backgroundColor:
                          selectedProfile === profile ? color : "white",
                        color:
                          selectedProfile === profile ? "white" : "#2d1810",
                        borderColor:
                          selectedProfile === profile ? color : "#d4a5a5",
                        transform:
                          selectedProfile === profile
                            ? "scale(1.05)"
                            : "scale(1)",
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold">{label}</span>
                      </div>
                      <span
                        className="text-xs ml-8"
                        style={{
                          color:
                            selectedProfile === profile
                              ? "rgba(255, 255, 255, 0.8)"
                              : "#6b5d55",
                        }}
                      >
                        {description}
                      </span>
                    </button>
                  ),
                )}
              </div>

              <Button
                onClick={getRoute}
                disabled={!userLocation || isLoadingRoute}
                className="w-full h-12 mt-4 font-montserrat font-semibold shadow-lg hover:shadow-xl transition-all text-white"
                style={{
                  background: "linear-gradient(to right, #5d3a29, #8b3a4f)",
                  opacity: !userLocation || isLoadingRoute ? 0.5 : 1,
                }}
              >
                {isLoadingRoute ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Route className="w-5 h-5 mr-2" />
                    Calculate Route
                  </>
                )}
              </Button>
            </Card>

            {/* Route Info Card */}
            {routeInfo && (
              <Card
                className="p-6 text-white border-none shadow-xl overflow-hidden relative"
                style={{
                  background:
                    "linear-gradient(to bottom right, #6d1e3e, #8b3a4f)",
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6" />
                    <h2 className="text-xl font-cormorant font-bold">
                      Route Details
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    >
                      <span className="font-montserrat font-medium">
                        Distance
                      </span>
                      <span className="font-cormorant text-2xl font-bold">
                        {formatDistance(routeInfo.distance)}
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    >
                      <span className="font-montserrat font-medium">
                        Duration
                      </span>
                      <span className="font-cormorant text-2xl font-bold">
                        {formatDuration(routeInfo.duration)}
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    >
                      <span className="font-montserrat font-medium">Mode</span>
                      <div className="flex items-center gap-2">
                        {TRANSPORT_MODES.find(
                          (m) => m.profile === routeInfo.profile,
                        )?.icon &&
                          (() => {
                            const Icon = TRANSPORT_MODES.find(
                              (m) => m.profile === routeInfo.profile,
                            )!.icon;
                            return <Icon className="w-5 h-5" />;
                          })()}
                        <span className="font-cormorant text-lg font-bold capitalize">
                          {
                            TRANSPORT_MODES.find(
                              (m) => m.profile === routeInfo.profile,
                            )?.label
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Venue Info Card */}
            <Card
              className="p-6 backdrop-blur-sm border-2 shadow-xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "#d4a5a5",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #e8c5c5, #d4a5a5)",
                    }}
                  >
                    <MapPin className="w-6 h-6" style={{ color: "#6d1e3e" }} />
                  </div>
                  <h2 className="text-xl font-cormorant font-bold text-gray-800">
                    Venue Details
                  </h2>
                </div>
                <Button
                  onClick={shareLocation}
                  variant="ghost"
                  size="sm"
                  style={{ color: "#6d1e3e" }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 font-montserrat mb-1">
                    Venue Name
                  </p>
                  <p className="text-gray-800 font-montserrat font-semibold">
                    {VENUE_COORDINATES.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-montserrat mb-1">
                    Address
                  </p>
                  <p className="text-gray-800 font-montserrat">
                    {VENUE_COORDINATES.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-montserrat mb-1">
                    Coordinates
                  </p>
                  <p className="text-gray-800 font-mono text-sm">
                    {VENUE_COORDINATES.lat.toFixed(4)},{" "}
                    {VENUE_COORDINATES.lng.toFixed(4)}
                  </p>
                </div>

                <AnimatedButton
                  asChild
                  className="w-full mt-4 font-montserrat font-semibold text-white"
                  variant="primary"
                  animation="slide"
                >
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${VENUE_COORDINATES.lat},${VENUE_COORDINATES.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full h-12"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Google Maps
                  </a>
                </AnimatedButton>
              </div>
            </Card>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-2">
            <Card
              className="overflow-hidden border-4 shadow-2xl h-[600px] lg:h-[900px] relative"
              style={{ borderColor: "#d4a5a5" }}
            >
              <div ref={mapContainer} className="w-full h-full" />

              {/* Map Attribution */}
              <div
                className="absolute bottom-2 left-2 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md z-10"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              >
                <p className="text-xs text-gray-600 font-montserrat">
                  Map data © OpenStreetMap contributors
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
