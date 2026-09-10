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

router.post("/:quizId/start", handleStartQuiz);
router.post("/attempt/:quizId/submit", handleFinalSubmit);
router.get("/:quizId/results", handleFetchResults);

export default router;