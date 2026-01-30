import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// Submit a new reviewer application
export const submit = mutation({
  args: {
    whyJoin: v.string(),
    favoritePlace: v.string(),
    experience: v.string(),
    socialLinks: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Only visitors can apply
    if (user.role && user.role !== "visitor") {
      throw new Error("You are already a reviewer or have a pending application");
    }

    // Check if user already has a pending application
    const existingApplication = await ctx.db
      .query("reviewerApplications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    if (existingApplication) {
      throw new Error("You already have a pending application");
    }

    // Validate minimum length for whyJoin
    if (args.whyJoin.length < 50) {
      throw new Error("Please write at least 50 characters explaining why you want to join");
    }

    // Create the application
    const applicationId = await ctx.db.insert("reviewerApplications", {
      userId,
      whyJoin: args.whyJoin,
      favoritePlace: args.favoritePlace,
      experience: args.experience,
      socialLinks: args.socialLinks,
      status: "pending",
      createdAt: Date.now(),
    });

    // Update user role to applicant
    await ctx.db.patch(userId, {
      role: "applicant",
      updatedAt: Date.now(),
    });

    return applicationId;
  },
});

// Get current user's application status
export const getMyApplication = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return null;
    }

    const application = await ctx.db
      .query("reviewerApplications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    return application;
  },
});

// Get all applications (admin only)
export const listAll = query({
  args: {
    status: v.optional(
      v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))
    ),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const applications = args.status
      ? await ctx.db
          .query("reviewerApplications")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .order("desc")
          .collect()
      : await ctx.db
          .query("reviewerApplications")
          .withIndex("by_createdAt")
          .order("desc")
          .collect();

    // Enrich with user data
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const applicant = await ctx.db.get(app.userId);
        return {
          ...app,
          user: applicant
            ? {
                _id: applicant._id,
                name: applicant.name,
                email: applicant.email,
                image: applicant.image,
                avatar: applicant.avatar,
                createdAt: applicant.createdAt,
              }
            : null,
        };
      })
    );

    return enrichedApplications;
  },
});

// Get pending applications count (admin only)
export const getPendingCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return 0;
    }

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      return 0;
    }

    const pendingApps = await ctx.db
      .query("reviewerApplications")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    return pendingApps.length;
  },
});

// Approve an application (admin only)
export const approve = mutation({
  args: {
    applicationId: v.id("reviewerApplications"),
  },
  handler: async (ctx, args) => {
    const adminId = await auth.getUserId(ctx);
    if (adminId === null) {
      throw new Error("Not authenticated");
    }

    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    if (application.status !== "pending") {
      throw new Error("Application has already been reviewed");
    }

    // Update application status
    await ctx.db.patch(args.applicationId, {
      status: "approved",
      reviewedBy: adminId,
      reviewedAt: Date.now(),
    });

    // Update user role to reviewer
    await ctx.db.patch(application.userId, {
      role: "reviewer",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Reject an application (admin only)
export const reject = mutation({
  args: {
    applicationId: v.id("reviewerApplications"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminId = await auth.getUserId(ctx);
    if (adminId === null) {
      throw new Error("Not authenticated");
    }

    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Admin access required");
    }

    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    if (application.status !== "pending") {
      throw new Error("Application has already been reviewed");
    }

    // Update application status
    await ctx.db.patch(args.applicationId, {
      status: "rejected",
      reviewedBy: adminId,
      reviewedAt: Date.now(),
      rejectionReason: args.reason,
    });

    // Revert user role to visitor so they can apply again later
    await ctx.db.patch(application.userId, {
      role: "visitor",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
