"use client";


import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
import ActionButtons from "@/components/ActionButtons";
import TagBadges from "@/components/TagBadges";
import OpenStatus from "@/components/OpenStatus";
import SocialLinks from "@/components/SocialLinks";
import StaticMap from "@/components/StaticMap";
import {
  KASHRUT_LABELS,
  MEAT_TYPE_LABELS,
  STYLE_LABELS,
  PRICE_LABELS,
  UI_TEXT,
  RATING_LABELS,
} from "@/lib/constants";
import { Star, MapPin, Truck, Armchair, Phone } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 text-center">
        <span className="text-6xl block mb-4 animate-pulse">🥙</span>
        <p className="text-gray-400">{UI_TEXT.loading}</p>
      </div>
    );
  }

  if (place === null) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 text-center">
        <span className="text-6xl block mb-4">🥙</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">מקום לא נמצא</h1>
        <p className="text-gray-500 mb-6">
          השווארמה שחיפשת לא נמצאה במאגר שלנו
        </p>
        <Link
          href="/"
          className="text-amber-600 hover:text-amber-700 transition-colors"
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
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-amber-600 transition-colors">
          דף הבית
        </Link>
        <span className="mx-2">←</span>
        <span className="text-gray-700">{place.name}</span>
      </nav>

      {/* Hero Image */}
      <div className="h-64 md:h-80 rounded-2xl overflow-hidden mb-8 relative border border-amber-100">
        {place.images && place.images.length > 0 ? (
          <img
            src={place.images[0]}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
            <span className="text-8xl">🥙</span>
          </div>
        )}
        {place.isFeatured && (
          <span className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full font-bold inline-flex items-center gap-1">
            {UI_TEXT.featured} <Star className="w-4 h-4 fill-current" />
          </span>
        )}
      </div>

      {/* Place Name + Status (full width) */}
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                {place.name}
              </h1>
              <OpenStatus openingHours={place.openingHours as Record<string, string> | undefined} />
            </div>
            <p className="text-gray-500">{place.address}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={wazeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              Waze 🚗
            </a>
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              <span className="inline-flex items-center gap-1">Google Maps <MapPin className="w-4 h-4" /></span>
            </a>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-4">
          <StarRating rating={place.avgRating} size={28} />
          <span className="text-gray-500">
            ({place.reviewCount} {UI_TEXT.reviews})
          </span>
        </div>
      </div>

      {/* ── Two-column layout on desktop ─────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Left column: main content ──────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Description */}
          {place.description && (
            <p className="text-gray-600 text-lg mb-6">{place.description}</p>
          )}

          {/* Social Links */}
          <div className="mb-6">
            <SocialLinks
              socialLinks={place.socialLinks as { instagram?: string; facebook?: string; tiktok?: string } | undefined}
              website={place.website as string | undefined}
            />
          </div>

          {/* Menu Items */}
          {place.menuItems && (place.menuItems as Array<{ category?: string; name: string; price?: number | string }>).length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
              <h3 className="text-amber-600 font-bold mb-4 text-lg">🍽️ תפריט</h3>
              {(() => {
                const items = place.menuItems as Array<{ category?: string; name: string; price?: number | string }>;
                const grouped: Record<string, typeof items> = {};
                items.forEach((item) => {
                  const cat = item.category || "כללי";
                  if (!grouped[cat]) grouped[cat] = [];
                  grouped[cat].push(item);
                });
                return Object.entries(grouped).map(([category, catItems]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    {Object.keys(grouped).length > 1 && (
                      <h4 className="text-amber-600 font-bold text-sm mb-2 border-b border-gray-200 pb-1">
                        {category}
                      </h4>
                    )}
                    <ul className="space-y-2">
                      {catItems.map((item, i) => (
                        <li
                          key={i}
                          className="flex justify-between items-center text-gray-700"
                        >
                          <span>{item.name}</span>
                          {item.price != null && (
                            <span className="text-amber-600 font-bold mr-4">
                              ₪{item.price}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ));
              })()}
            </div>
          )}

          {/* Tag Badges (v2) */}
          {place.tags && place.tags.length > 0 && (
            <TagBadges tags={place.tags} className="mb-6" />
          )}

          {/* Owner Story */}
          {place.ownerStory && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
              <h3 className="text-amber-600 font-bold mb-3">📖 הסיפור שלנו</h3>
              <blockquote className="text-gray-600 leading-relaxed border-r-4 border-amber-500 pr-4">
                {place.ownerStory}
              </blockquote>
            </div>
          )}

          {/* Tips */}
          {place.tips && (place.tips as string[]).length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
              <h3 className="text-amber-600 font-bold mb-3">💡 מה כדאי לדעת</h3>
              <ul className="space-y-2">
                {(place.tips as string[]).map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-amber-500 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {UI_TEXT.reviews} ({reviewList.length})
            </h2>

            {reviewList.length === 0 ? (
              <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-gray-200 mb-8">
                <span className="text-3xl block mb-2">📝</span>
                <p>אין ביקורות עדיין — היו הראשונים!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                {reviewList.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center border border-amber-200">
                          <span className="text-amber-600 font-bold">
                            {review.userName?.[0] || "?"}
                          </span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {review.userName || "אנונימי"}
                        </span>
                      </div>
                      <StarRating rating={review.ratingOverall} size={14} />
                    </div>
                    <p className="text-gray-600 mb-3">{review.text}</p>
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      <div className="text-center">
                        <span className="text-gray-400 block">
                          {RATING_LABELS.meat}
                        </span>
                        <span className="text-amber-500">
                          {review.ratingMeat} ★
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-400 block">
                          {RATING_LABELS.bread}
                        </span>
                        <span className="text-amber-500">
                          {review.ratingBread} ★
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-400 block">
                          {RATING_LABELS.sides}
                        </span>
                        <span className="text-amber-500">
                          {review.ratingSides} ★
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-400 block">
                          {RATING_LABELS.service}
                        </span>
                        <span className="text-amber-500">
                          {review.ratingService} ★
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-400 block">
                          {RATING_LABELS.value}
                        </span>
                        <span className="text-amber-500">
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
              placeId={place?.slug ?? ""}
              onSubmit={(review) => {
                // TODO: Connect to Convex mutation with auth
                console.log("New review:", review);
                alert("צריך להירשם כדי לכתוב ביקורת (בקרוב!)");
              }}
            />
          </section>
        </div>

        {/* ── Right column: sidebar ──────────────────────── */}
        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-20 lg:self-start">

          {/* Action Buttons */}
          <ActionButtons
            phone={place.phone}
            whatsapp={place.whatsapp}
            lat={place.lat}
            lng={place.lng}
            name={place.name}
          />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <span className="text-sm text-gray-400 block mb-1">כשרות</span>
              <span className="text-amber-600 font-bold">
                {KASHRUT_LABELS[place.kashrut]}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <span className="text-sm text-gray-400 block mb-1">מחיר</span>
              <span className="text-amber-600 font-bold text-lg">
                {PRICE_LABELS[place.priceRange]}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <span className="text-sm text-gray-400 block mb-1">סוג בשר</span>
              <span className="text-gray-900 text-sm">
                {place.meatTypes
                  .map((m: string) => MEAT_TYPE_LABELS[m] || m)
                  .join(", ")}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <span className="text-sm text-gray-400 block mb-1">סגנון</span>
              <span className="text-gray-900 text-sm">
                {place.style
                  .map((s: string) => STYLE_LABELS[s] || s)
                  .join(", ")}
              </span>
            </div>
          </div>

          {/* Tags (delivery, seating, phone) */}
          <div className="flex flex-wrap gap-2 mt-4">
            {place.hasDelivery && (
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Truck className="w-4 h-4" /> {UI_TEXT.delivery}
              </span>
            )}
            {place.hasSeating && (
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Armchair className="w-4 h-4" /> {UI_TEXT.seating}
              </span>
            )}
            {place.phone && (
              <a
                href={`tel:${place.phone}`}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 inline-flex items-center gap-1 border border-gray-200"
              >
                <Phone className="w-4 h-4" /> {place.phone}
              </a>
            )}
          </div>

          {/* Opening Hours */}
          {place.openingHours && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-4">
              <h3 className="text-sm text-gray-400 mb-2">{UI_TEXT.hours}</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(place.openingHours as Record<string, string>).map(
                  ([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-500">{day}</span>
                      <span className="text-gray-900">{hours}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Static Map */}
          <StaticMap
            lat={place.lat}
            lng={place.lng}
            name={place.name}
            className="mt-4"
          />
        </aside>
      </div>
    </div>
  );
}
