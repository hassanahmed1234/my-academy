import express from "express";
import {
  handleStartQuiz,
  handleFinalSubmit,
  handleFetchResults,
} from "../controllers/studentQuizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public / Student Protected Routes
router.use(protect);

router.get("/:quizId/start", handleStartQuiz);
router.post("/:quizId/submit", handleFinalSubmit);
router.get("/:quizId/results", handleFetchResults);

export default router;