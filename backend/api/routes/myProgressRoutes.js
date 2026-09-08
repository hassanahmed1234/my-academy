import express from "express";
import { getCourseProgress, toggleLessonComplete } from "../controllers/myProgressController.js";
import { protect } from "../middleware/authMiddleware.js"; // Aapka auth middleware

const router = express.Router();

router.get("/:courseId", protect, getCourseProgress);
router.post("/toggle", protect, toggleLessonComplete);

export default router;