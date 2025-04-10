
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mark attendance for a user
export const markAttendance = mutation({
  args: {
    userId: v.string(),
    personName: v.string(),
    personId: v.string(),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if attendance already marked today
    const today = args.date;
    const existingAttendance = await ctx.db
      .query("attendance")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("date"), today))
      .first();

    if (existingAttendance) {
      return { status: "already_marked", id: existingAttendance._id };
    }

    // Mark new attendance
    const attendanceId = await ctx.db.insert("attendance", {
      userId: args.userId,
      personName: args.personName,
      personId: args.personId,
      date: today,
      time: args.time,
      createdAt: Date.now(),
    });

    return { status: "marked", id: attendanceId };
  },
});

// Get attendance records for today
export const getTodayAttendance = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("attendance")
      .filter((q) => q.eq(q.field("date"), args.date))
      .order("desc")
      .collect();
    
    return records;
  },
});

// Get all attendance records
export const getAllAttendance = query({
  handler: async (ctx) => {
    const records = await ctx.db
      .query("attendance")
      .order("desc")
      .collect();
    
    return records;
  },
});

// Get user attendance statistics
export const getUserStatistics = query({
  handler: async (ctx) => {
    const records = await ctx.db.query("attendance").collect();
    const today = new Date().toISOString().split('T')[0];
    
    const todayRecords = records.filter(record => record.date === today);
    const users = await ctx.db.query("users").collect();
    
    return {
      totalUsers: users.length,
      presentToday: todayRecords.length,
      absentToday: users.length - todayRecords.length,
      attendanceRate: users.length > 0 ? Math.round((todayRecords.length / users.length) * 100) : 0
    };
  },
});
