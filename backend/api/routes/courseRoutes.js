import express from "express";
import { getCourses, getCourseById, createCourse,deleteCourse } from "../controllers/courseController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", protect, adminOnly, createCourse);
router.delete("/:id", deleteCourse);

export default router;