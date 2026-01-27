"use client";

import { useState } from "react";
import {
  UI,
  KASHRUT_OPTIONS,
  MEAT_TYPE_OPTIONS,
  STYLE_OPTIONS,
  PRICE_RANGE_OPTIONS,
  REGION_OPTIONS,
} from "@/lib/constants";

export interface FilterState {
  kashrut: string | null;
  meatType: string | null;
  style: string | null;
  priceRange: number | null;
  region: string | null;
  minRating: number | null;
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export const EMPTY_FILTERS: FilterState = {
  kashrut: null,
  meatType: null,
  style: null,
  priceRange: null,
  region: null,
  minRating: null,
};

export default function Filters({
  filters,
  onFilterChange,
  className = "",
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string | number | null) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== null);

  const clearFilters = () => {
    onFilterChange(EMPTY_FILTERS);
  };

  const filterContent = (
    <div className="space-y-5">
      {/* Region */}
      <FilterSection title={UI.filterRegion}>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label={UI.filterAll}
            active={filters.region === null}
            onClick={() => updateFilter("region", null)}
          />
          {REGION_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={filters.region === opt.value}
              onClick={() =>
                updateFilter(
                  "region",
                  filters.region === opt.value ? null : opt.value
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Kashrut */}
      <FilterSection title={UI.filterKashrut}>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label={UI.filterAll}
            active={filters.kashrut === null}
            onClick={() => updateFilter("kashrut", null)}
          />
          {KASHRUT_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={filters.kashrut === opt.value}
              onClick={() =>
                updateFilter(
                  "kashrut",
                  filters.kashrut === opt.value ? null : opt.value
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Meat Type */}
      <FilterSection title={UI.filterMeatType}>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label={UI.filterAll}
            active={filters.meatType === null}
            onClick={() => updateFilter("meatType", null)}
          />
          {MEAT_TYPE_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={filters.meatType === opt.value}
              onClick={() =>
                updateFilter(
                  "meatType",
                  filters.meatType === opt.value ? null : opt.value
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Style */}
      <FilterSection title={UI.filterStyle}>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label={UI.filterAll}
            active={filters.style === null}
            onClick={() => updateFilter("style", null)}
          />
          {STYLE_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={filters.style === opt.value}
              onClick={() =>
                updateFilter(
                  "style",
                  filters.style === opt.value ? null : opt.value
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title={UI.filterPriceRange}>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label={UI.filterAll}
            active={filters.priceRange === null}
            onClick={() => updateFilter("priceRange", null)}
          />
          {PRICE_RANGE_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={filters.priceRange === opt.value}
              onClick={() =>
                updateFilter(
                  "priceRange",
                  filters.priceRange === opt.value ? null : opt.value
                )
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 px-4 text-sm font-medium text-shawarma-400 bg-shawarma-800/50 hover:bg-shawarma-800 rounded-lg transition-colors"
        >
          ✕ {UI.clearFilters}
        </button>
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full mb-4 py-3 px-4 bg-shawarma-800 rounded-xl text-shawarma-200 font-medium flex items-center justify-between"
      >
        <span>🔍 {UI.filtersTitle}</span>
        <span className="text-xl">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Desktop: always show. Mobile: toggle */}
      <div
        className={`bg-shawarma-900/80 rounded-xl border border-shawarma-800/50 p-5 ${
          isOpen ? "block" : "hidden lg:block"
        }`}
      >
        <h3 className="text-lg font-bold text-shawarma-100 mb-4">
          {UI.filtersTitle}
        </h3>
        {filterContent}
      </div>
    </div>
  );
}

// Sub-components
function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-shawarma-300 mb-2">{title}</h4>
      {children}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
        active
          ? "bg-shawarma-500 text-white shadow-md shadow-shawarma-500/30"
          : "bg-shawarma-800/80 text-shawarma-400 hover:bg-shawarma-700 hover:text-shawarma-200"
      }`}
    >
      {label}
    </button>
  );
}
