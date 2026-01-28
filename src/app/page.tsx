"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import HeroSection from "@/components/HeroSection";
import Carousel from "@/components/Carousel";
import PlaceCard from "@/components/PlaceCard";
import RegionCard from "@/components/RegionCard";
import { REGIONS_DATA, TAG_LABELS, TAG_COLORS, TAG_ICONS } from "@/lib/constants";
import Link from "next/link";

export default function Home() {
  const featured = useQuery(api.places.listFeatured, { limit: 8 });
  const newest = useQuery(api.places.listNewest, { limit: 8 });

  const popularTags = [
    "parking", "delivery", "seating", "wifi",
    "kids", "open-friday", "open-saturday", "accessible",
  ];

  return (
    <div className="min-h-screen" dir="rtl">
      {/* ===== Hero ===== */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <HeroSection />
      </div>

      {/* ===== Region Cards Grid (moved up!) ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-5">
          🗺️ גלו לפי אזור
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {REGIONS_DATA.map((region) => (
            <RegionCard key={region.name} region={region} />
          ))}
        </div>
      </div>

      {/* ===== Featured Carousel ===== */}
      {featured && featured.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <Carousel title="🔥 שווה לנסות">
            {featured.map((place) => (
              <div key={place._id} className="snap-start shrink-0 w-[280px] sm:w-[300px]">
                <PlaceCard place={place} />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {/* ===== Newest Carousel ===== */}
      {newest && newest.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <Carousel title="🆕 חדשים שהצטרפו">
            {newest.map((place) => (
              <div key={place._id} className="snap-start shrink-0 w-[280px] sm:w-[300px]">
                <PlaceCard place={place} />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {/* ===== Loading state for carousels ===== */}
      {(featured === undefined || newest === undefined) && (
        <div className="max-w-7xl mx-auto px-4 mt-12">
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-[280px] sm:w-[300px] h-[340px] rounded-xl bg-shawarma-900/50 animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

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
              {TAG_ICONS[tag] ? `${TAG_ICONS[tag]} ` : ""}{TAG_LABELS[tag] || tag}
            </Link>
          ))}
        </div>
      </div>

      {/* ===== Value Propositions ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-14">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-5">
          🥙 קצת על שווארמה טרייל
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="text-lg font-bold text-white mb-2">מצאו את השווארמה שלכם</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              חפשו לפי מיקום, סוג בשר, כשרות ודירוג. מעל 500 מקומות ברחבי הארץ
            </p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-lg font-bold text-white mb-2">דרגו ושתפו</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              דירוג ב-5 קטגוריות: בשר, לחם, תוספות, שירות ותמורה למחיר
            </p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-bold text-white mb-2">שווארמה לאירוע</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              מחפשים קייטרינג שווארמה? מצאו ספקים מומלצים באזור שלכם
            </p>
          </div>
        </div>
      </div>

      {/* ===== Marketing Section ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-16 mb-16">
        <section className="bg-gradient-to-br from-orange-900/40 via-shawarma-900/60 to-amber-900/40 border border-shawarma-700/30 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            🥙 קצת על שווארמה טרייל
          </h2>
          <div className="space-y-4 text-shawarma-200 text-base md:text-lg leading-relaxed max-w-3xl">
            <p>
              <strong className="text-white">שווארמה טרייל</strong> הוא
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
