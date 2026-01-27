"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { REGION_OPTIONS, KASHRUT_OPTIONS } from "@/lib/constants";

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
      className="relative w-full overflow-hidden rounded-2xl min-h-[400px] md:min-h-[500px]"
      dir="rtl"
    >
      {/* Background image with fallback gradient */}
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
                alt="שווארמה טרייל"
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))}
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 z-[1]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-900/40 via-zinc-950 to-zinc-900" />
      )}

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
        {/* Emoji accent */}
        <span className="text-5xl md:text-6xl block mb-4 drop-shadow-lg">🥙</span>

        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight drop-shadow-lg">
          מצאו את השווארמה הטובה בישראל
        </h1>

        {/* Tagline */}
        <p className="text-base md:text-lg text-white/80 mb-8 max-w-2xl mx-auto drop-shadow">
          מפה אינטראקטיבית, דירוגים וביקורות — הכל במקום אחד
        </p>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-6">
          <SearchBar className="w-full" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link
            href="/explore"
            className="px-6 py-3 rounded-full text-base font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🗺️ גלה מקומות
          </Link>
          <Link
            href="/map"
            className="px-6 py-3 rounded-full text-base font-bold bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
          >
            📍 פתח מפה
          </Link>
        </div>

        {/* Region quick-links */}
        <div className="flex flex-wrap justify-center gap-3">
          {REGION_OPTIONS.map((region) => (
            <Link
              key={region.value}
              href={`/explore?region=${region.value}`}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-white/10 text-white/90 border border-white/20 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 backdrop-blur-sm"
            >
              {region.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
