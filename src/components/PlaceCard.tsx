"use client";

import Link from "next/link";
import StarRating from "./StarRating";
import {
  KASHRUT_LABELS,
  MEAT_TYPE_LABELS,
  PRICE_RANGE_LABELS,
  UI,
} from "@/lib/constants";

// Type matching the Convex places schema
// Once `npx convex dev` runs, replace with Doc<"places"> from convex/_generated/dataModel
export interface PlaceData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  address: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  kashrut: string;
  meatTypes: string[];
  style: string[];
  priceRange: number;
  hasDelivery: boolean;
  hasSeating: boolean;
  images: string[];
  avgRating: number;
  reviewCount: number;
  isFeatured: boolean;
  isVerified: boolean;
}

interface PlaceCardProps {
  place: PlaceData;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const kashrutBadgeColor: Record<string, string> = {
    none: "bg-zinc-600 text-zinc-200",
    regular: "bg-emerald-700 text-emerald-100",
    mehadrin: "bg-blue-700 text-blue-100",
    badatz: "bg-purple-700 text-purple-100",
  };

  return (
    <Link
      href={`/place/${place.slug}`}
      className="group block rounded-xl overflow-hidden bg-shawarma-900/80 border border-shawarma-800/50 hover:border-shawarma-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-shawarma-500/10"
    >
      {/* Image */}
      <div className="relative h-48 bg-shawarma-800 overflow-hidden">
        {place.images.length > 0 ? (
          <div className="w-full h-full bg-gradient-to-br from-shawarma-700 to-shawarma-900 flex items-center justify-center">
            <span className="text-5xl">🥙</span>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-shawarma-700 to-shawarma-900 flex items-center justify-center">
            <span className="text-5xl">🥙</span>
          </div>
        )}

        {/* Featured badge */}
        {place.isFeatured && (
          <span className="absolute top-3 right-3 bg-amber-500 text-amber-950 text-xs font-bold px-2 py-1 rounded-full">
            ⭐ {UI.featured}
          </span>
        )}

        {/* Price range */}
        <span className="absolute top-3 left-3 bg-shawarma-950/80 text-shawarma-200 text-sm font-bold px-2 py-1 rounded-full backdrop-blur-sm">
          {PRICE_RANGE_LABELS[place.priceRange]}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name + City */}
        <div>
          <h3 className="text-lg font-bold text-shawarma-50 group-hover:text-shawarma-400 transition-colors">
            {place.name}
          </h3>
          <p className="text-sm text-shawarma-400">{place.city}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarRating rating={place.avgRating} size={16} />
          <span className="text-sm font-semibold text-amber-400">
            {place.avgRating.toFixed(1)}
          </span>
          <span className="text-xs text-shawarma-500">
            ({place.reviewCount} {UI.reviews})
          </span>
        </div>

        {/* Kashrut badge */}
        <div className="flex flex-wrap gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${kashrutBadgeColor[place.kashrut] ?? "bg-zinc-600 text-zinc-200"}`}
          >
            {KASHRUT_LABELS[place.kashrut]}
          </span>

          {/* Meat types */}
          {place.meatTypes.slice(0, 3).map((meat) => (
            <span
              key={meat}
              className="text-xs px-2 py-0.5 rounded-full bg-shawarma-800 text-shawarma-300"
            >
              {MEAT_TYPE_LABELS[meat] ?? meat}
            </span>
          ))}
        </div>

        {/* Tags row */}
        <div className="flex gap-2 text-xs text-shawarma-500">
          {place.hasDelivery && <span>🛵 {UI.delivery}</span>}
          {place.hasSeating && <span>🪑 {UI.seating}</span>}
          {place.isVerified && <span>✅ {UI.verified}</span>}
        </div>
      </div>
    </Link>
  );
}
