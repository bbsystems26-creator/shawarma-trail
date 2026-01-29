"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useConvexAuth } from "convex/react";
import ReviewForm, { ReviewData } from "./ReviewForm";
import ReviewerBadge, { canWriteReviews } from "./ReviewerBadge";
import { Loader2, Lock, UserPlus } from "lucide-react";
import Link from "next/link";

interface ReviewFormGatedProps {
  placeId: string;
  onSubmit?: (review: ReviewData) => void;
  className?: string;
}

export default function ReviewFormGated({
  placeId,
  onSubmit,
  className = "",
}: ReviewFormGatedProps) {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.viewer);

  // Loading state
  if (authLoading || (isAuthenticated && user === undefined)) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  // Not authenticated - prompt to login
  if (!isAuthenticated) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 text-center ${className}`}>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          רוצים לכתוב ביקורת?
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          התחברו כדי לכתוב ביקורות ולהצטרף לקהילה
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl px-6 py-3 transition-colors"
        >
          התחברות
        </Link>
      </div>
    );
  }

  // Check if user can write reviews
  if (!canWriteReviews(user?.role)) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 text-center ${className}`}>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          הצטרפו לנבחרת המבקרים!
        </h3>
        <p className="text-gray-500 text-sm mb-3">
          רק מבקרים מאושרים יכולים לכתוב ביקורות.
          <br />
          הגישו מועמדות והפכו לחלק מהקהילה!
        </p>
        {user?.role && (
          <div className="flex justify-center mb-4">
            <span className="text-xs text-gray-400">הסטטוס הנוכחי שלכם: </span>
            <ReviewerBadge role={user.role} size="sm" className="mr-2" />
          </div>
        )}
        <Link
          href="/join-squad"
          className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl px-6 py-3 transition-colors"
        >
          הצטרפו לנבחרת
        </Link>
      </div>
    );
  }

  // User can write reviews - show the form
  return <ReviewForm placeId={placeId} onSubmit={onSubmit} className={className} />;
}
