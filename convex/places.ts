import { query } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    return await ctx.db
      .query("places")
      .order("desc")
      .take(limit);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("places")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const filterByCity = query({
  args: { city: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("places")
      .withIndex("by_city", (q) => q.eq("city", args.city))
      .collect();
  },
});

export const filterByRegion = query({
  args: {
    region: v.union(
      v.literal("north"),
      v.literal("center"),
      v.literal("south"),
      v.literal("jerusalem"),
      v.literal("shfela")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("places")
      .withIndex("by_region", (q) => q.eq("region", args.region))
      .collect();
  },
});

export const filterByKashrut = query({
  args: {
    kashrut: v.union(
      v.literal("none"),
      v.literal("regular"),
      v.literal("mehadrin"),
      v.literal("badatz")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("places")
      .withIndex("by_kashrut", (q) => q.eq("kashrut", args.kashrut))
      .collect();
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("places")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .collect();
  },
});

export const getTopRated = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const places = await ctx.db
      .query("places")
      .withIndex("by_rating")
      .order("desc")
      .take(limit);
    return places;
  },
});

export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("places")
      .withSearchIndex("search_name", (q) =>
        q.search("name", args.searchTerm)
      )
      .take(20);
  },
});

export const filter = query({
  args: {
    region: v.optional(
      v.union(
        v.literal("north"),
        v.literal("center"),
        v.literal("south"),
        v.literal("jerusalem"),
        v.literal("shfela")
      )
    ),
    kashrut: v.optional(
      v.union(
        v.literal("none"),
        v.literal("regular"),
        v.literal("mehadrin"),
        v.literal("badatz")
      )
    ),
    meatType: v.optional(v.string()),
    style: v.optional(v.string()),
    priceRange: v.optional(v.union(v.literal(1), v.literal(2), v.literal(3))),
    minRating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let places;

    if (args.region) {
      places = await ctx.db
        .query("places")
        .withIndex("by_region", (q) => q.eq("region", args.region!))
        .collect();
    } else if (args.kashrut) {
      places = await ctx.db
        .query("places")
        .withIndex("by_kashrut", (q) => q.eq("kashrut", args.kashrut!))
        .collect();
    } else {
      places = await ctx.db.query("places").collect();
    }

    // Client-side filtering for additional criteria
    if (args.kashrut && args.region) {
      places = places.filter((p) => p.kashrut === args.kashrut);
    }
    if (args.meatType) {
      places = places.filter((p) => p.meatTypes.includes(args.meatType!));
    }
    if (args.style) {
      places = places.filter((p) => p.style.includes(args.style!));
    }
    if (args.priceRange) {
      places = places.filter((p) => p.priceRange === args.priceRange);
    }
    if (args.minRating) {
      places = places.filter((p) => p.avgRating >= args.minRating!);
    }

    return places;
  },
});

export const listFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;
    return await ctx.db
      .query("places")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .take(limit);
  },
});

export const listNewest = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;
    return await ctx.db
      .query("places")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
  },
});

export const listByTag = query({
  args: { tag: v.string() },
  handler: async (ctx, args) => {
    const allPlaces = await ctx.db.query("places").collect();
    return allPlaces.filter(
      (p) => p.tags && p.tags.includes(args.tag)
    );
  },
});
