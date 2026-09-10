import express from "express";
import {
  getAllQuizzes, // <--- Import here
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

router.get("/quizzes", getAllQuizzes); // <--- Add GET route for API.get("/quizzes")
router.post("/", createQuiz);
router.put("/:quizId", updateQuiz);
router.delete("/:quizId", deleteQuiz);

router.get("/:quizId/questions", getQuizQuestions);
router.post("/questions", addQuestion);
router.delete("/questions/:questionId", deleteQuestion);

export default router;