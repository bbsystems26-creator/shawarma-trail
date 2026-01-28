"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import HeroSection from "@/components/HeroSection";
import Carousel from "@/components/Carousel";
import PlaceCard from "@/components/PlaceCard";
import RegionCard from "@/components/RegionCard";
import { REGIONS_DATA, TAG_LABELS, TAG_COLORS } from "@/lib/constants";
import Link from "next/link";
import { Map, Flame, Sparkles, Star, PartyPopper } from "lucide-react";
import { TagIcon } from "@/components/TagIcon";
import CategoryCarousel from "@/components/CategoryCarousel";

export default function Home() {
  const featured = useQuery(api.places.listFeatured, { limit: 8 });
  const newest = useQuery(api.places.listNewest, { limit: 8 });

  const popularTags = [
    "parking", "delivery", "seating", "wifi",
    "kids", "open-friday", "open-saturday", "accessible",
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* ===== Hero (full-width) ===== */}
      <HeroSection />

      {/* ===== Region Cards Grid ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-10 md:mt-14 lg:mt-16">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Map className="w-6 h-6 inline text-gray-700" /> גלו לפי אזור
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {REGIONS_DATA.map((region) => (
            <RegionCard key={region.name} region={region} />
          ))}
        </div>
      </div>

      {/* ===== Featured Carousel ===== */}
      {featured && featured.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-12 md:mt-16 lg:mt-20">
          <Carousel title={<span className="inline-flex items-center gap-2"><Flame className="w-5 h-5 inline text-orange-500" /> שווה לנסות</span>}>
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
        <div className="max-w-7xl mx-auto px-4 mt-12 md:mt-16 lg:mt-20">
          <Carousel title={<span className="inline-flex items-center gap-2"><Sparkles className="w-5 h-5 inline text-blue-500" /> חדשים שהצטרפו</span>}>
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
                className="shrink-0 w-[280px] sm:w-[300px] h-[340px] rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {/* ===== Category Carousels ===== */}
      <CategoryCarousel tag="open-saturday" title="פתוח בשבת" />
      <CategoryCarousel tag="delivery" title="משלוחים" />
      <CategoryCarousel tag="outdoor-seating" title="ישיבה בחוץ" />
      <CategoryCarousel tag="kids" title="ידידותי לילדים" />

      {/* ===== Popular Tags ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-14 md:mt-16 lg:mt-20">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-5">
          🏷️ תגיות פופולריות
        </h2>
        <div className="flex flex-wrap gap-3 md:gap-4">
          {popularTags.map((tag) => (
            <Link
              key={tag}
              href={`/explore?tag=${tag}`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium transition-all hover:scale-105 hover:shadow-md ${
                TAG_COLORS[tag] || "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              <TagIcon tag={tag} className="w-4 h-4 md:w-5 md:h-5" />
              {TAG_LABELS[tag] || tag}
            </Link>
          ))}
        </div>
      </div>

      {/* ===== About ShawarmaBis ===== */}
      <div className="max-w-7xl mx-auto px-4 mt-16 md:mt-20 lg:mt-24 mb-16">
        <section className="bg-amber-50 border border-amber-100 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <img src="/images/logo.png" alt="" className="w-8 h-8" /> קצת על שווארמה ביס
            </h2>
            <div className="space-y-4 text-gray-600 text-base md:text-lg leading-relaxed mb-8">
              <p>
                <strong className="text-gray-900">שווארמה ביס</strong> הוא
                המדריך המקיף לשווארמה בישראל. אנחנו מאמינים שכל אחד מגיע לדעת
                איפה נמצאת השווארמה הכי טובה — בין אם אתם מחפשים לאפה עסיסית
                בצפון, שווארמת הודו במרכז, או את הבשר על האש בדרום.
              </p>
              <p>
                עם דירוגים אמיתיים מהקהילה, פילטרים חכמים לפי כשרות, סוג בשר,
                סגנון ומחיר — תמצאו בדיוק מה שאתם מחפשים. כל מקום מדורג ב-5
                קטגוריות: טעם הבשר, הלחם, התוספות, השירות והתמורה למחיר.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-amber-100 rounded-xl p-6 text-center shadow-sm">
                <div className="flex justify-center mb-3"><Map className="w-10 h-10 text-amber-500" /></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">מצאו את השווארמה שלכם</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  חפשו לפי מיקום, סוג בשר, כשרות ודירוג
                </p>
              </div>
              <div className="bg-white border border-amber-100 rounded-xl p-6 text-center shadow-sm">
                <div className="flex justify-center mb-3"><Star className="w-10 h-10 text-amber-500" /></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">דרגו ושתפו</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  דירוג ב-5 קטגוריות: בשר, לחם, תוספות, שירות ותמורה
                </p>
              </div>
              <div className="bg-white border border-amber-100 rounded-xl p-6 text-center shadow-sm">
                <div className="flex justify-center mb-3"><PartyPopper className="w-10 h-10 text-amber-500" /></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">שווארמה לאירוע</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  מחפשים קייטרינג שווארמה? מצאו ספקים מומלצים
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
