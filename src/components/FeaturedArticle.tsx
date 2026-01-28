"use client";

import Link from "next/link";
import { Flame, BookOpen, Clock, User } from "lucide-react";

export default function FeaturedArticle() {
  return (
    <section dir="rtl" className="w-full bg-white py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-semibold text-amber-600 tracking-wide">
            כתבה מומלצת
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image placeholder — in RTL this appears on the right (visually left on screen) */}
          <div className="order-1 md:order-2">
            <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center"
              style={{ aspectRatio: "16 / 10" }}
            >
              {/* Subtle decorative rings */}
              <div className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full border-2 border-amber-200/60" />
              <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border border-orange-200/40" />
              <Flame className="w-16 h-16 md:w-24 md:h-24 text-amber-500/70" />
            </div>
          </div>

          {/* Text content */}
          <div className="order-2 md:order-1 flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              המדריך המלא לשווארמה בישראל
            </h3>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
              מהצפון ועד הדרום, סקרנו מאות מקומות שווארמה כדי להביא לכם את
              הרשימה המושלמת. גלו את הסודות של השווארמה הישראלית, מהבשר על
              השיפוד ועד הלאפה החמה.
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>צוות שווארמה ביס</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>קריאה של 5 דקות</span>
              </div>
            </div>

            {/* CTA */}
            <div>
              <Link
                href="/blog/guide"
                className="inline-flex items-center gap-2 text-amber-600 font-bold text-base hover:text-amber-700 transition-colors group"
              >
                <span>קראו עוד</span>
                <span className="inline-block transition-transform group-hover:-translate-x-1">
                  ←
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
