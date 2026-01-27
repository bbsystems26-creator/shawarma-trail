"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { REGION_OPTIONS } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-bl from-amber-900/40 via-zinc-950 to-zinc-900"
      dir="rtl"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-shawarma-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
        {/* Emoji accent */}
        <span className="text-5xl md:text-6xl block mb-4">🥙</span>

        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
          מצאו את השווארמה הטובה בישראל
        </h1>

        {/* Tagline */}
        <p className="text-base md:text-lg text-shawarma-300 mb-8 max-w-2xl mx-auto">
          מפה אינטראקטיבית, דירוגים וביקורות — הכל במקום אחד
        </p>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-10">
          <SearchBar className="w-full" />
        </div>

        {/* Region quick-links */}
        <div className="flex flex-wrap justify-center gap-3">
          {REGION_OPTIONS.map((region) => (
            <Link
              key={region.value}
              href={`/explore?region=${region.value}`}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-shawarma-800/60 text-shawarma-200 border border-shawarma-700/40 hover:bg-shawarma-500 hover:text-white hover:border-shawarma-500 transition-all duration-200"
            >
              {region.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
