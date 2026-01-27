"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import HeroSection from "@/components/HeroSection";
import Carousel from "@/components/Carousel";
import PlaceCard from "@/components/PlaceCard";
import RegionCard from "@/components/RegionCard";
import { REGIONS_DATA, TAG_LABELS, TAG_COLORS } from "@/lib/constants";
import Link from "next/link";

export default function Home() {
  // Live Convex queries
  const featured = useQuery(api.places.listFeatured, { limit: 8 });
  const newest = useQuery(api.places.listNewest, { limit: 8 });

  const popularTags = [
    "parking",
    "delivery",
    "seating",
    "wifi",
    "kids",
    "open-friday",
    "open-saturday",
    "accessible",
  ];

  return (
    <div className="min-h-screen" dir="rtl">
      {/* ===== Hero ===== */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <HeroSection />
      </div>

      {/* ===== Featured Carousel ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <Carousel title="🔥 שווה לנסות">
          {featured === undefined
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 w-[280px] sm:w-[300px] h-[340px] rounded-xl bg-shawarma-900/50 animate-pulse"
                />
              ))
            : featured.map((place) => (
                <div
                  key={place._id}
                  className="snap-start shrink-0 w-[280px] sm:w-[300px]"
                >
                  <PlaceCard place={place} />
                </div>
              ))}
        </Carousel>
      </div>

      {/* ===== Newest Carousel ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <Carousel title="🆕 חדשים שהצטרפו">
          {newest === undefined
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 w-[280px] sm:w-[300px] h-[340px] rounded-xl bg-shawarma-900/50 animate-pulse"
                />
              ))
            : newest.map((place) => (
                <div
                  key={place._id}
                  className="snap-start shrink-0 w-[280px] sm:w-[300px]"
                >
                  <PlaceCard place={place} />
                </div>
              ))}
        </Carousel>
      </div>

      {/* ===== Popular Tags ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-14">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-5">
          🏷️ תגיות פופולריות
        </h2>
        <div className="flex flex-wrap gap-3">
          {popularTags.map((tag) => (
            <Link
              key={tag}
              href={`/explore?tag=${tag}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 hover:shadow-md ${
                TAG_COLORS[tag] || "bg-zinc-700/50 text-zinc-300"
              }`}
            >
              {TAG_LABELS[tag] || tag}
            </Link>
          ))}
        </div>
      </div>

      {/* ===== Region Cards Grid ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-14">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-5">
          🗺️ גלו לפי אזור
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {REGIONS_DATA.map((region) => (
            <RegionCard key={region.name} region={region} />
          ))}
        </div>
      </div>

      {/* ===== Marketing Section ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-16 mb-16">
        <section className="bg-shawarma-900/60 border border-shawarma-800/40 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            🥙 קצת על שווארמה טרייל
          </h2>
          <div className="space-y-4 text-shawarma-300 text-base md:text-lg leading-relaxed max-w-3xl">
            <p>
              <strong className="text-shawarma-100">שווארמה טרייל</strong> הוא
              המדריך המקיף לשווארמה בישראל. אנחנו מאמינים שכל אחד מגיע לדעת
              איפה נמצאת השווארמה הכי טובה — בין אם אתם מחפשים לאפה עסיסית
              בצפון, שווארמת הודו במרכז, או את הבשר על האש בדרום.
            </p>
            <p>
              עם דירוגים אמיתיים מהקהילה, פילטרים חכמים לפי כשרות, סוג בשר,
              סגנון ומחיר — תמצאו בדיוק מה שאתם מחפשים. כל מקום מדורג ב-5
              קטגוריות: טעם הבשר, הלחם, התוספות, השירות והתמורה למחיר.
            </p>
            <p>
              בואו להצטרף למהפכת השווארמה — דרגו, שתפו, וגלו טעמים חדשים. 🔥
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
