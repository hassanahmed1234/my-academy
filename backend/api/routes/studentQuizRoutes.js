import express from "express";
import {
  handleStartQuiz,
  handleSaveAnswer,
  handleLogViolation,
  handleFinalSubmit,
  handleFetchResults,
} from "../controllers/studentQuizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/:quizId/start", handleStartQuiz);
router.post("/attempt/:attemptId/answer", handleSaveAnswer); // <--- Added
router.post("/attempt/:attemptId/violation", handleLogViolation); // <--- Added
router.post("/attempt/:attemptId/submit", handleFinalSubmit);
router.get("/attempt/:attemptId/result", handleFetchResults);

export default router;