"use client";

import { Shield, Star, Crown, UserCheck, User } from "lucide-react";

// Role types
export type UserRole = "visitor" | "applicant" | "reviewer" | "senior_reviewer" | "admin";

// Role labels in Hebrew
export const ROLE_LABELS: Record<UserRole, string> = {
  visitor: "אורח",
  applicant: "מועמד",
  reviewer: "מבקר",
  senior_reviewer: "מבקר בכיר",
  admin: "מנהל",
};

// Role configuration
const ROLE_CONFIG: Record<
  UserRole,
  {
    icon: typeof Shield;
    bgColor: string;
    textColor: string;
    borderColor: string;
    iconColor: string;
  }
> = {
  visitor: {
    icon: User,
    bgColor: "bg-gray-50",
    textColor: "text-gray-600",
    borderColor: "border-gray-200",
    iconColor: "text-gray-400",
  },
  applicant: {
    icon: UserCheck,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
  },
  reviewer: {
    icon: Star,
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-300",
    iconColor: "text-amber-500",
  },
  senior_reviewer: {
    icon: Crown,
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-300",
    iconColor: "text-purple-500",
  },
  admin: {
    icon: Shield,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-300",
    iconColor: "text-red-500",
  },
};

interface ReviewerBadgeProps {
  role: UserRole | string | undefined | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function ReviewerBadge({
  role,
  size = "md",
  showLabel = true,
  className = "",
}: ReviewerBadgeProps) {
  // Default to visitor if no role
  const safeRole = (role as UserRole) || "visitor";
  const config = ROLE_CONFIG[safeRole] || ROLE_CONFIG.visitor;
  const Icon = config.icon;
  const label = ROLE_LABELS[safeRole] || ROLE_LABELS.visitor;

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

// Helper to check if a role can write reviews
export function canWriteReviews(role: UserRole | string | undefined | null): boolean {
  const reviewerRoles: UserRole[] = ["reviewer", "senior_reviewer", "admin"];
  return reviewerRoles.includes(role as UserRole);
}

// Helper to check if a role is admin
export function isAdmin(role: UserRole | string | undefined | null): boolean {
  return role === "admin";
}
