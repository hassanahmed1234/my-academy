import express from "express";
import { getMyCourses } from "../controllers/myCoursesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyCourses);

export default router;