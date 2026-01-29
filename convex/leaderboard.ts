import { query } from "./_generated/server";
import { v } from "convex/values";

// Badge thresholds
export const BADGE_THRESHOLDS = {
  BRONZE: 3,      // 3+ reviews
  SILVER: 10,     // 10+ reviews
  GOLD: 25,       // 25+ reviews
  PLATINUM: 50,   // 50+ reviews
  DIAMOND: 100,   // 100+ reviews
} as const;

export type BadgeLevel = "none" | "bronze" | "silver" | "gold" | "platinum" | "diamond";

// Calculate badge level based on review count
export function getBadgeLevel(reviewCount: number): BadgeLevel {
  if (reviewCount >= BADGE_THRESHOLDS.DIAMOND) return "diamond";
  if (reviewCount >= BADGE_THRESHOLDS.PLATINUM) return "platinum";
  if (reviewCount >= BADGE_THRESHOLDS.GOLD) return "gold";
  if (reviewCount >= BADGE_THRESHOLDS.SILVER) return "silver";
  if (reviewCount >= BADGE_THRESHOLDS.BRONZE) return "bronze";
  return "none";
}

// Get leaderboard - top reviewers sorted by review count
export const getLeaderboard = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    // Get all users who are reviewers or have reviews
    const users = await ctx.db
      .query("users")
      .collect();

    // Filter and map users with their stats
    const reviewers = users
      .filter((user) => {
        // Include anyone with reviews or reviewer role
        const hasReviews = (user.reviewCount ?? 0) > 0;
        const isReviewer = ["reviewer", "senior_reviewer", "admin"].includes(user.role ?? "");
        return hasReviews || isReviewer;
      })
      .map((user) => {
        const reviewCount = user.reviewCount ?? 0;
        return {
          _id: user._id,
          name: user.name ?? "משתמש אנונימי",
          avatar: user.avatar ?? user.image,
          city: user.city,
          role: user.role ?? "visitor",
          reviewCount,
          articleCount: user.articleCount ?? 0,
          badge: getBadgeLevel(reviewCount),
          joinedAt: user.createdAt,
        };
      });

    // Sort by review count (descending), then by name
    reviewers.sort((a, b) => {
      if (b.reviewCount !== a.reviewCount) {
        return b.reviewCount - a.reviewCount;
      }
      return (a.name ?? "").localeCompare(b.name ?? "", "he");
    });

    // Add rank
    const rankedReviewers = reviewers.slice(0, limit).map((reviewer, index) => ({
      ...reviewer,
      rank: index + 1,
    }));

    return rankedReviewers;
  },
});

// Get stats for the leaderboard page
export const getLeaderboardStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const reviews = await ctx.db.query("reviews").collect();

    const totalReviewers = users.filter((u) =>
      ["reviewer", "senior_reviewer", "admin"].includes(u.role ?? "")
    ).length;

    const totalReviews = reviews.length;

    // Count badge holders
    const badgeCounts = {
      diamond: 0,
      platinum: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
    };

    users.forEach((user) => {
      const badge = getBadgeLevel(user.reviewCount ?? 0);
      if (badge !== "none") {
        badgeCounts[badge]++;
      }
    });

    return {
      totalReviewers,
      totalReviews,
      badgeCounts,
    };
  },
});

// Get a single user's rank and badge info
export const getUserRank = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // Get all users with reviews to calculate rank
    const users = await ctx.db.query("users").collect();
    const reviewers = users
      .filter((u) => (u.reviewCount ?? 0) > 0)
      .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));

    const rank = reviewers.findIndex((u) => u._id === args.userId) + 1;
    const reviewCount = user.reviewCount ?? 0;

    return {
      rank: rank > 0 ? rank : null,
      reviewCount,
      badge: getBadgeLevel(reviewCount),
      nextBadge: getNextBadge(reviewCount),
      reviewsToNextBadge: getReviewsToNextBadge(reviewCount),
    };
  },
});

// Helper: Get next badge level
function getNextBadge(reviewCount: number): BadgeLevel | null {
  if (reviewCount >= BADGE_THRESHOLDS.DIAMOND) return null;
  if (reviewCount >= BADGE_THRESHOLDS.PLATINUM) return "diamond";
  if (reviewCount >= BADGE_THRESHOLDS.GOLD) return "platinum";
  if (reviewCount >= BADGE_THRESHOLDS.SILVER) return "gold";
  if (reviewCount >= BADGE_THRESHOLDS.BRONZE) return "silver";
  return "bronze";
}

// Helper: Get reviews needed for next badge
function getReviewsToNextBadge(reviewCount: number): number | null {
  if (reviewCount >= BADGE_THRESHOLDS.DIAMOND) return null;
  if (reviewCount >= BADGE_THRESHOLDS.PLATINUM) return BADGE_THRESHOLDS.DIAMOND - reviewCount;
  if (reviewCount >= BADGE_THRESHOLDS.GOLD) return BADGE_THRESHOLDS.PLATINUM - reviewCount;
  if (reviewCount >= BADGE_THRESHOLDS.SILVER) return BADGE_THRESHOLDS.GOLD - reviewCount;
  if (reviewCount >= BADGE_THRESHOLDS.BRONZE) return BADGE_THRESHOLDS.SILVER - reviewCount;
  return BADGE_THRESHOLDS.BRONZE - reviewCount;
}
