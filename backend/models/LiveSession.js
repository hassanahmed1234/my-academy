import mongoose from "mongoose";

const liveSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Session title is required"],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Associated course is required"],
    },
    scholarName: {
      type: String,
      required: [true, "Scholar/Instructor name is required"],
      trim: true,
    },
    meetingUrl: {
      type: String,
      required: [true, "Meeting URL is required"],
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: [true, "Scheduled date and time are required"],
    },
    status: {
      type: String,
      enum: ["Scheduled", "Live", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const LiveSession = mongoose.model("LiveSession", liveSessionSchema);

export default LiveSession;