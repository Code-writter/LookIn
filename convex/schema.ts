
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    userId: v.string(),
    personId: v.string(),
    faceDescriptor: v.array(v.number()),
    createdAt: v.number(),
  }),
  attendance: defineTable({
    userId: v.string(),
    personName: v.string(),
    personId: v.string(),
    date: v.string(),
    time: v.string(),
    createdAt: v.number(),
  }),
});
