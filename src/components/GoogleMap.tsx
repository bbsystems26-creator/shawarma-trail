"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface MarkerData {
  lat: number;
  lng: number;
  title?: string;
}

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: MarkerData[];
  className?: string;
}

let optionsSet = false;

export default function GoogleMap({
  center,
  zoom = 15,
  markers = [],
  className = "",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  const initMap = useCallback(async () => {
    if (!apiKey) {
      setError("מפתח Google Maps לא הוגדר");
      setLoading(false);
      return;
    }

    if (!mapRef.current) return;

    try {
      if (!optionsSet) {
        setOptions({ key: apiKey, v: "weekly" });
        optionsSet = true;
      }

      const mapsLib = await importLibrary("maps");
      const markerLib = await importLibrary("marker");

      if (!mapRef.current) return;

      const map = new mapsLib.Map(mapRef.current, {
        center,
        zoom,
        mapId: "shawarma-trail-map",
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;

      // Clear old markers
      markersRef.current.forEach((m) => (m.map = null));
      markersRef.current = [];

      // Add markers
      markers.forEach((m) => {
        const marker = new markerLib.AdvancedMarkerElement({
          map,
          position: { lat: m.lat, lng: m.lng },
          title: m.title ?? "",
        });
        markersRef.current.push(marker);
      });

      setLoading(false);
    } catch (err) {
      console.error("Google Maps load error:", err);
      setError("שגיאה בטעינת המפה");
      setLoading(false);
    }
  }, [apiKey, center, zoom, markers]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded-xl ${className}`}
        style={{ minHeight: 250 }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 rounded-xl animate-pulse"
          style={{ minHeight: 250 }}
        >
          <svg
            className="h-8 w-8 text-gray-400 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-xl" style={{ minHeight: 250 }} />
    </div>
  );
}
