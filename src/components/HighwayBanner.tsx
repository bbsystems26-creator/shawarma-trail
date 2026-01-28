"use client";

import Link from "next/link";
import { MapPin, PlusCircle } from "lucide-react";

export default function HighwayBanner() {
  return (
    <section
      dir="rtl"
      className="relative w-full bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden"
    >
      {/* Subtle dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 flex flex-col items-center justify-center text-center min-h-[250px]">
        {/* Small label */}
        <span className="inline-block mb-4 rounded-full bg-amber-500/15 px-4 py-1.5 text-sm font-medium text-amber-400 tracking-wide">
          הצטרפו לקהילה
        </span>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          יש לכם מקום שווארמה מומלץ?
        </h2>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl text-lg text-white/70">
          הוסיפו אותו למפה ועזרו לאחרים למצוא שווארמה טובה
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/add"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-amber-600"
          >
            <PlusCircle className="h-5 w-5" />
            הוסיפו מקום
          </Link>

          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            <MapPin className="h-5 w-5" />
            צפו במפה
          </Link>
        </div>
      </div>
    </section>
  );
}
