"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
import {
  KASHRUT_LABELS,
  MEAT_TYPE_LABELS,
  STYLE_LABELS,
  PRICE_LABELS,
  UI_TEXT,
  RATING_LABELS,
} from "@/lib/constants";
import { DEMO_PLACES } from "@/lib/demoData";

// Demo reviews
const DEMO_REVIEWS = [
  {
    id: "1",
    userName: "יוסי כהן",
    ratingOverall: 4.8,
    ratingMeat: 5,
    ratingBread: 4.5,
    ratingSides: 4.5,
    ratingService: 5,
    ratingValue: 4.5,
    text: "שווארמה מדהימה! הבשר עסיסי, הלאפה טרייה, והתוספות מעולות. שווה כל שקל.",
    helpfulCount: 23,
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    userName: "שרה לוי",
    ratingOverall: 4.5,
    ratingMeat: 5,
    ratingBread: 4,
    ratingSides: 4,
    ratingService: 4.5,
    ratingValue: 5,
    text: "מקום מעולה! מגיעים לכאן בכל שבוע. המנות גדולות והמחיר הוגן.",
    helpfulCount: 15,
    createdAt: "2026-01-10",
  },
];

export default function PlacePage() {
  const params = useParams();
  const slug = params.slug as string;

  // TODO: Replace with useQuery(api.places.getBySlug, { slug })
  const place = DEMO_PLACES.find((p) => p.slug === slug);

  if (!place) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">🥙</span>
        <h1 className="text-2xl font-bold text-white mb-2">מקום לא נמצא</h1>
        <p className="text-gray-400 mb-6">
          השווארמה שחיפשת לא נמצאה במאגר שלנו
        </p>
        <Link
          href="/"
          className="text-orange-400 hover:text-orange-300 transition-colors"
        >
          ← חזרה לדף הבית
        </Link>
      </div>
    );
  }

  const wazeLink = `https://waze.com/ul?ll=${place.lat},${place.lng}&navigate=yes`;
  const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-orange-400 transition-colors">
          דף הבית
        </Link>
        <span className="mx-2">←</span>
        <span className="text-gray-300">{place.name}</span>
      </nav>

      {/* Hero Image */}
      <div className="h-64 md:h-80 bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-2xl flex items-center justify-center mb-8 relative">
        <span className="text-8xl">🥙</span>
        {place.isFeatured && (
          <span className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full font-bold">
            {UI_TEXT.featured} ⭐
          </span>
        )}
      </div>

      {/* Place Info */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1">
              {place.name}
            </h1>
            <p className="text-gray-400">{place.address}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={wazeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              Waze 🚗
            </a>
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              Google Maps 📍
            </a>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-4 mb-4">
          <StarRating rating={place.avgRating} size="lg" />
          <span className="text-gray-400">
            ({place.reviewCount} {UI_TEXT.reviews})
          </span>
        </div>

        {/* Description */}
        {place.description && (
          <p className="text-gray-300 text-lg mb-6">{place.description}</p>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <span className="text-sm text-gray-500 block mb-1">כשרות</span>
            <span className="text-orange-400 font-bold">
              {KASHRUT_LABELS[place.kashrut]}
            </span>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <span className="text-sm text-gray-500 block mb-1">מחיר</span>
            <span className="text-orange-400 font-bold text-lg">
              {PRICE_LABELS[place.priceRange]}
            </span>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <span className="text-sm text-gray-500 block mb-1">סוג בשר</span>
            <span className="text-white">
              {place.meatTypes
                .map((m) => MEAT_TYPE_LABELS[m] || m)
                .join(", ")}
            </span>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <span className="text-sm text-gray-500 block mb-1">סגנון</span>
            <span className="text-white">
              {place.style.map((s) => STYLE_LABELS[s] || s).join(", ")}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {place.meatTypes.map((meat) => (
            <span
              key={meat}
              className="text-xs bg-zinc-800 text-gray-300 px-3 py-1 rounded-full"
            >
              {MEAT_TYPE_LABELS[meat] || meat}
            </span>
          ))}
          {place.style.map((s) => (
            <span
              key={s}
              className="text-xs bg-zinc-800 text-orange-300 px-3 py-1 rounded-full"
            >
              {STYLE_LABELS[s] || s}
            </span>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {UI_TEXT.reviews} ({DEMO_REVIEWS.length})
        </h2>

        <div className="space-y-4 mb-8">
          {DEMO_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 font-bold">
                      {review.userName[0]}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-white">
                      {review.userName}
                    </span>
                    <span className="text-xs text-gray-500 block">
                      {review.createdAt}
                    </span>
                  </div>
                </div>
                <StarRating rating={review.ratingOverall} size="sm" />
              </div>

              <p className="text-gray-300 mb-3">{review.text}</p>

              <div className="grid grid-cols-5 gap-2 text-xs">
                <div className="text-center">
                  <span className="text-gray-500 block">{RATING_LABELS.meat}</span>
                  <span className="text-amber-400">{review.ratingMeat} ★</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-500 block">{RATING_LABELS.bread}</span>
                  <span className="text-amber-400">{review.ratingBread} ★</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-500 block">{RATING_LABELS.sides}</span>
                  <span className="text-amber-400">{review.ratingSides} ★</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-500 block">{RATING_LABELS.service}</span>
                  <span className="text-amber-400">{review.ratingService} ★</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-500 block">{RATING_LABELS.value}</span>
                  <span className="text-amber-400">{review.ratingValue} ★</span>
                </div>
              </div>

              <div className="mt-3 text-left">
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  👍 מועיל ({review.helpfulCount})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Write Review */}
        <ReviewForm
          onSubmit={(review) => {
            // TODO: Connect to Convex mutation
            console.log("New review:", review);
            alert("ביקורת נשלחה! (דמו — יחובר ל-Convex)");
          }}
        />
      </section>
    </div>
  );
}
