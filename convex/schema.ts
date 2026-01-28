import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

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
    // v2 fields
    ownerStory: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    profileImage: v.optional(v.string()),
    socialLinks: v.optional(v.any()),
    menuItems: v.optional(v.any()),
    tips: v.optional(v.any()),
    createdAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_city", ["city"])
    .index("by_region", ["region"])
    .index("by_rating", ["avgRating"])
    .index("by_featured", ["isFeatured"])
    .index("by_kashrut", ["kashrut"])
    .index("by_createdAt", ["createdAt"])
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

  // Extended users table to work with Convex Auth
  users: defineTable({
    // Auth fields - linked from authAccounts
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    // App-specific fields
    avatar: v.optional(v.string()),
    reviewCount: v.optional(v.number()),
    role: v.optional(
      v.union(
        v.literal("user"),
        v.literal("editor"),
        v.literal("admin"),
        v.literal("owner")
      )
    ),
  }).index("email", ["email"]),

  lists: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    placeIds: v.array(v.id("places")),
    authorId: v.id("users"),
    type: v.union(v.literal("editorial"), v.literal("community")),
  }).index("by_slug", ["slug"]),

  articles: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.string(),
    author: v.string(),
    category: v.union(
      v.literal("guide"),
      v.literal("review"),
      v.literal("news"),
      v.literal("culture")
    ),
    tags: v.array(v.string()),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_published", ["isPublished"]),
});
