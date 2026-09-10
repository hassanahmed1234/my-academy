import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    module: { type: String },
    type: { type: String, enum: ["practice", "final"], default: "practice" },
    questionCount: { type: Number, required: true, default: 10 },
    timeLimit: { type: Number, required: true, default: 10 }, // in minutes
    passingScore: { type: Number, required: true, default: 70 }, // percentage
    attemptsAllowed: { type: Number, required: true, default: 2 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);