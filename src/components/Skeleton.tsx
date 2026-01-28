"use client";

export function PlaceCardSkeleton() {
  return (
    <div className="snap-start shrink-0 w-[280px] sm:w-[300px]">
      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm animate-pulse">
        {/* Image placeholder */}
        <div className="h-[180px] bg-gray-200" />
        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          {/* Location */}
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          {/* Rating stars */}
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded-full" />
            ))}
          </div>
          {/* Tags */}
          <div className="flex gap-2 pt-1">
            <div className="h-6 bg-gray-100 rounded-full w-16" />
            <div className="h-6 bg-gray-100 rounded-full w-20" />
            <div className="h-6 bg-gray-100 rounded-full w-14" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CarouselSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-12">
      {/* Title skeleton */}
      <div className="h-7 bg-gray-200 rounded w-40 mb-5 animate-pulse" />
      {/* Cards row */}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <PlaceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
