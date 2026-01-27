"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
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

export default function PlacePage() {
  const params = useParams();
  const slug = params.slug as string;

  const place = useQuery(api.places.getBySlug, { slug });
  const reviews = useQuery(
    api.reviews.getByPlace,
    place ? { placeId: place._id } : "skip"
  );

  if (place === undefined) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4 animate-pulse">🥙</span>
        <p className="text-gray-400">{UI_TEXT.loading}</p>
      </div>
    );
  }

  if (place === null) {
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
  const reviewList = reviews ?? [];

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
                .map((m: string) => MEAT_TYPE_LABELS[m] || m)
                .join(", ")}
            </span>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <span className="text-sm text-gray-500 block mb-1">סגנון</span>
            <span className="text-white">
              {place.style
                .map((s: string) => STYLE_LABELS[s] || s)
                .join(", ")}
            </span>
          </div>
        </div>

        {/* Opening Hours */}
        {place.openingHours && (
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 mb-6">
            <h3 className="text-sm text-gray-500 mb-2">{UI_TEXT.hours}</h3>
            <div className="grid grid-cols-2 gap-1 text-sm">
              {Object.entries(place.openingHours as Record<string, string>).map(
                ([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-400">{day}</span>
                    <span className="text-white">{hours}</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {place.hasDelivery && (
            <span className="text-xs bg-green-900/30 text-green-400 px-3 py-1 rounded-full">
              🛵 {UI_TEXT.delivery}
            </span>
          )}
          {place.hasSeating && (
            <span className="text-xs bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full">
              🪑 {UI_TEXT.seating}
            </span>
          )}
          {place.phone && (
            <a
              href={`tel:${place.phone}`}
              className="text-xs bg-zinc-800 text-gray-300 px-3 py-1 rounded-full hover:bg-zinc-700"
            >
              📞 {place.phone}
            </a>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {UI_TEXT.reviews} ({reviewList.length})
        </h2>

        {reviewList.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-zinc-900 rounded-xl border border-zinc-800 mb-8">
            <span className="text-3xl block mb-2">📝</span>
            <p>אין ביקורות עדיין — היו הראשונים!</p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {reviewList.map((review) => (
              <div
                key={review._id}
                className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <span className="text-orange-400 font-bold">
                        {review.userName?.[0] || "?"}
                      </span>
                    </div>
                    <span className="font-bold text-white">
                      {review.userName || "אנונימי"}
                    </span>
                  </div>
                  <StarRating rating={review.ratingOverall} size="sm" />
                </div>
                <p className="text-gray-300 mb-3">{review.text}</p>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div className="text-center">
                    <span className="text-gray-500 block">
                      {RATING_LABELS.meat}
                    </span>
                    <span className="text-amber-400">
                      {review.ratingMeat} ★
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500 block">
                      {RATING_LABELS.bread}
                    </span>
                    <span className="text-amber-400">
                      {review.ratingBread} ★
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500 block">
                      {RATING_LABELS.sides}
                    </span>
                    <span className="text-amber-400">
                      {review.ratingSides} ★
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500 block">
                      {RATING_LABELS.service}
                    </span>
                    <span className="text-amber-400">
                      {review.ratingService} ★
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500 block">
                      {RATING_LABELS.value}
                    </span>
                    <span className="text-amber-400">
                      {review.ratingValue} ★
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write Review — disabled until auth */}
        <ReviewForm
          onSubmit={(review) => {
            // TODO: Connect to Convex mutation with auth
            console.log("New review:", review);
            alert("צריך להירשם כדי לכתוב ביקורת (בקרוב!)");
          }}
        />
      </section>
    </div>
  );
}
