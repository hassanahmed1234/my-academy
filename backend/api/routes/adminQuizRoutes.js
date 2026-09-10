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


router.get("/", protect, getAllQuizzes); // <--- Add GET route for API.get("/quizzes")
router.post("/", protect, adminOnly, createQuiz);
router.put("/:quizId", protect, adminOnly, updateQuiz);
router.delete("/:quizId", protect, adminOnly, deleteQuiz);

router.get("/:quizId/questions", protect,  getQuizQuestions);
router.post("/questions", protect, adminOnly, addQuestion);
router.delete("/questions/:questionId", protect, adminOnly, deleteQuestion);

export default router;