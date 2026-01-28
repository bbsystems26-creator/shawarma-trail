import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Upsert a place by slug — used by the import script.
 * If a place with the given slug exists, it's updated.
 * Otherwise, a new place is created.
 */
export const upsertPlace = mutation({
  args: {
    slug: v.string(),
    data: v.object({
      name: v.string(),
      slug: v.string(),
      description: v.optional(v.string()),
      address: v.string(),
      city: v.string(),
      region: v.union(
        v.literal("north"),
        v.literal("center"),
        v.literal("south"),
        v.literal("jerusalem"),
        v.literal("shfela")
      ),
      lat: v.number(),
      lng: v.number(),
      phone: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
      website: v.optional(v.string()),
      kashrut: v.union(
        v.literal("none"),
        v.literal("regular"),
        v.literal("mehadrin"),
        v.literal("badatz")
      ),
      meatTypes: v.array(v.string()),
      style: v.array(v.string()),
      priceRange: v.union(v.literal(1), v.literal(2), v.literal(3)),
      hasDelivery: v.boolean(),
      hasSeating: v.boolean(),
      openingHours: v.optional(v.any()),
      images: v.array(v.string()),
      menuUrl: v.optional(v.string()),
      avgRating: v.number(),
      reviewCount: v.number(),
      isFeatured: v.boolean(),
      isVerified: v.boolean(),
      tags: v.optional(v.array(v.string())),
      profileImage: v.optional(v.string()),
      createdAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("places")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      // Update existing place, preserving fields not in the import
      await ctx.db.patch(existing._id, {
        ...args.data,
        // Don't overwrite these if already set
        isFeatured: existing.isFeatured || args.data.isFeatured,
        isVerified: existing.isVerified || args.data.isVerified,
        claimedBy: existing.claimedBy,
        ownerStory: existing.ownerStory,
        socialLinks: existing.socialLinks,
        menuItems: existing.menuItems,
        tips: existing.tips,
      });
      return { action: "updated" as const, id: existing._id };
    } else {
      const id = await ctx.db.insert("places", {
        ...args.data,
        createdAt: args.data.createdAt ?? Date.now(),
      });
      return { action: "created" as const, id };
    }
  },
});

/**
 * Delete all places — useful for resetting before a fresh import.
 * USE WITH CAUTION.
 */
export const deleteAllPlaces = mutation({
  args: {},
  handler: async (ctx) => {
    const places = await ctx.db.query("places").collect();
    let count = 0;
    for (const place of places) {
      await ctx.db.delete(place._id);
      count++;
    }
    return { deleted: count };
  },
});
