"use client";

import Link from "next/link";
import { PartyPopper, Calendar } from "lucide-react";

export default function EventsBanner() {
  return (
    <section
      dir="rtl"
      className="relative w-full min-h-[200px] md:min-h-[280px] bg-gradient-to-l from-amber-600 to-orange-500 overflow-hidden"
    >
      {/* Decorative pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 50% 80%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px, 80px 80px, 50px 50px",
        }}
      />
      {/* Decorative blurred circles */}
      <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-60px] left-[-30px] w-80 h-80 bg-orange-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-10 md:py-14 min-h-[200px] md:min-h-[280px]">
        {/* Icons row */}
        <div className="flex items-center gap-3 mb-4">
          <PartyPopper className="w-7 h-7 md:w-9 md:h-9 text-white/90" />
          <PartyPopper className="w-7 h-7 md:w-9 md:h-9 text-white/90 scale-x-[-1]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
          🎉 פסטיבל השווארמה הגדול 2026
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 max-w-2xl leading-relaxed">
          3 ימים של שווארמה, מוזיקה ובילויים — הכניסה חופשית!
        </p>

        {/* Date */}
        <div className="flex items-center gap-2 text-white/80 text-sm sm:text-base mb-6">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>20-22 במרץ 2026 | פארק הירקון, תל אביב</span>
        </div>

        {/* CTA Button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 bg-white text-amber-600 font-bold px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base hover:bg-amber-50 hover:scale-105 transition-all duration-200 shadow-lg shadow-black/10"
        >
          לפרטים נוספים ←
        </Link>
      </div>
    </section>
  );
}
