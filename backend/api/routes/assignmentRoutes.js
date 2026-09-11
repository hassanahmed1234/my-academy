import express from "express";
import {
  createAssignment,
  getAllAdminAssignments,
  togglePublishAssignment,
  getSubmissionsForAssignment,
  gradeSubmission,
  getStudentAssignments,
  getStudentAssignmentDetail,
  saveOrSubmitAssignment,
} from "../controllers/assignmentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Student Endpoints
router.get("/student/list", getStudentAssignments);
router.get("/student/detail/:id", getStudentAssignmentDetail);
router.post("/student/submit/:id", saveOrSubmitAssignment);

// Admin Endpoints
router.post("/admin/create", adminOnly, createAssignment);
router.get("/admin/all", adminOnly, getAllAdminAssignments);
router.patch("/admin/publish/:id", adminOnly, togglePublishAssignment);
router.get("/admin/submissions/:assignmentId", adminOnly, getSubmissionsForAssignment);
router.post("/admin/grade/:submissionId", adminOnly, gradeSubmission);

export default router;