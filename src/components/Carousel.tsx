"use client";

import Link from "next/link";
import { useRef, useState, useEffect, type ReactNode } from "react";

interface CarouselProps {
  title: ReactNode;
  children: ReactNode;
  showAllHref?: string;
}

export default function Carousel({ title, children, showAllHref = "/explore" }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    // RTL: scrollLeft is negative in RTL layouts
    const sl = Math.abs(el.scrollLeft);
    setCanScrollLeft(sl > 4);
    setCanScrollRight(sl + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    // In RTL, "right" visually means scrolling to negative scrollLeft
    el.scrollBy({
      left: direction === "right" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
          <Link
            href={showAllHref}
            className="text-sm md:text-base text-amber-600 hover:text-amber-700 transition-colors hidden sm:inline-flex items-center gap-1"
          >
            הצג הכל ←
          </Link>
        </div>

        {/* Arrow buttons — desktop */}
        <div className="hidden md:flex gap-2">
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="הבא"
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default transition-colors text-lg md:text-xl border border-gray-200"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="הקודם"
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default transition-colors text-lg md:text-xl border border-gray-200"
          >
            ›
          </button>
        </div>
      </div>

      {/* Scrollable container */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {children}
        </div>
      </div>

      {/* Mobile show all link */}
      <div className="sm:hidden text-center mt-2">
        <Link
          href={showAllHref}
          className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
        >
          הצג הכל ←
        </Link>
      </div>
    </section>
  );
}
