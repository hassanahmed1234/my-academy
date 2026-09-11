import mongoose from "mongoose";

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    attemptNumber: { type: Number, default: 1 },
    
    // Written answers map or array
    writtenAnswers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId },
        answerText: { type: String },
      },
    ],
    textResponse: { type: String }, // General rich-text response if not question-wise

    // File Upload
    fileUrl: { type: String },
    fileName: { type: String },

    status: {
      type: String,
      enum: ["draft", "submitted", "graded", "resubmit_required", "late"],
      default: "draft",
    },
    isLate: { type: Boolean, default: false },
    submittedAt: { type: Date },

    // Grading & Feedback
    marksObtained: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    isPassed: { type: Boolean, default: false },
    feedback: { type: String, default: "" },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    gradedAt: { type: Date },

    // Previous Attempts log
    history: [
      {
        attemptNumber: Number,
        writtenAnswers: Array,
        textResponse: String,
        fileUrl: String,
        submittedAt: Date,
        marksObtained: Number,
        feedback: String,
      },
    ],
  },
  { timestamps: true }
);

// Composite Index for efficient querying
assignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);