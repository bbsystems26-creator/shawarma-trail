import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { REVIEWER_ROLES, UserRole } from "./users";

export const getByPlace = query({
  args: { placeId: v.id("places") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_place", (q) => q.eq("placeId", args.placeId))
      .collect();

    // Enrich with user data including role for badge display
    const enriched = await Promise.all(
      reviews.map(async (review) => {
        const user = await ctx.db.get(review.userId);
        return {
          ...review,
          userName: user?.name ?? "אנונימי",
          userRole: user?.role ?? "visitor",
          userAvatar: user?.avatar ?? user?.image,
        };
      })
    );

    return enriched;
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const enriched = await Promise.all(
      reviews.map(async (review) => {
        const place = await ctx.db.get(review.placeId);
        return { ...review, placeName: place?.name ?? "מקום לא ידוע" };
      })
    );

    return enriched;
  },
});

export const create = mutation({
  args: {
    placeId: v.id("places"),
    ratingOverall: v.number(),
    ratingMeat: v.number(),
    ratingBread: v.number(),
    ratingSides: v.number(),
    ratingService: v.number(),
    ratingValue: v.number(),
    text: v.string(),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Check authentication
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("יש להתחבר כדי לכתוב ביקורת");
    }

    // Check permission - only approved reviewers can write reviews
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("משתמש לא נמצא");
    }

    if (!REVIEWER_ROLES.includes(user.role as UserRole)) {
      throw new Error("רק מבקרים מאושרים יכולים לכתוב ביקורות. הצטרפו לנבחרת המבקרים!");
    }

    // Insert the review
    const reviewId = await ctx.db.insert("reviews", {
      placeId: args.placeId,
      userId,
      ratingOverall: args.ratingOverall,
      ratingMeat: args.ratingMeat,
      ratingBread: args.ratingBread,
      ratingSides: args.ratingSides,
      ratingService: args.ratingService,
      ratingValue: args.ratingValue,
      text: args.text,
      images: args.images,
      helpfulCount: 0,
      isVerifiedVisit: false,
    });

    // Update place average rating
    const place = await ctx.db.get(args.placeId);
    if (place) {
      const allReviews = await ctx.db
        .query("reviews")
        .withIndex("by_place", (q) => q.eq("placeId", args.placeId))
        .collect();

      const totalRating = allReviews.reduce(
        (sum, r) => sum + r.ratingOverall,
        0
      );
      const newAvg = totalRating / allReviews.length;

      await ctx.db.patch(args.placeId, {
        avgRating: Math.round(newAvg * 10) / 10,
        reviewCount: allReviews.length,
      });
    }

    // Update user review count
    await ctx.db.patch(userId, {
      reviewCount: (user.reviewCount || 0) + 1,
      updatedAt: Date.now(),
    });

    return reviewId;
  },
});

export const markHelpful = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.reviewId);
    if (review) {
      await ctx.db.patch(args.reviewId, {
        helpfulCount: review.helpfulCount + 1,
      });
    }
  },
});

// Delete a review - only owner or admin/senior_reviewer can delete
export const deleteReview = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("יש להתחבר כדי למחוק ביקורת");
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new Error("ביקורת לא נמצאה");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("משתמש לא נמצא");
    }

    // Check permission: owner OR senior_reviewer/admin can delete
    const isOwner = review.userId === userId;
    const canModerateReviews = user.role === "senior_reviewer" || user.role === "admin";

    if (!isOwner && !canModerateReviews) {
      throw new Error("אין לך הרשאה למחוק ביקורת זו");
    }

    // Delete the review
    await ctx.db.delete(args.reviewId);

    // Update place rating
    const place = await ctx.db.get(review.placeId);
    if (place) {
      const remainingReviews = await ctx.db
        .query("reviews")
        .withIndex("by_place", (q) => q.eq("placeId", review.placeId))
        .collect();

      if (remainingReviews.length > 0) {
        const totalRating = remainingReviews.reduce((sum, r) => sum + r.ratingOverall, 0);
        const newAvg = totalRating / remainingReviews.length;
        await ctx.db.patch(review.placeId, {
          avgRating: Math.round(newAvg * 10) / 10,
          reviewCount: remainingReviews.length,
        });
      } else {
        await ctx.db.patch(review.placeId, {
          avgRating: 0,
          reviewCount: 0,
        });
      }
    }

    // Update review author's count
    const reviewAuthor = await ctx.db.get(review.userId);
    if (reviewAuthor) {
      await ctx.db.patch(review.userId, {
        reviewCount: Math.max(0, (reviewAuthor.reviewCount || 0) - 1),
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Update a review - only owner or admin/senior_reviewer can update
export const updateReview = mutation({
  args: {
    reviewId: v.id("reviews"),
    ratingOverall: v.optional(v.number()),
    ratingMeat: v.optional(v.number()),
    ratingBread: v.optional(v.number()),
    ratingSides: v.optional(v.number()),
    ratingService: v.optional(v.number()),
    ratingValue: v.optional(v.number()),
    text: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("יש להתחבר כדי לערוך ביקורת");
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new Error("ביקורת לא נמצאה");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("משתמש לא נמצא");
    }

    // Check permission: owner OR senior_reviewer/admin can edit
    const isOwner = review.userId === userId;
    const canModerateReviews = user.role === "senior_reviewer" || user.role === "admin";

    if (!isOwner && !canModerateReviews) {
      throw new Error("אין לך הרשאה לערוך ביקורת זו");
    }

    // Build update object
    const updates: Record<string, unknown> = {};
    if (args.ratingOverall !== undefined) updates.ratingOverall = args.ratingOverall;
    if (args.ratingMeat !== undefined) updates.ratingMeat = args.ratingMeat;
    if (args.ratingBread !== undefined) updates.ratingBread = args.ratingBread;
    if (args.ratingSides !== undefined) updates.ratingSides = args.ratingSides;
    if (args.ratingService !== undefined) updates.ratingService = args.ratingService;
    if (args.ratingValue !== undefined) updates.ratingValue = args.ratingValue;
    if (args.text !== undefined) updates.text = args.text;
    if (args.images !== undefined) updates.images = args.images;

    if (Object.keys(updates).length === 0) {
      return review;
    }

    await ctx.db.patch(args.reviewId, updates);

    // Recalculate place average if rating changed
    if (args.ratingOverall !== undefined) {
      const allReviews = await ctx.db
        .query("reviews")
        .withIndex("by_place", (q) => q.eq("placeId", review.placeId))
        .collect();

      const totalRating = allReviews.reduce((sum, r) => sum + r.ratingOverall, 0);
      const newAvg = totalRating / allReviews.length;

      await ctx.db.patch(review.placeId, {
        avgRating: Math.round(newAvg * 10) / 10,
      });
    }

    return await ctx.db.get(args.reviewId);
  },
});
