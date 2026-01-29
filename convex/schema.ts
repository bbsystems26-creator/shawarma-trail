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

    // Profile fields
    avatar: v.optional(v.string()),
    bio: v.optional(v.string()),
    city: v.optional(v.string()),

    // Role & Status - Reviewers Squad system
    role: v.optional(
      v.union(
        v.literal("visitor"), // Default - can only view
        v.literal("applicant"), // Submitted application, waiting approval
        v.literal("reviewer"), // Approved reviewer - can write reviews
        v.literal("senior_reviewer"), // 10+ quality reviews
        v.literal("admin") // Full access
      )
    ),
    isActive: v.optional(v.boolean()),

    // Stats (denormalized for performance)
    reviewCount: v.optional(v.number()),
    articleCount: v.optional(v.number()),
    totalRaffleEntries: v.optional(v.number()),

    // Timestamps
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    lastLoginAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("by_role", ["role"])
    .index("by_reviewCount", ["reviewCount"]),

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

  // Reviewer applications - Phase 2 Reviewers Squad
  reviewerApplications: defineTable({
    userId: v.id("users"),

    // Application content
    whyJoin: v.string(), // Why do they want to join (min 50 chars)
    favoritePlace: v.string(), // Their favorite shawarma place
    experience: v.string(), // Experience with reviews/writing
    socialLinks: v.optional(v.array(v.string())), // Optional social media links

    // Status
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    reviewedBy: v.optional(v.id("users")), // Admin who reviewed
    reviewedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),
});
