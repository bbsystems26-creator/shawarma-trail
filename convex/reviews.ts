import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByPlace = query({
  args: { placeId: v.id("places") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_place", (q) => q.eq("placeId", args.placeId))
      .collect();

    // Enrich with user data
    const enriched = await Promise.all(
      reviews.map(async (review) => {
        const user = await ctx.db.get(review.userId);
        return { ...review, userName: user?.name ?? "אנונימי" };
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
    userId: v.id("users"),
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
    // Insert the review
    const reviewId = await ctx.db.insert("reviews", {
      ...args,
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
    const user = await ctx.db.get(args.userId);
    if (user) {
      await ctx.db.patch(args.userId, {
        reviewCount: (user.reviewCount || 0) + 1,
      });
    }

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
