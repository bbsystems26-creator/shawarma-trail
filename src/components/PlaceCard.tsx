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

const FOOD_IMAGES = [
  "/images/food/shawarma-plate-1.png",
  "/images/food/shawarma-plate-2.png",
  "/images/food/shawarma-plate-3.png",
  "/images/food/shawarma-grill-1.png",
  "/images/food/shawarma-wrap-1.png",
  "/images/food/shawarma-spread-1.png",
  "/images/food/shawarma-laffa.png",
  "/images/food/shawarma-pita.png",
];

function getFoodImage(name: string) {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FOOD_IMAGES[hash % FOOD_IMAGES.length];
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const kashrutBadgeColor: Record<string, string> = {
    none: "bg-gray-100 text-gray-600",
    regular: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    mehadrin: "bg-blue-50 text-blue-700 border border-blue-200",
    badatz: "bg-purple-50 text-purple-700 border border-purple-200",
  };

  return (
    <Link
      href={`/place/${place.slug}`}
      className="group block rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300"
    >
      {/* Image / Food Photo */}
      <div className="relative h-48 md:h-52 overflow-hidden">
        <img
          src={getFoodImage(place.name)}
          alt={place.name}
          className="w-full h-full object-cover"
        />

        {/* Verified badge */}
        {(place.isFeatured || place.isVerified) && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs md:text-sm font-bold px-2 md:px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            {place.isFeatured ? <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" /> : <BadgeCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />} {place.isFeatured ? UI.featured : UI.verified}
          </span>
        )}

        {/* Price range */}
        <span className="absolute top-3 left-3 bg-black/60 text-white text-sm md:text-base font-bold px-2 md:px-2.5 py-1 rounded-full backdrop-blur-sm">
          {PRICE_RANGE_LABELS[place.priceRange]}
        </span>

        {/* Region badge */}
        <span className="absolute bottom-3 right-3 bg-black/50 text-white/90 text-xs md:text-sm px-2 py-1 rounded-full backdrop-blur-sm inline-flex items-center gap-1">
          <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5" /> {REGION_LABELS[place.region] || place.region}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name + City */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
            {place.name}
          </h3>
          <p className="text-sm text-gray-500">{place.city}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarRating rating={place.avgRating} size={16} />
          <span className="text-sm md:text-base font-semibold text-amber-500">
            {place.avgRating.toFixed(1)}
          </span>
          <span className="text-xs md:text-sm text-gray-400">
            ({place.reviewCount} {UI.reviews})
          </span>
        </div>

        {/* Kashrut + Meat badges */}
        <div className="flex flex-wrap gap-2">
          <span
            className={`text-xs md:text-sm px-2 md:px-2.5 py-0.5 rounded-full font-medium ${kashrutBadgeColor[place.kashrut] ?? "bg-gray-100 text-gray-600"}`}
          >
            {KASHRUT_LABELS[place.kashrut]}
          </span>
          {place.meatTypes.slice(0, 2).map((meat) => (
            <span
              key={meat}
              className="text-xs md:text-sm px-2 md:px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200"
            >
              {MEAT_TYPE_LABELS[meat] ?? meat}
            </span>
          ))}
        </div>

        {/* Tags + CTA row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-xs md:text-sm text-gray-500">
            {place.hasDelivery && <span className="inline-flex items-center gap-1"><Truck className="w-3.5 h-3.5 md:w-4 md:h-4" /> {UI.delivery}</span>}
            {place.hasSeating && <span className="inline-flex items-center gap-1"><Armchair className="w-3.5 h-3.5 md:w-4 md:h-4" /> {UI.seating}</span>}
          </div>
          {/* Phone/WhatsApp CTAs */}
          <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
            {place.phone && (
              <a
                href={`tel:${place.phone}`}
                className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded-full hover:bg-green-100 transition-colors inline-flex items-center"
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
                className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded-full hover:bg-green-100 transition-colors inline-flex items-center"
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
