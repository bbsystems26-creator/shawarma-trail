"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { redirect } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { Star, MapPin, Calendar, Edit2, Loader2 } from "lucide-react";
import Link from "next/link";
import ReviewerBadge from "@/components/ReviewerBadge";

export default function ProfilePage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.viewer);
  const reviews = useQuery(api.users.getUserReviews, {});

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    redirect("/login");
  }

  // Loading state
  if (authLoading || user === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const avatarUrl = user.avatar || user.image;
  const displayName = user.name || "משתמש";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-amber-400"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-3xl border-4 border-amber-400">
                  {initials}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {displayName}
              </h1>
              {user.email && (
                <p className="text-gray-500 mt-1" dir="ltr">
                  {user.email}
                </p>
              )}
              <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                <ReviewerBadge role={user.role} size="md" />
                <span className="text-gray-600 text-sm">
                  {user.reviewCount || 0} ביקורות
                </span>
              </div>
            </div>

            {/* Edit button */}
            <Link
              href="/profile/settings"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              עריכת פרופיל
            </Link>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">הביקורות שלי</h2>

          {reviews === undefined ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">עדיין לא כתבת ביקורות</p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full px-6 py-3 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                גלה מקומות
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-gray-100 rounded-xl p-4 hover:border-amber-200 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      {review.place && (
                        <Link
                          href={`/place/${review.place.slug}`}
                          className="font-bold text-gray-900 hover:text-amber-600"
                        >
                          {review.place.name}
                        </Link>
                      )}
                      {review.place?.city && (
                        <span className="text-gray-500 text-sm mr-2">
                          • {review.place.city}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-amber-700">
                        {review.ratingOverall.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {review.text}
                  </p>
                  {review.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {review.images.slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ))}
                      {review.images.length > 3 && (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                          +{review.images.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
