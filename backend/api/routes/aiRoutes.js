import express from "express";
import { askAiAssistant, getAiPoints } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js"; // Aapka existing JWT Auth Middleware

const router = express.Router();

// Routes protected with JWT auth
router.get("/points", protect, getAiPoints);
router.post("/ask", protect, askAiAssistant);

export default router;