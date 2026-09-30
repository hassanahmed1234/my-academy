import express from "express";
import { askAiAssistant, getAiPoints, getRecentChats } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js"; // Aapka existing JWT Auth Middleware

const router = express.Router();

// Routes protected with JWT auth
router.get("/points", protect, getAiPoints);
router.post("/ask", protect, askAiAssistant);
router.get("/history", protect, getRecentChats);

export default router;