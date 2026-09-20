import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    // --- AI ASSISTANT DAILY POINTS SYSTEM ---
    aiPoints: {
      type: Number,
      default: 10,
    },
    lastAiResetDate: {
      type: Date,
      default: Date.now,
    },
    // --- GLOBAL GAMIFICATION & LEADERBOARD STATS ---
    xp: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    quizzesPassed: {
      type: Number,
      default: 0,
    },
    assignmentsSubmitted: {
      type: Number,
      default: 0,
    },
    coursesCompleted: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    website: { type: String, default: "" },
    avatar: { type: String, default: "" },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// --- HELPER METHOD: AUTO RESET AI POINTS DAILY ---
userSchema.methods.checkAndResetAiPoints = async function () {
  const today = new Date();
  const lastReset = new Date(this.lastAiResetDate || this.createdAt);

  // Check if today is a different day than last reset date
  const isDifferentDay =
    today.getFullYear() !== lastReset.getFullYear() ||
    today.getMonth() !== lastReset.getMonth() ||
    today.getDate() !== lastReset.getDate();

  if (isDifferentDay) {
    this.aiPoints = 10; // Reset back to 10 (Non-accumulative)
    this.lastAiResetDate = today;
    await this.save();
  }
  return this.aiPoints;
};

// FIXED PRE-SAVE HOOK
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;