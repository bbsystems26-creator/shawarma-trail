"use client";

import { useEffect, useRef, useState } from "react";
import { UI } from "@/lib/constants";
import type { PlaceData } from "./PlaceCard";

// Mapbox GL JS — CSS imported in globals.css to avoid SSR issues
// import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  places: PlaceData[];
  onPlaceClick?: (place: PlaceData) => void;
  className?: string;
}

function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "#F59E0B"; // Gold
  if (rating >= 3.5) return "#D97706"; // Amber
  if (rating >= 2.5) return "#B45309"; // Dark amber
  return "#92400E"; // Brown
}

export default function Map({ places, onPlaceClick, className = "" }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token) {
      setError(UI.mapNoToken);
      return;
    }

    if (!mapContainer.current || mapRef.current) return;

    let map: mapboxgl.Map;

    const initMap = async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        // Dynamic CSS import for mapbox
        await import("mapbox-gl/dist/mapbox-gl.css");

        mapboxgl.accessToken = token;

        map = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [34.8, 31.5], // Center of Israel
          zoom: 7.5,
          minZoom: 6,
          maxZoom: 18,
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), "top-left");

        map.on("load", () => {
          setMapLoaded(true);
        });

        mapRef.current = map;
      } catch (err) {
        console.error("Failed to initialize map:", err);
        setError("שגיאה בטעינת המפה");
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [token]);

  // Update markers when places or map changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const addMarkers = async () => {
      const mapboxgl = (await import("mapbox-gl")).default;

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      places.forEach((place) => {
        // Create custom marker element
        const el = document.createElement("div");
        el.className = "shawarma-marker";
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.borderRadius = "50%";
        el.style.border = "3px solid " + getRatingColor(place.avgRating);
        el.style.backgroundColor = getRatingColor(place.avgRating) + "33";
        el.style.cursor = "pointer";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.fontSize = "16px";
        el.style.transition = "transform 0.2s";
        el.innerHTML = "🥙";

        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.3)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
        });

        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 20,
          closeButton: false,
          maxWidth: "240px",
        }).setHTML(`
          <div style="direction: rtl; font-family: 'Heebo', sans-serif; padding: 4px;">
            <strong style="font-size: 14px; color: #1C0F08;">${place.name}</strong>
            <div style="font-size: 12px; color: #6B3720; margin-top: 2px;">${place.city}</div>
            <div style="margin-top: 4px; font-size: 13px;">
              <span style="color: #F59E0B;">★</span> 
              <strong>${place.avgRating.toFixed(1)}</strong>
              <span style="color: #999; font-size: 11px;"> (${place.reviewCount} ביקורות)</span>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([place.lng, place.lat])
          .setPopup(popup)
          .addTo(mapRef.current!);

        el.addEventListener("click", () => {
          onPlaceClick?.(place);
        });

        markersRef.current.push(marker);
      });
    };

    addMarkers();
  }, [places, mapLoaded, onPlaceClick]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-shawarma-900 rounded-xl border border-shawarma-800 ${className}`}
        style={{ minHeight: 400 }}
      >
        <div className="text-center text-shawarma-400 p-8">
          <span className="text-4xl block mb-3">🗺️</span>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2 text-shawarma-600">
            הוסיפו NEXT_PUBLIC_MAPBOX_TOKEN לקובץ .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ minHeight: 400 }}
    />
  );
}
