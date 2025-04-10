
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Register a new user with their face data
export const registerUser = mutation({
  args: {
    name: v.string(),
    userId: v.string(),
    personId: v.string(),
    faceDescriptor: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.name,
      userId: args.userId,
      personId: args.personId,
      faceDescriptor: args.faceDescriptor,
      createdAt: Date.now(),
    });

    return userId;
  },
});

// Get all registered users
export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

// Get a specific user by their Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.clerkId))
      .first();
    return user;
  },
});

// Get all face descriptors for recognition
export const getAllFaceDescriptors = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map(user => ({
      id: user._id,
      name: user.name,
      personId: user.personId,
      descriptor: user.faceDescriptor
    }));
  },
});
