"use client";

import { Medal, Award, Gem, Crown, Star, Sparkles } from "lucide-react";

export type BadgeLevel = "none" | "bronze" | "silver" | "gold" | "platinum" | "diamond";

// Badge labels in Hebrew
export const BADGE_LABELS: Record<BadgeLevel, string> = {
  none: "",
  bronze: "ברונזה",
  silver: "כסף",
  gold: "זהב",
  platinum: "פלטינום",
  diamond: "יהלום",
};

// Badge configuration
const BADGE_CONFIG: Record<
  BadgeLevel,
  {
    icon: typeof Medal;
    bgColor: string;
    textColor: string;
    borderColor: string;
    iconColor: string;
    gradient?: string;
  }
> = {
  none: {
    icon: Star,
    bgColor: "bg-gray-50",
    textColor: "text-gray-400",
    borderColor: "border-gray-200",
    iconColor: "text-gray-300",
  },
  bronze: {
    icon: Medal,
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-300",
    iconColor: "text-amber-600",
  },
  silver: {
    icon: Award,
    bgColor: "bg-slate-50",
    textColor: "text-slate-600",
    borderColor: "border-slate-300",
    iconColor: "text-slate-500",
  },
  gold: {
    icon: Crown,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-400",
    iconColor: "text-yellow-500",
    gradient: "bg-gradient-to-r from-yellow-400 to-amber-500",
  },
  platinum: {
    icon: Gem,
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-400",
    iconColor: "text-cyan-500",
    gradient: "bg-gradient-to-r from-cyan-400 to-teal-500",
  },
  diamond: {
    icon: Sparkles,
    bgColor: "bg-violet-50",
    textColor: "text-violet-700",
    borderColor: "border-violet-400",
    iconColor: "text-violet-500",
    gradient: "bg-gradient-to-r from-violet-400 to-purple-500",
  },
};

interface LeaderboardBadgeProps {
  badge: BadgeLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function LeaderboardBadge({
  badge,
  size = "md",
  showLabel = true,
  className = "",
}: LeaderboardBadgeProps) {
  if (badge === "none") return null;

  const config = BADGE_CONFIG[badge];
  const Icon = config.icon;
  const label = BADGE_LABELS[badge];

  // Size classes
  const sizeClasses = {
    sm: {
      container: "px-2 py-0.5 text-xs gap-1",
      icon: "w-3 h-3",
    },
    md: {
      container: "px-3 py-1 text-sm gap-1.5",
      icon: "w-4 h-4",
    },
    lg: {
      container: "px-4 py-1.5 text-base gap-2",
      icon: "w-5 h-5",
    },
  };

  const sizeClass = sizeClasses[size];

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizeClass.container}
        ${className}
      `}
      dir="rtl"
    >
      <Icon className={`${sizeClass.icon} ${config.iconColor}`} />
      {showLabel && <span>{label}</span>}
    </span>
  );
}

// Rank badge for top 3 positions
export function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) return null;

  const rankConfig = {
    1: {
      emoji: "🥇",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-300",
    },
    2: {
      emoji: "🥈",
      bgColor: "bg-slate-100",
      textColor: "text-slate-700",
      borderColor: "border-slate-300",
    },
    3: {
      emoji: "🥉",
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      borderColor: "border-amber-300",
    },
  };

  const config = rankConfig[rank as 1 | 2 | 3];

  return (
    <span
      className={`
        inline-flex items-center justify-center w-8 h-8 rounded-full border-2
        ${config.bgColor} ${config.borderColor} text-lg
      `}
    >
      {config.emoji}
    </span>
  );
}
