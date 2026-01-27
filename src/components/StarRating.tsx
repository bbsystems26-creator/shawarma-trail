"use client";

import { useState } from "react";

interface StarRatingProps {
  /** Current rating value (0–5) */
  rating: number;
  /** Max number of stars */
  max?: number;
  /** Size of each star in pixels */
  size?: number;
  /** If true, user can click to change rating */
  interactive?: boolean;
  /** Callback when user selects a rating (interactive mode) */
  onChange?: (rating: number) => void;
  /** Additional CSS classes */
  className?: string;
}

export default function StarRating({
  rating,
  max = 5,
  size = 20,
  interactive = false,
  onChange,
  className = "",
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number>(0);

  const handleClick = (star: number) => {
    if (interactive && onChange) {
      onChange(star);
    }
  };

  const handleMouseEnter = (star: number) => {
    if (interactive) {
      setHovered(star);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHovered(0);
    }
  };

  const displayRating = hovered || rating;

  return (
    <div
      className={`flex gap-0.5 ${interactive ? "cursor-pointer" : ""} ${className}`}
      dir="ltr"
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const fillPercent = Math.min(
          100,
          Math.max(0, (displayRating - i) * 100)
        );

        return (
          <span
            key={i}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            className={`relative inline-block ${interactive ? "hover:scale-110 transition-transform" : ""}`}
            style={{ width: size, height: size }}
            role={interactive ? "button" : undefined}
            aria-label={interactive ? `${starIndex} כוכבים` : undefined}
          >
            {/* Empty star (background) */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="absolute inset-0 text-amber-800/30"
              style={{ width: size, height: size }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>

            {/* Filled star (foreground with clip) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-amber-400"
                style={{ width: size, height: size }}
              >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
          </span>
        );
      })}
    </div>
  );
}
