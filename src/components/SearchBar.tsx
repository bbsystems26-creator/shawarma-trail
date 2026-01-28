"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
// ⚠️ Run `npx convex dev` to generate this file
import { api } from "../../convex/_generated/api";
import { UI } from "@/lib/constants";
import type { PlaceData } from "./PlaceCard";
import Link from "next/link";
import StarRating from "./StarRating";

interface SearchBarProps {
  className?: string;
  onSearch?: (term: string) => void;
}

export default function SearchBar({ className = "", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Convex search query — only fires when debounced query is non-empty
  const results = useQuery(
    api.places.search,
    debouncedQuery.length >= 2 ? { searchTerm: debouncedQuery } : "skip"
  );

  const handleFocus = () => setIsOpen(true);

  const handleBlur = useCallback(() => {
    // Delay to allow click on results
    setTimeout(() => setIsOpen(false), 200);
  }, []);

  const handleSelect = () => {
    setQuery("");
    setDebouncedQuery("");
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={UI.heroSearch}
          className="w-full py-3 px-5 pr-12 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all text-sm"
          dir="rtl"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && debouncedQuery.length >= 2 && (
        <div className="absolute z-50 top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {results === undefined ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              {UI.loading}
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              {UI.noResults}
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {(results as PlaceData[]).map((place) => (
                <Link
                  key={place._id}
                  href={`/place/${place.slug}`}
                  onClick={handleSelect}
                  className="block p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {place.name}
                      </p>
                      <p className="text-xs text-gray-500">{place.city}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <StarRating rating={place.avgRating} size={12} />
                      <span className="text-xs text-amber-500 font-medium">
                        {place.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
