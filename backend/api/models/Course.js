import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  duration: { type: String },
  type: { type: String, enum: ["video", "quiz", "assignment"], default: "video" },
});

const moduleSchema = new mongoose.Schema({
  moduleTitle: { type: String, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    arabicTitle: { type: String },
    category: { type: String, required: true },
    description: { type: String },
    instructor: { type: String, required: true },
    isFree: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    image: { type: String },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
