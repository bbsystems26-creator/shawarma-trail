/**
 * Auth utilities for role-based access control
 * Reviewers Squad system roles
 */

// Role type definition
export type UserRole = "visitor" | "applicant" | "reviewer" | "senior_reviewer" | "admin";

// Role constants
export const USER_ROLES = {
  VISITOR: "visitor" as const,
  APPLICANT: "applicant" as const,
  REVIEWER: "reviewer" as const,
  SENIOR_REVIEWER: "senior_reviewer" as const,
  ADMIN: "admin" as const,
};

// Roles that can write reviews
export const REVIEWER_ROLES: UserRole[] = ["reviewer", "senior_reviewer", "admin"];

// Roles that can moderate content
export const MODERATOR_ROLES: UserRole[] = ["senior_reviewer", "admin"];

// Check if user can write reviews
export function canWriteReview(role: string | undefined | null): boolean {
  if (!role) return false;
  return REVIEWER_ROLES.includes(role as UserRole);
}

// Check if user is a reviewer (any level)
export function isReviewer(role: string | undefined | null): boolean {
  if (!role) return false;
  return role === "reviewer" || role === "senior_reviewer";
}

// Check if user is a senior reviewer
export function isSeniorReviewer(role: string | undefined | null): boolean {
  return role === "senior_reviewer";
}

// Check if user is admin
export function isAdmin(role: string | undefined | null): boolean {
  return role === "admin";
}

// Check if user can moderate (senior reviewer or admin)
export function canModerate(role: string | undefined | null): boolean {
  if (!role) return false;
  return MODERATOR_ROLES.includes(role as UserRole);
}

// Check if user can apply to become reviewer
export function canApplyForReviewer(role: string | undefined | null): boolean {
  // Only visitors can apply (not already reviewer/applicant)
  return role === "visitor" || !role;
}

// Check if user has pending application
export function hasApplicationPending(role: string | undefined | null): boolean {
  return role === "applicant";
}

// Role display labels (Hebrew)
export const ROLE_LABELS: Record<UserRole, string> = {
  visitor: "גולש",
  applicant: "מועמד",
  reviewer: "מבקר מאושר",
  senior_reviewer: "מבקר בכיר",
  admin: "מנהל",
};

// Get role label
export function getRoleLabel(role: string | undefined | null): string {
  if (!role) return ROLE_LABELS.visitor;
  return ROLE_LABELS[role as UserRole] || ROLE_LABELS.visitor;
}

// Role badge colors for UI
export const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  visitor: "bg-gray-100 text-gray-700",
  applicant: "bg-blue-100 text-blue-700",
  reviewer: "bg-green-100 text-green-700",
  senior_reviewer: "bg-amber-100 text-amber-700",
  admin: "bg-red-100 text-red-700",
};

// Get role badge color classes
export function getRoleBadgeColor(role: string | undefined | null): string {
  if (!role) return ROLE_BADGE_COLORS.visitor;
  return ROLE_BADGE_COLORS[role as UserRole] || ROLE_BADGE_COLORS.visitor;
}
