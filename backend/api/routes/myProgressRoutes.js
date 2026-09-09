import express from "express";
import { 
  getCourseProgress, 
  toggleLessonComplete, 
  getAllUserProgress 
} from "../controllers/myProgressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Get ALL completed lessons/courses for logged-in user (No Param Required)
router.get("/all", protect, getAllUserProgress);

// 2. Get specific course progress
router.get("/:courseId", protect, getCourseProgress);

// 3. Toggle lesson state
router.post("/toggle", protect, toggleLessonComplete);

export default router;