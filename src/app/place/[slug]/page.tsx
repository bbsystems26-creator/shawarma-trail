"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
// ⚠️ Run `npx convex dev` to generate this file
import { api } from "../../../../convex/_generated/api";

import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
import type { PlaceData } from "@/components/PlaceCard";
import {
  UI,
  KASHRUT_LABELS,
  MEAT_TYPE_LABELS,
  STYLE_LABELS,
  PRICE_RANGE_LABELS,
  REGION_LABELS,
  RATING_CATEGORIES,
  SITE_NAME,
} from "@/lib/constants";

export default function PlaceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const place = useQuery(api.places.getBySlug, { slug }) as PlaceData | null | undefined;

  // Get reviews for this place (only when place is loaded)
  const reviews = useQuery(
    api.reviews.getByPlace,
    place?._id ? { placeId: place._id as any } : "skip"
  );

  // Loading state
  if (place === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <span className="text-5xl block mb-4 animate-pulse">🥙</span>
          <p className="text-shawarma-400">{UI.loading}</p>
        </div>
      </div>
    );
  }

  // Not found
  if (place === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <span className="text-5xl block mb-4">😢</span>
          <p className="text-xl text-shawarma-300 mb-4">המקום לא נמצא</p>
          <Link
            href="/"
            className="text-shawarma-400 hover:text-shawarma-200 underline"
          >
            {UI.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  const wazeUrl = `https://waze.com/ul?ll=${place.lat},${place.lng}&navigate=yes`;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

  return (
    <div className="min-h-screen">
      {/* ==================== Header ==================== */}
      <header className="sticky top-0 z-40 bg-shawarma-950/90 backdrop-blur-md border-b border-shawarma-800/30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-shawarma-400 hover:text-shawarma-300 transition-colors"
          >
            🥙 {SITE_NAME}
          </Link>
          <Link
            href="/"
            className="text-sm text-shawarma-400 hover:text-shawarma-200 transition-colors"
          >
            ← {UI.backToHome}
          </Link>
        </div>
      </header>

      {/* ==================== Hero Image ==================== */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-shawarma-800 via-shawarma-900 to-shawarma-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(232,93,37,0.2),transparent_70%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl opacity-30">🥙</span>
        </div>
        {/* Image gallery placeholder */}
        {place.images.length > 0 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {place.images.slice(0, 4).map((_, idx) => (
              <div
                key={idx}
                className="w-16 h-16 rounded-lg bg-shawarma-800/80 border border-shawarma-700/50"
              />
            ))}
          </div>
        )}

        {/* Featured badge */}
        {place.isFeatured && (
          <span className="absolute top-4 right-4 bg-amber-500 text-amber-950 text-sm font-bold px-3 py-1.5 rounded-full">
            ⭐ {UI.featured}
          </span>
        )}
      </div>

      {/* ==================== Main Content ==================== */}
      <main className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        {/* Place Info Card */}
        <div className="bg-shawarma-900/95 rounded-2xl border border-shawarma-800/50 p-6 md:p-8 backdrop-blur-sm shadow-xl shadow-black/20 animate-fade-in">
          {/* Name + Rating row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-shawarma-50 mb-2">
                {place.name}
              </h1>
              <p className="text-shawarma-400">
                {place.city} • {REGION_LABELS[place.region]}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1">
              <div className="flex items-center gap-2">
                <StarRating rating={place.avgRating} size={24} />
                <span className="text-2xl font-bold text-amber-400">
                  {place.avgRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-shawarma-500">
                {place.reviewCount} {UI.reviews}
              </p>
            </div>
          </div>

          {/* Description */}
          {place.description && (
            <p className="text-shawarma-200 leading-relaxed mb-6">
              {place.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {/* Kashrut */}
            <Tag
              icon="✡️"
              label={KASHRUT_LABELS[place.kashrut]}
              color="emerald"
            />
            {/* Price */}
            <Tag
              icon="💰"
              label={PRICE_RANGE_LABELS[place.priceRange]}
              color="amber"
            />
            {/* Meat types */}
            {place.meatTypes.map((meat) => (
              <Tag
                key={meat}
                icon="🥩"
                label={MEAT_TYPE_LABELS[meat] ?? meat}
                color="red"
              />
            ))}
            {/* Styles */}
            {place.style.map((s) => (
              <Tag
                key={s}
                icon="🫓"
                label={STYLE_LABELS[s] ?? s}
                color="orange"
              />
            ))}
            {/* Delivery / Seating */}
            {place.hasDelivery && <Tag icon="🛵" label={UI.delivery} color="blue" />}
            {place.hasSeating && <Tag icon="🪑" label={UI.seating} color="purple" />}
            {place.isVerified && <Tag icon="✅" label={UI.verified} color="green" />}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Address + Navigation */}
            <div className="space-y-3">
              <DetailRow icon="📍" label={UI.addressLabel} value={place.address} />
              {place.phone && (
                <DetailRow
                  icon="📞"
                  label={UI.phoneLabel}
                  value={
                    <a
                      href={`tel:${place.phone}`}
                      className="text-shawarma-400 hover:text-shawarma-200 underline"
                      dir="ltr"
                    >
                      {place.phone}
                    </a>
                  }
                />
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col gap-3">
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-sm"
              >
                🚗 {UI.navigateWaze}
              </a>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-shawarma-700 hover:bg-shawarma-600 text-white rounded-xl font-medium transition-colors text-sm"
              >
                📍 {UI.navigateGoogle}
              </a>
            </div>
          </div>
        </div>

        {/* ==================== Reviews Section ==================== */}
        <section className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-shawarma-100">
            💬 {UI.reviewsSection} ({place.reviewCount})
          </h2>

          {/* Existing Reviews */}
          {reviews === undefined ? (
            <div className="text-center py-8 text-shawarma-500">
              {UI.loading}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {(reviews as any[]).map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-shawarma-900/50 rounded-xl border border-shawarma-800/30">
              <span className="text-3xl block mb-2">📝</span>
              <p className="text-shawarma-500">{UI.noReviews}</p>
              <p className="text-sm text-shawarma-600 mt-1">
                היו הראשונים לכתוב ביקורת!
              </p>
            </div>
          )}

          {/* Review Form */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-shawarma-100 mb-4">
              ✍️ {UI.writeReview}
            </h3>
            <ReviewForm
              placeId={place._id}
              onSubmit={(review) => {
                console.log("Review submitted:", review);
                // In production, this would call the Convex mutation
                // useMutation(api.reviews.create) — requires auth
              }}
            />
          </div>
        </section>

        {/* Spacer before footer */}
        <div className="h-16" />
      </main>

      {/* ==================== Footer ==================== */}
      <footer className="bg-shawarma-950 border-t border-shawarma-800/30 mt-8">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <Link href="/" className="text-sm text-shawarma-500 hover:text-shawarma-300">
            🥙 {SITE_NAME}
          </Link>
        </div>
      </footer>
    </div>
  );
}

// ==================== Sub-components ====================

function Tag({
  icon,
  label,
  color,
}: {
  icon: string;
  label: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-900/50 text-emerald-300 border-emerald-800/30",
    amber: "bg-amber-900/50 text-amber-300 border-amber-800/30",
    red: "bg-red-900/50 text-red-300 border-red-800/30",
    orange: "bg-orange-900/50 text-orange-300 border-orange-800/30",
    blue: "bg-blue-900/50 text-blue-300 border-blue-800/30",
    purple: "bg-purple-900/50 text-purple-300 border-purple-800/30",
    green: "bg-green-900/50 text-green-300 border-green-800/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
        colorClasses[color] ?? colorClasses.orange
      }`}
    >
      <span>{icon}</span>
      {label}
    </span>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-lg mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-shawarma-500">{label}</p>
        <p className="text-sm text-shawarma-200">{value}</p>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: any }) {
  return (
    <div className="bg-shawarma-900/80 rounded-xl border border-shawarma-800/30 p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-shawarma-700 flex items-center justify-center text-sm">
            👤
          </div>
          <span className="font-medium text-shawarma-200 text-sm">
            {review.userName ?? "אנונימי"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <StarRating rating={review.ratingOverall} size={14} />
          <span className="text-sm font-bold text-amber-400">
            {review.ratingOverall.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Sub-ratings */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
        {(Object.entries(RATING_CATEGORIES) as [string, string][]).map(
          ([key, label]) => {
            const val = review[key];
            if (!val) return null;
            return (
              <div
                key={key}
                className="text-xs text-shawarma-400 flex items-center gap-1"
              >
                <span>{label}:</span>
                <span className="text-amber-400 font-medium">{val}</span>
              </div>
            );
          }
        )}
      </div>

      {/* Text */}
      <p className="text-sm text-shawarma-300 leading-relaxed">{review.text}</p>

      {/* Helpful */}
      {review.helpfulCount > 0 && (
        <p className="text-xs text-shawarma-600 mt-3">
          👍 {review.helpfulCount} אנשים מצאו את הביקורת מועילה
        </p>
      )}
    </div>
  );
}
