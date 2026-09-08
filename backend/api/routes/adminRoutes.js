import express from "express";
import {
  getDashboardOverview,
//   getAllCoursesAdmin,
//   createCourse,
//   updateCourse,
//   deleteCourse,
//   getAllLiveSessionsAdmin,
//   createLiveSession,
//   deleteLiveSession,
//   getRegisteredStudents,
//   getEnrollments,
} from "../controllers/adminController.js";

import { protect,adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ALL ROUTES ARE PROTECTED & ADMIN ONLY
// ==========================================
router.use(protect);
router.use(adminOnly);

/* 1. DASHBOARD OVERVIEW & STATS */
router.get("/stats", getDashboardOverview);
// router.get("/students", getRegisteredStudents);
// router.get("/enrollments", getEnrollments);

// /* 2. COURSE MANAGEMENT */
// router.get("/courses", getAllCoursesAdmin);
// router.post("/courses", createCourse);
// router.put("/courses/:id", updateCourse);
// router.delete("/courses/:id", deleteCourse);

// /* 3. LIVE BROADCASTS & CLASSES */
// router.get("/live-sessions", getAllLiveSessionsAdmin);
// router.post("/live-sessions", createLiveSession);
// router.delete("/live-sessions/:id", deleteLiveSession);

export default router;