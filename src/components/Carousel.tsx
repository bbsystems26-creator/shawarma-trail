"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface CarouselProps {
  title: ReactNode;
  children: ReactNode;
}

export default function Carousel({ title, children }: CarouselProps) {
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
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>

        {/* Arrow buttons — desktop */}
        <div className="hidden md:flex gap-2">
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="הבא"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-shawarma-800/70 text-shawarma-200 hover:bg-shawarma-700 disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="הקודם"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-shawarma-800/70 text-shawarma-200 hover:bg-shawarma-700 disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </section>
  );
}
