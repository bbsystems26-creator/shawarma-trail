"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import Link from "next/link";
import { Search, X, MapPin, Star, ChevronLeft } from "lucide-react";

/* ── Region labels ────────────────────────────────────────────── */
const REGION_LABELS: Record<string, string> = {
  north: "צפון",
  center: "מרכז",
  south: "דרום",
  jerusalem: "ירושלים",
  shfela: "שפלה",
};

const KASHRUT_LABELS: Record<string, string> = {
  none: "ללא",
  regular: "רגילה",
  mehadrin: "מהדרין",
  badatz: 'בד"ץ',
};

/* ── Star rating component ────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`דירוג ${rating.toFixed(1)}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 mr-1">{rating.toFixed(1)}</span>
    </span>
  );
}

/* ── Types ────────────────────────────────────────────────────── */
interface Place {
  _id: string;
  name: string;
  slug: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  avgRating: number;
  reviewCount: number;
  kashrut: string;
  address: string;
  images: string[];
  isFeatured: boolean;
  priceRange: number;
}

/* ── Map loader singleton ─────────────────────────────────────── */
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

let apiOptionsSet = false;
function ensureApiOptions() {
  if (!apiOptionsSet) {
    setOptions({ key: API_KEY, v: "weekly" });
    apiOptionsSet = true;
  }
}

/* ── Main Page Component ──────────────────────────────────────── */
export default function MapPage() {
  const places = useQuery(api.places.listAll, { limit: 200 });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  /* ── Filtered places ───────────────────────────────────────── */
  const filteredPlaces = useMemo(() => {
    if (!places) return [];
    return (places as Place[]).filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.includes(searchQuery) ||
        p.city.includes(searchQuery) ||
        p.address.includes(searchQuery);
      const matchRegion = !selectedRegion || p.region === selectedRegion;
      return matchSearch && matchRegion;
    });
  }, [places, searchQuery, selectedRegion]);

  /* ── Build info window HTML ────────────────────────────────── */
  const buildInfoContent = useCallback((place: Place) => {
    const stars = Array.from({ length: 5 })
      .map(
        (_, i) =>
          `<span style="color:${i < Math.round(place.avgRating) ? "#f59e0b" : "#d1d5db"}">★</span>`
      )
      .join("");

    return `
      <div dir="rtl" style="font-family:Heebo,sans-serif;padding:8px;min-width:200px;max-width:280px">
        <h3 style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1f2937">${place.name}</h3>
        <p style="margin:0 0 4px;font-size:13px;color:#6b7280">
          ${place.city} · ${REGION_LABELS[place.region] || place.region}
        </p>
        <p style="margin:0 0 8px;font-size:14px">${stars} <span style="font-size:12px;color:#6b7280">${place.avgRating.toFixed(1)}</span></p>
        <a href="/place/${place.slug}" style="display:inline-block;font-size:13px;color:#d97706;text-decoration:none;font-weight:600">
          לפרטים נוספים ←
        </a>
      </div>
    `;
  }, []);

  /* ── Initialize map ────────────────────────────────────────── */
  useEffect(() => {
    if (!API_KEY || !mapRef.current) return;

    ensureApiOptions();

    importLibrary("maps").then((mapsLib) => {
      if (!mapRef.current || googleMapRef.current) return;

      const map = new mapsLib.Map(mapRef.current, {
        center: { lat: 31.5, lng: 34.8 },
        zoom: 8,
        mapId: "shawarma-map",
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
      });

      googleMapRef.current = map;
      infoWindowRef.current = new google.maps.InfoWindow();
      setMapReady(true);
    });
  }, []);

  /* ── Update markers whenever filteredPlaces change ──────────── */
  useEffect(() => {
    if (!mapReady || !googleMapRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    const map = googleMapRef.current;
    const infoWindow = infoWindowRef.current;

    const loadMarkers = async () => {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      for (const place of filteredPlaces) {
        // Custom marker pin
        const pin = document.createElement("div");
        pin.innerHTML = "🥙";
        pin.style.fontSize = "28px";
        pin.style.cursor = "pointer";

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: place.lat, lng: place.lng },
          title: place.name,
          content: pin,
        });

        marker.addListener("click", () => {
          if (infoWindow) {
            infoWindow.setContent(buildInfoContent(place));
            infoWindow.open({ anchor: marker, map });
          }
          setSelectedPlace(place);

          // Scroll sidebar item into view on desktop
          const el = document.getElementById(`sidebar-place-${place._id}`);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        });

        markersRef.current.push(marker);
      }
    };

    loadMarkers();
  }, [filteredPlaces, mapReady, buildInfoContent]);

  /* ── Handle sidebar click → pan to marker ───────────────────── */
  const handlePlaceClick = useCallback(
    (place: Place) => {
      setSelectedPlace(place);
      const map = googleMapRef.current;
      if (map) {
        map.panTo({ lat: place.lat, lng: place.lng });
        map.setZoom(14);
      }
      // Trigger info window
      const idx = filteredPlaces.findIndex((p) => p._id === place._id);
      const marker = markersRef.current[idx];
      if (marker && infoWindowRef.current) {
        infoWindowRef.current.setContent(buildInfoContent(place));
        infoWindowRef.current.open({ anchor: marker, map: map! });
      }
    },
    [filteredPlaces, buildInfoContent]
  );

  /* ── Missing API key state ──────────────────────────────────── */
  if (!API_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <MapPin className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">מפת Google לא זמינה</h2>
          <p className="text-gray-500 text-sm">
            יש להגדיר את מפתח ה-API של Google Maps בקובץ{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
              NEXT_PUBLIC_GOOGLE_MAPS_KEY
            </code>{" "}
            כדי להציג את המפה.
          </p>
        </div>
      </div>
    );
  }

  const isLoading = places === undefined;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row" dir="rtl">
      {/* ── Desktop Sidebar ──────────────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[30%] xl:w-[28%] border-l border-gray-200 bg-white">
        {/* Search + Filter header */}
        <div className="p-4 border-b border-gray-100 space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            מפת השווארמה
          </h2>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="חיפוש לפי שם או עיר..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="נקה חיפוש"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Region filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedRegion("")}
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition ${
                !selectedRegion
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              הכל
            </button>
            {Object.entries(REGION_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedRegion(key === selectedRegion ? "" : key)}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition ${
                  selectedRegion === key
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400">
            {isLoading ? "טוען..." : `${filteredPlaces.length} מקומות`}
          </p>
        </div>

        {/* Scrollable place list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 text-sm">לא נמצאו מקומות</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filteredPlaces.map((place) => (
                <li key={place._id} id={`sidebar-place-${place._id}`}>
                  <button
                    onClick={() => handlePlaceClick(place)}
                    className={`w-full text-right p-4 hover:bg-amber-50/50 transition-colors ${
                      selectedPlace?._id === place._id
                        ? "bg-amber-50 border-r-4 border-amber-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {place.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {place.city} · {REGION_LABELS[place.region] || place.region}
                        </p>
                        <div className="mt-1">
                          <Stars rating={place.avgRating} />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {place.kashrut !== "none" && (
                            <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">
                              {KASHRUT_LABELS[place.kashrut]}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400">
                            {"₪".repeat(place.priceRange)}
                          </span>
                        </div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* ── Map Container ────────────────────────────────────── */}
      <div className="flex-1 relative">
        {/* Map */}
        <div ref={mapRef} className="absolute inset-0" />

        {/* Loading overlay */}
        {(!mapReady || isLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 text-sm font-medium">
                {isLoading ? "טוען מקומות..." : "טוען מפה..."}
              </p>
            </div>
          </div>
        )}

        {/* ── Mobile Search Bar (floating) ────────────────────── */}
        <div className="lg:hidden absolute top-3 right-3 left-3 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="חפש שווארמה..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-8 pl-2 py-2 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Region quick-filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-gray-50 text-xs text-gray-700 rounded-lg px-2 py-2 border border-gray-200 focus:outline-none"
            >
              <option value="">כל האזורים</option>
              {Object.entries(REGION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Mobile Bottom Panel (selected place) ────────────── */}
        {selectedPlace && (
          <div className="lg:hidden absolute bottom-4 right-3 left-3 z-20 animate-in slide-in-from-bottom-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 text-base truncate">
                    {selectedPlace.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedPlace.city} ·{" "}
                    {REGION_LABELS[selectedPlace.region] || selectedPlace.region}
                  </p>
                  <div className="mt-1.5">
                    <Stars rating={selectedPlace.avgRating} />
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    {selectedPlace.kashrut !== "none" && (
                      <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                        {KASHRUT_LABELS[selectedPlace.kashrut]}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400">
                      {"₪".repeat(selectedPlace.priceRange)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="סגור"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Link
                href={`/place/${selectedPlace.slug}`}
                className="mt-3 flex items-center justify-center gap-1 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                לפרטים נוספים ←
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
