import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true }, // Keep hidden from frontend on quiz start
    explanation: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);