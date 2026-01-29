import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// Role definitions for Reviewers Squad
export const USER_ROLES = {
  VISITOR: "visitor",
  APPLICANT: "applicant",
  REVIEWER: "reviewer",
  SENIOR_REVIEWER: "senior_reviewer",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Roles that can write reviews
export const REVIEWER_ROLES: UserRole[] = ["reviewer", "senior_reviewer", "admin"];

// Get the currently authenticated user
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

// Get user by ID
export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    bio: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const updates: Record<string, string | number | undefined> = {
      updatedAt: Date.now(),
    };
    if (args.name !== undefined) updates.name = args.name;
    if (args.avatar !== undefined) updates.avatar = args.avatar;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.city !== undefined) updates.city = args.city;

    await ctx.db.patch(userId, updates);
    return await ctx.db.get(userId);
  },
});

// Get all approved reviewers (for /squad page)
export const getReviewers = query({
  args: {},
  handler: async (ctx) => {
    const reviewers = await ctx.db
      .query("users")
      .withIndex("by_role")
      .filter((q) =>
        q.or(
          q.eq(q.field("role"), "reviewer"),
          q.eq(q.field("role"), "senior_reviewer")
        )
      )
      .collect();

    // Sort by review count descending
    return reviewers.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  },
});

// Set user role (admin only)
export const setUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("visitor"),
      v.literal("applicant"),
      v.literal("reviewer"),
      v.literal("senior_reviewer"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, args) => {
    const adminId = await auth.getUserId(ctx);
    if (adminId === null) {
      throw new Error("Not authenticated");
    }

    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    await ctx.db.patch(args.userId, {
      role: args.role,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.userId);
  },
});

// Check if current user can write reviews
export const canWriteReview = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) return false;

    const user = await ctx.db.get(userId);
    if (!user) return false;

    return REVIEWER_ROLES.includes(user.role as UserRole);
  },
});

// Get user's reviews
export const getUserReviews = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    // If userId provided, get that user's reviews
    // Otherwise get current user's reviews
    let targetUserId = args.userId;
    
    if (!targetUserId) {
      const currentUserId = await auth.getUserId(ctx);
      if (!currentUserId) {
        return [];
      }
      targetUserId = currentUserId;
    }

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", targetUserId))
      .collect();

    // Get place info for each review
    const reviewsWithPlaces = await Promise.all(
      reviews.map(async (review) => {
        const place = await ctx.db.get(review.placeId);
        return {
          ...review,
          place: place ? { name: place.name, slug: place.slug, city: place.city } : null,
        };
      })
    );

    return reviewsWithPlaces;
  },
});
