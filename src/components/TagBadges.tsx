"use client";

import { TAG_LABELS, TAG_COLORS } from "@/lib/constants";

interface TagBadgesProps {
  tags: string[];
  className?: string;
}

export default function TagBadges({ tags, className = "" }: TagBadgesProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} dir="rtl">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            TAG_COLORS[tag] || "bg-zinc-700/50 text-zinc-300"
          }`}
        >
          {TAG_LABELS[tag] || tag}
        </span>
      ))}
    </div>
  );
}
