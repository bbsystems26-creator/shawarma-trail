import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

// Get the currently active raffle
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const activeRaffle = await ctx.db
      .query("raffles")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();

    if (!activeRaffle) {
      return null;
    }

    // Get winner info if completed
    let winner = null;
    if (activeRaffle.winnerId) {
      const winnerUser = await ctx.db.get(activeRaffle.winnerId);
      winner = winnerUser
        ? {
            _id: winnerUser._id,
            name: winnerUser.name,
            avatar: winnerUser.avatar || winnerUser.image,
          }
        : null;
    }

    return { ...activeRaffle, winner };
  },
});

// Get all raffles (for history)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const raffles = await ctx.db
      .query("raffles")
      .order("desc")
      .collect();

    // Enrich with winner info
    const enriched = await Promise.all(
      raffles.map(async (raffle) => {
        let winner = null;
        if (raffle.winnerId) {
          const winnerUser = await ctx.db.get(raffle.winnerId);
          winner = winnerUser
            ? {
                _id: winnerUser._id,
                name: winnerUser.name,
                avatar: winnerUser.avatar || winnerUser.image,
              }
            : null;
        }
        return { ...raffle, winner };
      })
    );

    return enriched;
  },
});

// Get raffle by ID
export const getById = query({
  args: { raffleId: v.id("raffles") },
  handler: async (ctx, args) => {
    const raffle = await ctx.db.get(args.raffleId);
    if (!raffle) return null;

    let winner = null;
    if (raffle.winnerId) {
      const winnerUser = await ctx.db.get(raffle.winnerId);
      winner = winnerUser
        ? {
            _id: winnerUser._id,
            name: winnerUser.name,
            avatar: winnerUser.avatar || winnerUser.image,
          }
        : null;
    }

    return { ...raffle, winner };
  },
});

// Get user's entries for a specific raffle
export const getMyEntries = query({
  args: { raffleId: v.optional(v.id("raffles")) },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    // If no raffle specified, get active raffle
    let raffleId = args.raffleId;
    if (!raffleId) {
      const activeRaffle = await ctx.db
        .query("raffles")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .first();
      if (!activeRaffle) return [];
      raffleId = activeRaffle._id;
    }

    const entries = await ctx.db
      .query("raffleEntries")
      .withIndex("by_raffle_user", (q) =>
        q.eq("raffleId", raffleId!).eq("userId", userId)
      )
      .collect();

    return entries;
  },
});

// Get total entries count for current user across all active raffles
export const getMyTotalEntries = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return 0;

    const activeRaffle = await ctx.db
      .query("raffles")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();

    if (!activeRaffle) return 0;

    const entries = await ctx.db
      .query("raffleEntries")
      .withIndex("by_raffle_user", (q) =>
        q.eq("raffleId", activeRaffle._id).eq("userId", userId)
      )
      .collect();

    return entries.length;
  },
});

// Create a raffle entry for a review (called internally from reviews.ts)
export const createEntryForReview = internalMutation({
  args: {
    userId: v.id("users"),
    reviewId: v.id("reviews"),
  },
  handler: async (ctx, args) => {
    // Find active raffle
    const activeRaffle = await ctx.db
      .query("raffles")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();

    if (!activeRaffle) {
      // No active raffle, skip entry creation
      return null;
    }

    // Check if entry already exists for this review
    const existingEntry = await ctx.db
      .query("raffleEntries")
      .withIndex("by_raffleId", (q) => q.eq("raffleId", activeRaffle._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("sourceType"), "review"),
          q.eq(q.field("sourceId"), args.reviewId as unknown as string)
        )
      )
      .first();

    if (existingEntry) {
      return existingEntry._id;
    }

    // Create the entry
    const entryId = await ctx.db.insert("raffleEntries", {
      raffleId: activeRaffle._id,
      userId: args.userId,
      sourceType: "review",
      sourceId: args.reviewId as unknown as string,
      createdAt: Date.now(),
    });

    // Check if user is new participant
    const existingUserEntries = await ctx.db
      .query("raffleEntries")
      .withIndex("by_raffle_user", (q) =>
        q.eq("raffleId", activeRaffle._id).eq("userId", args.userId)
      )
      .collect();

    const isNewParticipant = existingUserEntries.length === 1; // Just added the first one

    // Update raffle stats
    await ctx.db.patch(activeRaffle._id, {
      totalEntries: activeRaffle.totalEntries + 1,
      participantCount: isNewParticipant
        ? activeRaffle.participantCount + 1
        : activeRaffle.participantCount,
    });

    // Update user's total raffle entries
    const user = await ctx.db.get(args.userId);
    if (user) {
      await ctx.db.patch(args.userId, {
        totalRaffleEntries: (user.totalRaffleEntries || 0) + 1,
      });
    }

    return entryId;
  },
});

// ====== Admin Functions ======

// Create a new raffle (admin only)
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    prize: v.string(),
    prizeValue: v.number(),
    month: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    status: v.union(v.literal("upcoming"), v.literal("active")),
  },
  handler: async (ctx, args) => {
    const adminId = await auth.getUserId(ctx);
    if (!adminId) {
      throw new Error("Not authenticated");
    }

    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    // If setting as active, deactivate any current active raffle
    if (args.status === "active") {
      const currentActive = await ctx.db
        .query("raffles")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .first();

      if (currentActive) {
        await ctx.db.patch(currentActive._id, { status: "completed" });
      }
    }

    const raffleId = await ctx.db.insert("raffles", {
      title: args.title,
      description: args.description,
      prize: args.prize,
      prizeValue: args.prizeValue,
      month: args.month,
      startDate: args.startDate,
      endDate: args.endDate,
      status: args.status,
      totalEntries: 0,
      participantCount: 0,
      createdAt: Date.now(),
    });

    return raffleId;
  },
});

// Activate a raffle (admin only)
export const activate = mutation({
  args: { raffleId: v.id("raffles") },
  handler: async (ctx, args) => {
    const adminId = await auth.getUserId(ctx);
    if (!adminId) {
      throw new Error("Not authenticated");
    }

    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Deactivate current active raffle
    const currentActive = await ctx.db
      .query("raffles")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();

    if (currentActive && currentActive._id !== args.raffleId) {
      await ctx.db.patch(currentActive._id, { status: "completed" });
    }

    await ctx.db.patch(args.raffleId, { status: "active" });

    return { success: true };
  },
});

// Draw a winner (admin only)
export const drawWinner = mutation({
  args: { raffleId: v.id("raffles") },
  handler: async (ctx, args) => {
    const adminId = await auth.getUserId(ctx);
    if (!adminId) {
      throw new Error("Not authenticated");
    }

    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    const raffle = await ctx.db.get(args.raffleId);
    if (!raffle) {
      throw new Error("Raffle not found");
    }

    if (raffle.status === "completed" && raffle.winnerId) {
      throw new Error("Winner already drawn");
    }

    // Get all entries
    const entries = await ctx.db
      .query("raffleEntries")
      .withIndex("by_raffleId", (q) => q.eq("raffleId", args.raffleId))
      .collect();

    if (entries.length === 0) {
      throw new Error("No entries in this raffle");
    }

    // Random selection
    const winningIndex = Math.floor(Math.random() * entries.length);
    const winningEntry = entries[winningIndex];

    // Update raffle with winner
    await ctx.db.patch(args.raffleId, {
      status: "completed",
      winnerId: winningEntry.userId,
      winnerEntryId: winningEntry._id,
      winnerAnnouncedAt: Date.now(),
      drawDate: Date.now(),
    });

    // Get winner info
    const winner = await ctx.db.get(winningEntry.userId);

    return {
      success: true,
      winner: winner
        ? {
            _id: winner._id,
            name: winner.name,
            email: winner.email,
          }
        : null,
      totalEntries: entries.length,
    };
  },
});

// Get raffle entries (admin only)
export const getEntries = query({
  args: { raffleId: v.id("raffles") },
  handler: async (ctx, args) => {
    const adminId = await auth.getUserId(ctx);
    if (!adminId) {
      throw new Error("Not authenticated");
    }

    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    const entries = await ctx.db
      .query("raffleEntries")
      .withIndex("by_raffleId", (q) => q.eq("raffleId", args.raffleId))
      .collect();

    // Enrich with user data
    const enriched = await Promise.all(
      entries.map(async (entry) => {
        const user = await ctx.db.get(entry.userId);
        return {
          ...entry,
          user: user
            ? {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar || user.image,
              }
            : null,
        };
      })
    );

    return enriched;
  },
});

// Delete a raffle (admin only)
export const deleteRaffle = mutation({
  args: { raffleId: v.id("raffles") },
  handler: async (ctx, args) => {
    const adminId = await auth.getUserId(ctx);
    if (!adminId) {
      throw new Error("Not authenticated");
    }

    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    // Delete all entries first
    const entries = await ctx.db
      .query("raffleEntries")
      .withIndex("by_raffleId", (q) => q.eq("raffleId", args.raffleId))
      .collect();

    for (const entry of entries) {
      await ctx.db.delete(entry._id);
    }

    // Delete the raffle
    await ctx.db.delete(args.raffleId);

    return { success: true };
  },
});
