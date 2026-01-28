"use client";

import { MapPin, Navigation } from "lucide-react";
import GoogleMap from "./GoogleMap";

interface StaticMapProps {
  lat: number;
  lng: number;
  name: string;
  className?: string;
}

export default function StaticMap({ lat, lng, name, className = "" }: StaticMapProps) {
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div
      className={`rounded-xl overflow-hidden border border-gray-200 shadow-sm ${className}`}
      dir="rtl"
    >
      {/* Map */}
      <div className="h-[250px] md:h-[300px]">
        <GoogleMap
          center={{ lat, lng }}
          zoom={15}
          markers={[{ lat, lng, title: name }]}
          className="w-full h-full"
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-2 p-3 bg-gray-50 border-t border-gray-200">
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-2.5 transition-colors"
        >
          <Navigation className="h-4 w-4" />
          נווטו עם Waze
        </a>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2.5 transition-colors"
        >
          <MapPin className="h-4 w-4" />
          נווטו עם Google Maps
        </a>
      </div>
    </div>
  );
}
