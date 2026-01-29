import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Google, Password],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        // Existing user - update lastLoginAt
        await ctx.db.patch(args.existingUserId, {
          lastLoginAt: Date.now(),
          updatedAt: Date.now(),
        });
        return args.existingUserId;
      }
      // New user - create with default values
      const now = Date.now();
      return await ctx.db.insert("users", {
        ...args.profile,
        role: "visitor",
        isActive: true,
        reviewCount: 0,
        articleCount: 0,
        totalRaffleEntries: 0,
        createdAt: now,
        updatedAt: now,
      });
    },
  },
});
