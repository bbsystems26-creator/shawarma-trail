"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PlaceCard from "@/components/PlaceCard";
import type { PlaceData } from "@/components/PlaceCard";
import Filters, { EMPTY_FILTERS, type FilterState } from "@/components/Filters";
import { Map } from "lucide-react";

/* ── Sort options ─────────────────────────────────────────────── */
type SortKey = "recommended" | "newest" | "topRated";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "מומלצים" },
  { value: "newest", label: "חדשים" },
  { value: "topRated", label: "דירוג גבוה" },
];

const PAGE_SIZE = 20;

/* ── Page component ───────────────────────────────────────────── */
export default function ExplorePage() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Build query args from filter state
  const queryArgs = useMemo(() => {
    const args: Record<string, unknown> = {};
    if (filters.region) args.region = filters.region;
    if (filters.kashrut) args.kashrut = filters.kashrut;
    if (filters.meatType) args.meatType = filters.meatType;
    if (filters.style) args.style = filters.style;
    if (filters.priceRange) args.priceRange = filters.priceRange;
    if (filters.minRating) args.minRating = filters.minRating;
    return args;
  }, [filters]);

  const rawPlaces = useQuery(api.places.filter, queryArgs);

  // Sort client-side
  const sortedPlaces = useMemo(() => {
    if (!rawPlaces) return [];
    const places = [...rawPlaces];

    switch (sortKey) {
      case "recommended":
        // Featured first, then by review count * rating
        return places.sort((a, b) => {
          if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
          return b.avgRating * b.reviewCount - a.avgRating * a.reviewCount;
        });
      case "newest":
        return places.sort(
          (a, b) =>
            (b._creationTime ?? 0) - (a._creationTime ?? 0)
        );
      case "topRated":
        return places.sort((a, b) => b.avgRating - a.avgRating);
      default:
        return places;
    }
  }, [rawPlaces, sortKey]);

  // Pagination
  const visiblePlaces = sortedPlaces.slice(0, visibleCount);
  const hasMore = visibleCount < sortedPlaces.length;

  const handleFilterChange = (next: FilterState) => {
    setFilters(next);
    setVisibleCount(PAGE_SIZE); // reset pagination on filter change
  };

  const isLoading = rawPlaces === undefined;

  return (
    <main className="min-h-screen bg-shawarma-950">
      {/* ── Header ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-shawarma-900 to-shawarma-950 border-b border-shawarma-800/40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-shawarma-50 inline-flex items-center gap-2">
            <Map className="w-8 h-8 inline" /> גלה מקומות
          </h1>
          <p className="mt-2 text-shawarma-400 text-sm md:text-base max-w-xl mx-auto">
            כל מקומות השווארמה במקום אחד — סננו, מיינו ומצאו את הפיתה המושלמת
          </p>
        </div>
      </section>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar: filters */}
          <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-20 lg:self-start">
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar: sort + count */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <p className="text-sm text-shawarma-400">
                {isLoading
                  ? "טוען..."
                  : `${sortedPlaces.length} מקומות נמצאו`}
              </p>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-select"
                  className="text-xs text-shawarma-500"
                >
                  מיון:
                </label>
                <select
                  id="sort-select"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="bg-shawarma-900 border border-shawarma-700 text-shawarma-200 text-sm rounded-lg px-3 py-2 focus:ring-shawarma-500 focus:border-shawarma-500 outline-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Place grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 rounded-xl bg-shawarma-900/60 animate-pulse"
                  />
                ))}
              </div>
            ) : sortedPlaces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-5xl mb-4">🔍</span>
                <p className="text-shawarma-300 text-lg font-semibold">
                  לא נמצאו מקומות
                </p>
                <p className="text-shawarma-500 text-sm mt-1">
                  נסו לשנות את הפילטרים או לחפש משהו אחר
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {visiblePlaces.map((place) => (
                    <PlaceCard
                      key={place._id}
                      place={place as unknown as PlaceData}
                    />
                  ))}
                </div>

                {/* Show more */}
                {hasMore && (
                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={() =>
                        setVisibleCount((c) => c + PAGE_SIZE)
                      }
                      className="px-8 py-3 bg-shawarma-800 hover:bg-shawarma-700 text-shawarma-200 font-medium rounded-xl transition-colors border border-shawarma-700/50 hover:border-shawarma-600"
                    >
                      הצג עוד ({sortedPlaces.length - visibleCount} נותרו)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
