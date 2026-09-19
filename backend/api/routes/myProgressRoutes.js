import express from "express";
import { 
  getCourseProgress, 
  getAllUserProgress, 
  markLessonComplete
} from "../controllers/myProgressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Get ALL completed lessons/courses for logged-in user (No Param Required)
router.get("/all", protect, getAllUserProgress);

// 2. Get specific course progress
router.get("/:courseId", protect, getCourseProgress);
router.post("/add-xp", protect, addGlobalXp);

// Mark lesson complete (One-time)
router.post("/complete", protect, markLessonComplete);
export default router;