import express from "express";
import { getCourses, getCourseById, createCourse } from "../controllers/courseController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", protect, adminOnly, createCourse);

export default router;