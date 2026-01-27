import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  places: defineTable({
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
    claimedBy: v.optional(v.id("users")),
  })
    .index("by_slug", ["slug"])
    .index("by_city", ["city"])
    .index("by_region", ["region"])
    .index("by_rating", ["avgRating"])
    .index("by_featured", ["isFeatured"])
    .index("by_kashrut", ["kashrut"])
    .searchIndex("search_name", { searchField: "name" }),

  reviews: defineTable({
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
    helpfulCount: v.number(),
    isVerifiedVisit: v.boolean(),
  })
    .index("by_place", ["placeId"])
    .index("by_user", ["userId"])
    .index("by_rating", ["ratingOverall"]),

  users: defineTable({
    name: v.string(),
    avatar: v.optional(v.string()),
    email: v.optional(v.string()),
    reviewCount: v.number(),
    role: v.union(
      v.literal("user"),
      v.literal("editor"),
      v.literal("admin"),
      v.literal("owner")
    ),
  }),

  lists: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    placeIds: v.array(v.id("places")),
    authorId: v.id("users"),
    type: v.union(v.literal("editorial"), v.literal("community")),
  }).index("by_slug", ["slug"]),
});
