"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
// ⚠️ Run `npx convex dev` to generate this file
import { api } from "../../convex/_generated/api";

import Map from "@/components/Map";
import PlaceCard from "@/components/PlaceCard";
import type { PlaceData } from "@/components/PlaceCard";
import Filters, { EMPTY_FILTERS } from "@/components/Filters";
import type { FilterState } from "@/components/Filters";
import SearchBar from "@/components/SearchBar";
import { UI, SITE_NAME } from "@/lib/constants";

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Query places with filters
  const allPlaces = useQuery(api.places.filter, {
    region: (filters.region as "north" | "center" | "south" | "jerusalem" | "shfela") ?? undefined,
    kashrut: (filters.kashrut as "none" | "regular" | "mehadrin" | "badatz") ?? undefined,
    meatType: filters.meatType ?? undefined,
    style: filters.style ?? undefined,
    priceRange: (filters.priceRange as 1 | 2 | 3) ?? undefined,
  });

  // Featured places
  const featuredPlaces = useQuery(api.places.getFeatured);

  const places = (allPlaces ?? []) as PlaceData[];
  const featured = (featuredPlaces ?? []) as PlaceData[];

  const hasFilters = Object.values(filters).some((v) => v !== null);

  return (
    <div className="min-h-screen">
      {/* ==================== Header ==================== */}
      <header className="sticky top-0 z-40 bg-shawarma-950/90 backdrop-blur-md border-b border-shawarma-800/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-shawarma-400">
            🥙 {SITE_NAME}
          </h1>
          <nav className="hidden md:flex gap-6 text-sm text-shawarma-300">
            <a href="#map" className="hover:text-shawarma-100 transition-colors">
              מפה
            </a>
            <a href="#places" className="hover:text-shawarma-100 transition-colors">
              מקומות
            </a>
          </nav>
        </div>
      </header>

      {/* ==================== Hero Section ==================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-shawarma-900 via-shawarma-950 to-shawarma-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,93,37,0.15),transparent_70%)]" />

        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          <span className="text-6xl mb-4 block animate-fade-in">🥙</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-l from-amber-400 via-shawarma-400 to-ember-500 bg-clip-text text-transparent animate-fade-in">
            {UI.heroTitle}
          </h2>
          <p className="text-lg text-shawarma-300 mb-8 max-w-2xl mx-auto animate-fade-in">
            {UI.heroSubtitle}
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto animate-fade-in">
            <SearchBar />
          </div>

          {/* Quick stats */}
          <div className="flex justify-center gap-8 mt-8 text-sm text-shawarma-400 animate-fade-in">
            <div>
              <span className="text-2xl font-bold text-shawarma-200 block">
                {places.length || "—"}
              </span>
              מקומות
            </div>
            <div>
              <span className="text-2xl font-bold text-shawarma-200 block">
                5
              </span>
              אזורים
            </div>
            <div>
              <span className="text-2xl font-bold text-shawarma-200 block">
                ⭐
              </span>
              דירוגי קהילה
            </div>
          </div>
        </div>
      </section>

      {/* ==================== Main Content ==================== */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Section (only when no filters active) */}
        {!hasFilters && featured.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-shawarma-100 mb-6">
              ⭐ מקומות מומלצים
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 3).map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          </section>
        )}

        {/* Map + Filters + Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <Filters
              filters={filters}
              onFilterChange={setFilters}
            />
          </aside>

          {/* Content Area */}
          <div className="flex-1 space-y-8">
            {/* View Toggle + Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-shawarma-400">
                {places.length > 0
                  ? `נמצאו ${places.length} מקומות`
                  : allPlaces === undefined
                    ? UI.loading
                    : UI.noResults}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    viewMode === "grid"
                      ? "bg-shawarma-700 text-shawarma-100"
                      : "text-shawarma-500 hover:text-shawarma-300"
                  }`}
                >
                  ▦ רשת
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    viewMode === "map"
                      ? "bg-shawarma-700 text-shawarma-100"
                      : "text-shawarma-500 hover:text-shawarma-300"
                  }`}
                >
                  🗺️ מפה
                </button>
              </div>
            </div>

            {/* Map Section */}
            <section id="map" className={viewMode === "map" ? "block" : "hidden lg:block"}>
              <Map
                places={places}
                className="h-[400px] lg:h-[500px]"
                onPlaceClick={(place) => {
                  window.location.href = `/place/${place.slug}`;
                }}
              />
            </section>

            {/* Places Grid */}
            <section id="places" className={viewMode === "grid" ? "block" : "hidden lg:block"}>
              {places.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {places.map((place) => (
                    <PlaceCard key={place._id} place={place} />
                  ))}
                </div>
              ) : allPlaces !== undefined ? (
                <div className="text-center py-16">
                  <span className="text-5xl block mb-4">🔍</span>
                  <p className="text-xl text-shawarma-400">{UI.noResults}</p>
                  <p className="text-sm text-shawarma-600 mt-2">
                    נסו לשנות את הפילטרים או לחפש משהו אחר
                  </p>
                </div>
              ) : (
                /* Loading skeleton */
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-shawarma-900/50 border border-shawarma-800/30 animate-pulse"
                    >
                      <div className="h-48 bg-shawarma-800/50 rounded-t-xl" />
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-shawarma-800/50 rounded w-3/4" />
                        <div className="h-4 bg-shawarma-800/50 rounded w-1/2" />
                        <div className="h-4 bg-shawarma-800/50 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* ==================== Footer ==================== */}
      <footer className="bg-shawarma-950 border-t border-shawarma-800/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-shawarma-600">
            🥙 {SITE_NAME} — כל הזכויות שמורות © {new Date().getFullYear()}
          </p>
          <p className="text-xs text-shawarma-700 mt-2">
            &quot;כל מהפכה מתחילה בארוחה טובה&quot;
          </p>
        </div>
      </footer>
    </div>
  );
}
