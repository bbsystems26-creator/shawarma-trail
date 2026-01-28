"use client";

interface StaticMapProps {
  lat: number;
  lng: number;
  name: string;
  className?: string;
}

export default function StaticMap({ lat, lng, name, className = "" }: StaticMapProps) {
  // Use OpenStreetMap static tile
  const zoom = 15;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.005},${lat-0.003},${lng+0.005},${lat+0.003}&layer=mapnik&marker=${lat},${lng}`;
  
  return (
    <div className={`rounded-xl overflow-hidden border border-zinc-700 ${className}`}>
      <iframe
        src={mapUrl}
        width="100%"
        height="250"
        style={{ border: 0 }}
        loading="lazy"
        title={`מיקום ${name}`}
        className="w-full"
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-sm text-amber-400 hover:text-amber-300 py-2 bg-zinc-800"
      >
        פתח מפה מלאה ↗
      </a>
    </div>
  );
}
