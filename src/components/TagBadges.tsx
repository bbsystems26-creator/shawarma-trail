"use client";

import { TAG_LABELS, TAG_COLORS } from "@/lib/constants";
import { TagIcon } from "./TagIcon";

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
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
            TAG_COLORS[tag] || "bg-zinc-700/50 text-zinc-300"
          }`}
        >
          <TagIcon tag={tag} className="w-3.5 h-3.5" />
          {TAG_LABELS[tag] || tag}
        </span>
      ))}
    </div>
  );
}
