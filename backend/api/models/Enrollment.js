import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    totalLessons: {
      type: Number,
      required: true,
      default: 0,
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    certificateUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-calculate progress before saving
// enrollmentSchema.pre("save", function (next) {
//   if (this.totalLessons > 0) {
//     this.progressPercentage = Math.round(
//       (this.completedLessons.length / this.totalLessons) * 100
//     );
//     if (this.progressPercentage >= 100) {
//       this.status = "completed";
//     }
//   }
//   next();
// });

export default mongoose.model("Enrollment", enrollmentSchema);
