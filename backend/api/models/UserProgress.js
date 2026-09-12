import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    // Aapka existing logic
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    
    // --- GAMIFICATION & LEADERBOARD FIELDS (NEW) ---
    xp: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 1,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    quizzesPassed: {
      type: Number,
      default: 0,
    },
    assignmentsSubmitted: {
      type: Number,
      default: 0,
    },
    isCourseCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Unique index: Ek user ke paas ek course ka ek hi progress record hoga
userProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model("UserProgress", userProgressSchema);