"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPlace {
  _id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  avgRating: number;
  city: string;
}

interface MapProps {
  places: MapPlace[];
  onPlaceClick?: (slug: string) => void;
}

export default function Map({ places, onPlaceClick }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize map centered on Israel
    const map = L.map(mapContainer.current, {
      center: [31.5, 34.8],
      zoom: 8,
      zoomControl: true,
    });

    // OpenStreetMap tiles — free, no API key!
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add markers
    places.forEach((place) => {
      const color =
        place.avgRating >= 4.5
          ? "#f59e0b" // gold
          : place.avgRating >= 4.0
            ? "#9ca3af" // silver
            : "#b45309"; // bronze

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: 32px;
          height: 32px;
          background: ${color};
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
        ">🥙</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);

      marker.bindPopup(`
        <div style="direction: rtl; text-align: right; min-width: 150px;">
          <strong style="font-size: 14px;">${place.name}</strong><br/>
          <span style="color: #666; font-size: 12px;">${place.city}</span><br/>
          <span style="color: #f59e0b;">★ ${place.avgRating.toFixed(1)}</span>
        </div>
      `);

      if (onPlaceClick) {
        marker.on("click", () => {
          onPlaceClick(place.slug);
        });
      }
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [places, onPlaceClick]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[500px] rounded-xl overflow-hidden border border-zinc-800"
      style={{ background: "#1a1a2e" }}
    />
  );
}
