import express from "express";
import { awardXpDirect } from "../controllers/awardXpController.js";
import { protect } from "../middleware/authMiddleware.js"; // Aapka auth middleware

const router = express.Router();

// POST /api/xp/award
router.post("/award", protect, awardXpDirect);

export default router;