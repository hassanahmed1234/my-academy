import express from "express";
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  getQuizQuestions,
  deleteQuestion,
} from "../controllers/adminQuizController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.post("/quizzes", createQuiz);
router.put("/quizzes/:quizId", updateQuiz);
router.delete("/quizzes/:quizId", deleteQuiz);

router.get("/quizzes/:quizId/questions", getQuizQuestions);
router.post("/questions", addQuestion);
router.delete("/questions/:questionId", deleteQuestion);

export default router;