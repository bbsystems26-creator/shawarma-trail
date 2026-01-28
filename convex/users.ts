import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

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
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const updates: Record<string, string | undefined> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.avatar !== undefined) updates.avatar = args.avatar;

    await ctx.db.patch(userId, updates);
    return await ctx.db.get(userId);
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
