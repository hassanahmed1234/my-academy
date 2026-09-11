import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    module: { type: String },
    type: {
      type: String,
      enum: ["written", "file", "both"],
      default: "both",
    },
    totalMarks: { type: Number, required: true, default: 100 },
    passingMarks: { type: Number, required: true, default: 50 },
    dueDate: { type: Date, required: true },
    allowLateSubmission: { type: Boolean, default: true },
    allowResubmission: { type: Boolean, default: true },
    maxAttempts: { type: Number, default: 3 },
    instructions: [{ type: String }],
    questions: [
      {
        questionText: { type: String, required: true },
        maxMarks: { type: Number },
      },
    ],
    attachments: [
      {
        name: String,
        fileUrl: String,
      },
    ],
    isPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);