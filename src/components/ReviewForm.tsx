"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import { RATING_CATEGORIES, UI } from "@/lib/constants";
import { CheckCircle } from "lucide-react";

interface ReviewFormProps {
  placeId: string;
  onSubmit?: (review: ReviewData) => void;
  className?: string;
}

export interface ReviewData {
  placeId: string;
  ratingOverall: number;
  ratingMeat: number;
  ratingBread: number;
  ratingSides: number;
  ratingService: number;
  ratingValue: number;
  text: string;
}

export default function ReviewForm({
  placeId,
  onSubmit,
  className = "",
}: ReviewFormProps) {
  const [ratings, setRatings] = useState({
    ratingMeat: 0,
    ratingBread: 0,
    ratingSides: 0,
    ratingService: 0,
    ratingValue: 0,
  });
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const overallRating =
    Object.values(ratings).reduce((sum, r) => sum + r, 0) /
    Object.values(ratings).filter((r) => r > 0).length || 0;

  const canSubmit =
    Object.values(ratings).every((r) => r > 0) && text.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    const review: ReviewData = {
      placeId,
      ratingOverall: Math.round(overallRating * 10) / 10,
      ...ratings,
      text: text.trim(),
    };

    try {
      onSubmit?.(review);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`bg-white rounded-xl border border-green-200 p-8 text-center shadow-sm ${className}`}>
        <div className="flex justify-center mb-3"><CheckCircle className="w-10 h-10 text-green-500" /></div>
        <p className="text-green-700 font-semibold text-lg">
          תודה על הביקורת!
        </p>
        <p className="text-gray-500 text-sm mt-1">
          הביקורת שלכם נשמרה בהצלחה
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm ${className}`}
    >
      <h3 className="text-xl font-bold text-gray-900">
        {UI.reviewFormTitle}
      </h3>

      {/* Sub-ratings */}
      <div className="space-y-4">
        {(
          Object.entries(RATING_CATEGORIES) as [
            keyof typeof ratings,
            string,
          ][]
        ).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-gray-600 min-w-[120px]">
              {label}
            </span>
            <StarRating
              rating={ratings[key]}
              interactive
              onChange={(val) =>
                setRatings((prev) => ({ ...prev, [key]: val }))
              }
              size={24}
            />
          </div>
        ))}
      </div>

      {/* Overall rating display */}
      {overallRating > 0 && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
          <span className="text-sm text-gray-500">{UI.ratingOverall}:</span>
          <StarRating rating={overallRating} size={20} />
          <span className="text-amber-600 font-bold">
            {overallRating.toFixed(1)}
          </span>
        </div>
      )}

      {/* Text review */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={UI.reviewPlaceholder}
        rows={4}
        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 resize-none text-sm"
        dir="rtl"
      />

      {/* Submit button */}
      <button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-all text-sm disabled:cursor-not-allowed"
      >
        {isSubmitting ? UI.loading : UI.submitReview}
      </button>
    </form>
  );
}
