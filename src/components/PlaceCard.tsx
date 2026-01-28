"use client";

import Link from "next/link";
import StarRating from "./StarRating";
import {
  KASHRUT_LABELS,
  MEAT_TYPE_LABELS,
  PRICE_RANGE_LABELS,
  REGION_LABELS,
  UI,
} from "@/lib/constants";
import { Star, BadgeCheck, MapPin, Truck, Armchair, Phone, MessageCircle } from "lucide-react";

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
  phone?: string;
  whatsapp?: string;
}

interface PlaceCardProps {
  place: PlaceData;
}

const GRADIENT_COLORS = [
  "from-orange-600 via-amber-700 to-red-800",
  "from-red-700 via-rose-800 to-amber-900",
  "from-amber-600 via-orange-700 to-red-900",
  "from-rose-600 via-red-700 to-orange-800",
];

function getGradient(name: string) {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENT_COLORS[hash % GRADIENT_COLORS.length];
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
      {/* Image / Gradient Placeholder */}
      <div className="relative h-48 overflow-hidden">
        <div className={`w-full h-full bg-gradient-to-br ${getGradient(place.name)} flex flex-col items-center justify-center gap-2`}>
          <span className="text-5xl drop-shadow-lg">🥙</span>
          <span className="text-white/80 text-sm font-medium drop-shadow">{place.name}</span>
        </div>

        {/* Verified badge */}
        {(place.isFeatured || place.isVerified) && (
          <span className="absolute top-3 right-3 bg-amber-500 text-amber-950 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            {place.isFeatured ? <Star className="w-3.5 h-3.5 fill-current" /> : <BadgeCheck className="w-3.5 h-3.5" />} {place.isFeatured ? UI.featured : UI.verified}
          </span>
        )}

        {/* Price range */}
        <span className="absolute top-3 left-3 bg-black/60 text-white text-sm font-bold px-2 py-1 rounded-full backdrop-blur-sm">
          {PRICE_RANGE_LABELS[place.priceRange]}
        </span>

        {/* Region badge */}
        <span className="absolute bottom-3 right-3 bg-black/50 text-white/90 text-xs px-2 py-1 rounded-full backdrop-blur-sm inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {REGION_LABELS[place.region] || place.region}
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

        {/* Kashrut + Meat badges */}
        <div className="flex flex-wrap gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${kashrutBadgeColor[place.kashrut] ?? "bg-zinc-600 text-zinc-200"}`}
          >
            {KASHRUT_LABELS[place.kashrut]}
          </span>
          {place.meatTypes.slice(0, 2).map((meat) => (
            <span
              key={meat}
              className="text-xs px-2 py-0.5 rounded-full bg-shawarma-800 text-shawarma-300"
            >
              {MEAT_TYPE_LABELS[meat] ?? meat}
            </span>
          ))}
        </div>

        {/* Tags + CTA row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-xs text-shawarma-500">
            {place.hasDelivery && <span className="inline-flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> {UI.delivery}</span>}
            {place.hasSeating && <span className="inline-flex items-center gap-1"><Armchair className="w-3.5 h-3.5" /> {UI.seating}</span>}
          </div>
          {/* Phone/WhatsApp CTAs */}
          <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
            {place.phone && (
              <a
                href={`tel:${place.phone}`}
                className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full hover:bg-green-600/40 transition-colors inline-flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            )}
            {place.whatsapp && (
              <a
                href={`https://wa.me/${place.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full hover:bg-green-600/40 transition-colors inline-flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
