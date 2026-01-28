"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import AdvancedSearch from "./AdvancedSearch";
import { REGION_OPTIONS } from "@/lib/constants";
import { Route, MapPin } from "lucide-react";

const HERO_IMAGES = [
  "/images/hero/hero-1.png",
];

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden min-h-[500px] md:min-h-[600px] lg:min-h-[70vh]"
      dir="rtl"
    >
      {/* Background image */}
      {HERO_IMAGES.length > 0 ? (
        <>
          {HERO_IMAGES.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === currentImage ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt="שווארמה ביס"
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))}
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-[1]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-100 via-orange-50 to-white" />
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="block mb-4">
          <img src="/images/logo.png" alt="" className="w-16 h-16 md:w-20 md:h-20 mx-auto drop-shadow-lg" />
        </div>

        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight drop-shadow-lg">
          שווארמה ביס
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
          הבית של השווארמה בישראל
        </p>

        {/* White search card */}
        <div className="w-full max-w-xl md:max-w-3xl mx-auto mb-6">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
            <div className="block md:hidden">
              <SearchBar className="w-full" />
            </div>
            <div className="hidden md:block">
              <AdvancedSearch />
            </div>
          </div>
        </div>

        {/* Text links below search */}
        <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
          <Link
            href="/explore"
            className="text-white/90 hover:text-white transition-colors inline-flex items-center gap-1.5 drop-shadow"
          >
            <Route className="w-4 h-4" /> חיפוש לפי מסלול נסיעה
          </Link>
          <Link
            href="/map"
            className="text-white/90 hover:text-white transition-colors inline-flex items-center gap-1.5 drop-shadow"
          >
            <MapPin className="w-4 h-4" /> מעבר לתצוגת מפה
          </Link>
        </div>
      </div>
    </section>
  );
}
