"use client";

import { useState } from "react";
import Map from "@/components/Map";
import PlaceCard from "@/components/PlaceCard";
import SearchBar from "@/components/SearchBar";
import Filters, { FilterState } from "@/components/Filters";
import { SITE_DESCRIPTION, SITE_TAGLINE, UI_TEXT } from "@/lib/constants";

// Static demo data until Convex is connected
// TODO: Replace with useQuery(api.places.listAll) and useQuery(api.places.filter)
import { DEMO_PLACES } from "@/lib/demoData";

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter places based on current filters and search
  const filteredPlaces = DEMO_PLACES.filter((place) => {
    if (searchTerm && !place.name.includes(searchTerm)) return false;
    if (filters.region && place.region !== filters.region) return false;
    if (filters.kashrut && place.kashrut !== filters.kashrut) return false;
    if (filters.meatType && !place.meatTypes.includes(filters.meatType))
      return false;
    if (filters.style && !place.style.includes(filters.style)) return false;
    if (filters.priceRange && place.priceRange !== filters.priceRange)
      return false;
    if (filters.minRating && place.avgRating < filters.minRating) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
          🥙 {SITE_DESCRIPTION}
        </h1>
        <p className="text-gray-400 text-lg mb-6">{SITE_TAGLINE}</p>
        <SearchBar onSearch={setSearchTerm} />
      </section>

      {/* Map */}
      <section className="mb-10">
        <Map
          places={filteredPlaces.map((p) => ({
            _id: p.slug,
            name: p.name,
            slug: p.slug,
            lat: p.lat,
            lng: p.lng,
            avgRating: p.avgRating,
            city: p.city,
          }))}
          onPlaceClick={(slug) => {
            window.location.href = `/place/${slug}`;
          }}
        />
      </section>

      {/* Filter toggle (mobile) */}
      <div className="md:hidden mb-4">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2 text-gray-300 text-sm"
        >
          {showFilters ? "הסתר סינונים" : `${UI_TEXT.filterBy} ⚙️`}
        </button>
      </div>

      {/* Content: Filters + Grid */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside
          className={`md:w-72 shrink-0 ${showFilters ? "block" : "hidden md:block"}`}
        >
          <Filters filters={filters} onFilterChange={setFilters} />
        </aside>

        {/* Places Grid */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {searchTerm ? `תוצאות: "${searchTerm}"` : UI_TEXT.allPlaces}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredPlaces.length} מקומות
            </span>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <span className="text-4xl block mb-3">🔍</span>
              <p>{UI_TEXT.noResults}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.slug} place={place as never} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
