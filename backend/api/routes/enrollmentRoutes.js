import express from "express";
import { enrollInCourse, updateLessonProgress } from "../controllers/enrollmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected Routes (Token Login Required)
router.post("/:courseId", protect, enrollInCourse);
router.put("/progress", protect, updateLessonProgress);

export default router;