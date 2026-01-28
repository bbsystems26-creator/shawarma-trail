import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// List articles with optional filters
export const list = query({
  args: {
    category: v.optional(
      v.union(
        v.literal("guide"),
        v.literal("review"),
        v.literal("news"),
        v.literal("culture")
      )
    ),
    publishedOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let articles;

    if (args.category) {
      articles = await ctx.db
        .query("articles")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    } else {
      articles = await ctx.db.query("articles").collect();
    }

    // Filter by published status if requested
    if (args.publishedOnly) {
      articles = articles.filter((a) => a.isPublished);
    }

    // Sort by publishedAt (newest first) or createdAt for drafts
    articles.sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return dateB - dateA;
    });

    // Apply limit
    if (args.limit) {
      articles = articles.slice(0, args.limit);
    }

    return articles;
  },
});

// Get single article by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return article;
  },
});

// Get article by ID
export const getById = query({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create new article
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const articleId = await ctx.db.insert("articles", {
      ...args,
      publishedAt: args.isPublished ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
    return articleId;
  },
});

// Update article
export const update = mutation({
  args: {
    id: v.id("articles"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    author: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("guide"),
        v.literal("review"),
        v.literal("news"),
        v.literal("culture")
      )
    ),
    tags: v.optional(v.array(v.string())),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Article not found");

    // If publishing for the first time, set publishedAt
    const publishedAt =
      updates.isPublished && !existing.isPublished && !existing.publishedAt
        ? Date.now()
        : existing.publishedAt;

    await ctx.db.patch(id, {
      ...updates,
      publishedAt,
      updatedAt: Date.now(),
    });
    return id;
  },
});

// Delete article
export const remove = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get related articles (same category, excluding current)
export const getRelated = query({
  args: {
    slug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const current = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!current) return [];

    // Get articles from same category
    let related = await ctx.db
      .query("articles")
      .withIndex("by_category", (q) => q.eq("category", current.category))
      .collect();

    // Filter out current and unpublished
    related = related.filter(
      (a) => a.slug !== args.slug && a.isPublished
    );

    // Sort by date and limit
    related.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
    
    const limit = args.limit || 3;
    return related.slice(0, limit);
  },
});
