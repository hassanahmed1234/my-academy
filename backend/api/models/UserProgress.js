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
    // Progress track karne ke liye array of lesson IDs
    completedLessons: [
      {
        type: String, // ya mongoose.Schema.Types.ObjectId
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("UserProgress", userProgressSchema);